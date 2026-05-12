/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Printer, QrCode, Plus, Loader2, Book as BookIcon, Download } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { QRCodeCanvas } from 'qrcode.react';

interface Book {
  id: string;
  title: string;
  code: string;
  category: string;
}

export default function Stickers() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('title', 'asc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(bookData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'books');
    });

    return () => unsubscribe();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const downloadQR = (id: string, title: string) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_${title.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <AdminLayout title="স্টিকার ও QR (Stickers)">
       <div className="space-y-8">
          <div className="bg-[#1A1D21] rounded-[2.5rem] p-10 text-white flex justify-between items-center shadow-xl shadow-stone-900/10 print:hidden">
             <div className="space-y-4">
                <h2 className="text-4xl font-black">বইয়ের স্টিকার ও বারকোড</h2>
                <p className="text-stone-400 font-medium">বইয়ের জন্য ইউনিক বারকোড স্টিকার জেনারেট এবং পরিচালনা করুন।</p>
                <div className="flex flex-wrap gap-4">
                   <button 
                    onClick={handlePrint}
                    className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/5"
                   >
                      <Printer size={18} /> ব্যাচ প্রিন্ট
                   </button>
                </div>
             </div>
             <QrCode size={120} className="text-brand-primary/20 hidden md:block" />
          </div>

          <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-10 print:p-0 print:shadow-none print:border-none">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-3 print:gap-4">
                {loading ? (
                   <div className="col-span-full py-20 flex flex-col items-center gap-4 print:hidden">
                      <Loader2 className="animate-spin text-brand-primary" size={40} />
                      <p className="text-stone-400 font-bold">লোড হচ্ছে...</p>
                   </div>
                ) : books.length === 0 ? (
                   <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center print:hidden">
                      <QrCode size={80} className="text-stone-100" />
                      <h3 className="text-xl font-black text-stone-900">কোনো বই পাওয়া যায়নি</h3>
                      <p className="text-stone-400 font-medium max-w-xs">ক্যাটালগ থেকে বই সিলেক্ট করে স্টিকার জেনারেট করুন।</p>
                   </div>
                ) : (
                   books.map((book) => (
                      <div key={book.id} className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 flex flex-col items-center gap-4 group hover:border-brand-primary transition-all print:bg-white print:border-stone-200 print:rounded-none">
                         <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform print:shadow-none print:p-2">
                            <QRCodeCanvas 
                              id={book.id}
                              value={book.code || book.id} 
                              size={120}
                              level="H"
                              includeMargin={true}
                            />
                         </div>
                         <div className="text-center">
                            <h4 className="font-black text-stone-900 text-sm mb-1 leading-tight">{book.title}</h4>
                            <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{book.code || ''}</p>
                         </div>
                         <div className="w-full flex gap-2 print:hidden">
                           <button 
                            onClick={() => downloadQR(book.id, book.title)}
                            className="flex-1 bg-white text-stone-600 p-3 rounded-xl text-xs font-black border border-stone-200 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                           >
                              <Download size={14} /> ডাউনলোড
                           </button>
                         </div>
                      </div>
                   ))
                )}
             </div>
          </div>
       </div>

       <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-container, .print-container * { visibility: visible; }
            .print-container { position: absolute; left: 0; top: 0; width: 100%; }
            
            /* Actually just show the main content area */
            #root > div > div > main { visibility: visible !important; }
            #root > div > div > main * { visibility: visible !important; }
            
            /* Hide sidebar and navbar */
            aside, nav { display: none !important; }
          }
       `}</style>
    </AdminLayout>
  );
}
