/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ScanBarcode, Maximize2, Loader2, Book as BookIcon, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  code: string;
  author: string;
  category: string;
  status: string;
}

export default function Scanner() {
  const [scannedCode, setScannedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // delay initialization slightly to ensure element is in DOM
    const timer = setTimeout(() => {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          console.error("Cleanup error", e);
        }
      }
    };
  }, []);

  const onScanSuccess = (decodedText: string) => {
    setScannedCode(decodedText);
    handleSearch(decodedText);
  };

  const onScanFailure = (error: any) => {
    // console.warn(`Code scan error = ${error}`);
  };

  const handleSearch = async (code: string) => {
    if (!code) return;
    setLoading(true);
    setError('');
    setBook(null);

    try {
      // First try to find by custom code
      const qCode = query(collection(db, 'books'), where('code', '==', code.trim().toUpperCase()));
      const snapshotCode = await getDocs(qCode);
      
      if (!snapshotCode.empty) {
        const doc = snapshotCode.docs[0];
        setBook({ id: doc.id, ...doc.data() } as Book);
        return;
      }

      // If not found by code, try by document ID (useful for legacy books or direct ID scans)
      const qId = query(collection(db, 'books'), where('__name__', '==', code.trim()));
      const snapshotId = await getDocs(qId);

      if (!snapshotId.empty) {
        const doc = snapshotId.docs[0];
        setBook({ id: doc.id, ...doc.data() } as Book);
      } else {
        setError('বইটি পাওয়া যায়নি। কোডটি পুনরায় চেক করুন।');
      }
    } catch (err) {
      console.error(err);
      setError('তথ্য খুঁজতে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickIssue = () => {
    if (book) {
      navigate('/admin/issues', { state: { bookId: book.id, bookTitle: book.title, bookCode: book.code } });
    }
  };

  return (
    <AdminLayout title="বারকোড স্ক্যানার">
       <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-black text-stone-900">বারকোড স্ক্যানার</h2>
             <p className="text-stone-500 font-medium">ক্যামেরা অথবা বারকোড মেশিন ব্যবহার করে বই খুঁজুন।</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Scanner Column */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6">
                <div id="reader" className="bg-stone-900 rounded-[2rem] overflow-hidden border-4 border-stone-100 shadow-xl overflow-hidden min-h-[300px]"></div>
                
                <div className="space-y-4">
                   <div className="relative">
                      <input 
                        type="text" 
                        value={scannedCode}
                        onChange={(e) => setScannedCode(e.target.value)}
                        placeholder="বারকোড কোড লিখুন..."
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-8 py-5 text-center font-black text-stone-800 placeholder:text-stone-300 focus:border-brand-primary outline-none transition-all uppercase tracking-widest"
                      />
                   </div>
                   <button 
                    onClick={() => handleSearch(scannedCode)}
                    disabled={loading}
                    className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all disabled:opacity-50"
                   >
                      {loading ? <Loader2 className="animate-spin" /> : <><Maximize2 size={18} /> তথ্য খুঁজুন</>}
                   </button>
                </div>
             </div>

             {/* Result Column */}
             <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 flex flex-col items-center justify-center min-h-[400px]">
                {loading ? (
                   <div className="text-center space-y-4">
                      <Loader2 className="animate-spin text-brand-primary mx-auto" size={48} />
                      <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">সার্ভার থেকে তথ্য আসছে...</p>
                   </div>
                ) : book ? (
                   <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
                      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-brand-primary/20 space-y-6">
                         <div className="flex items-start gap-6">
                            <div className="w-24 h-32 bg-stone-100 rounded-xl flex items-center justify-center text-stone-300 shrink-0 shadow-sm">
                               <BookIcon size={40} />
                            </div>
                            <div className="space-y-2">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  book.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                               }`}>
                                  {book.status === 'available' ? 'এভেইলএবল' : 'রেন্টেড'}
                               </span>
                               <h3 className="text-2xl font-black text-stone-900 leading-tight">{book.title}</h3>
                               <p className="text-stone-400 font-bold">{book.author}</p>
                               <div className="flex gap-2 pt-2">
                                  <span className="text-[10px] font-black bg-stone-100 px-2 py-1 rounded tracking-tighter uppercase">{book.category}</span>
                                  <span className="text-[10px] font-black bg-brand-primary/10 text-brand-primary px-2 py-1 rounded tracking-tighter uppercase">{book.code}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 pt-4">
                            <button 
                              onClick={handleQuickIssue}
                              className="bg-brand-primary text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                            >
                              ইস্যু করুন
                            </button>
                            <button 
                              onClick={() => navigate('/admin/inventory')}
                              className="bg-stone-100 text-stone-600 py-4 rounded-xl font-black text-sm hover:bg-stone-200 transition-all"
                            >
                              বিস্তারিত দেখুন
                            </button>
                         </div>
                      </div>

                      <button 
                        onClick={() => {
                          setBook(null);
                          setScannedCode('');
                        }}
                        className="w-full flex items-center justify-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest hover:text-stone-600"
                      >
                         <RefreshCw size={14} /> রিসেট করুন
                      </button>
                   </div>
                ) : error ? (
                   <div className="text-center space-y-4">
                      <X className="text-rose-500 mx-auto" size={64} />
                      <h3 className="text-xl font-black text-stone-900">{error}</h3>
                      <p className="text-stone-400 text-sm font-medium">ভুল কোড স্ক্যান করেছেন অথবা বইটি ডেটাবেজে নেই।</p>
                   </div>
                ) : (
                   <div className="text-center space-y-4 opacity-30">
                      <ScanBarcode className="mx-auto" size={80} />
                      <h3 className="text-xl font-black">স্ক্যানিং রেজাল্ট</h3>
                      <p className="text-sm font-medium max-w-xs">ক্যামেরা অথবা বারকোড মেশিন দিয়ে স্ক্যান করলে এখানে বইয়ের তথ্য দেখা যাবে।</p>
                   </div>
                )}
             </div>
          </div>
       </div>

       <style>{`
          #reader { border: none !important; border-radius: 2rem !important; overflow: hidden !important; }
          #reader video { border-radius: 2rem !important; object-fit: cover !important; }
          #reader__dashboard_section_csr button {
             background: #5145CD !important;
             color: white !important;
             border: none !important;
             padding: 10px 20px !important;
             border-radius: 12px !important;
             font-weight: 900 !important;
             text-transform: uppercase !important;
             font-size: 10px !important;
             margin: 10px 0 !important;
          }
          #reader__camera_selection {
             background: #f5f5f4 !important;
             border: 1px solid #e7e5e4 !important;
             border-radius: 12px !important;
             padding: 8px !important;
             font-size: 12px !important;
             font-weight: 700 !important;
          }
       `}</style>
    </AdminLayout>
  );
}
