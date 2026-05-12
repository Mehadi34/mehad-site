/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Plus, Search, Filter, Download, Edit2, Trash2, BookOpen, X, Loader2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  code?: string;
  isbn?: string;
  coverImage?: string;
  status?: string;
}

export default function Inventory() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [qrModalBook, setQrModalBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'গল্প/উপন্যাস',
    code: '',
    isbn: '',
    coverImage: '',
    status: 'available'
  });

  const generateCode = () => {
    const prefix = formData.category.slice(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData({ ...formData, code: `${prefix}-${random}` });
  };

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('title', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(booksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'books');
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        code: book.code || '',
        isbn: book.isbn || '',
        coverImage: book.coverImage || '',
        status: book.status || 'available'
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        category: 'গল্প/উপন্যাস',
        code: '',
        isbn: '',
        coverImage: '',
        status: 'available'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBook) {
        const bookRef = doc(db, 'books', editingBook.id);
        await updateDoc(bookRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'books'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingBook ? OperationType.UPDATE : OperationType.CREATE, 'books');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই বইটি ডিলিট করতে নিশ্চিত?')) {
      try {
        await deleteDoc(doc(db, 'books', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'books');
      }
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="বইয়ের তালিকা (Inventory)">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-[#1A1D21] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-stone-900/10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-black">বই ব্যবস্থাপনা</h2>
            <p className="text-stone-400 font-medium">লাইব্রেরির বইয়ের ক্যাটালগ পরিচালনা করুন।</p>
            <div className="flex gap-4">
               <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/5">
                  <Download size={18} /> তালিকা ডাউনলোড
               </button>
               <button 
                  onClick={() => handleOpenModal()}
                  className="bg-brand-primary hover:bg-brand-secondary px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30"
               >
                  <Plus size={18} /> বই যোগ করুন
               </button>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5 min-w-[140px]">
                <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-1">মোট বই</p>
                <h4 className="text-2xl font-black">{books.length}</h4>
             </div>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5 min-w-[140px]">
                <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-1">অ্যাভেইলবল</p>
                <h4 className="text-2xl font-black text-emerald-400">{books.length}</h4>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                type="text" 
                placeholder="বইয়ের নাম, লেখক বা ক্যাটাগরি সার্চ করুন..."
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-500 hover:bg-stone-100 transition-all flex items-center gap-2 font-bold">
              <Filter size={18} /> ক্যাটাগরি ফিল্টার
           </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-stone-100 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <AnimatePresence>
              {filteredBooks.map((book, idx) => (
                <motion.div 
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-4 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group relative h-full flex flex-col"
                >
                  <div className="relative aspect-[2/3] mb-6 overflow-hidden rounded-[2rem]">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-stone-50 flex items-center justify-center text-stone-200">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                       সক্রিয়
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4 flex-1">
                    <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">{book.category}</p>
                    <h3 className="font-black text-stone-900 leading-tight line-clamp-2">{book.title}</h3>
                    <p className="text-stone-500 text-xs font-bold truncate">লেখক: {book.author}</p>
                  </div>

                  <div className="pt-4 border-t border-stone-50 flex flex-col gap-2">
                    <div className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">
                      {book.code ? `CODE: ${book.code}` : `BID: ${book.id.slice(-6)}`}
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setQrModalBook(book)}
                         className="flex-1 p-2.5 bg-stone-50 text-stone-400 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary transition-all"
                         title="QR কোড"
                       >
                          <QrCode size={16} />
                       </button>
                       <button 
                         onClick={() => handleOpenModal(book)}
                         className="flex-1 p-2.5 bg-stone-50 text-stone-400 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary transition-all"
                         title="এডিট"
                       >
                          <Edit2 size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(book.id)}
                         className="flex-1 p-2.5 bg-stone-50 text-stone-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* QR Code Modal */}
        <AnimatePresence>
          {qrModalBook && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setQrModalBook(null)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 flex flex-col items-center gap-6 shadow-2xl"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-stone-900">{qrModalBook.title}</h3>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">বইয়ের QR কোড</p>
                </div>
                
                <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100">
                  <QRCodeCanvas 
                    id={`qr-${qrModalBook.id}`}
                    value={qrModalBook.code || qrModalBook.id} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="text-center">
                  <span className="text-lg font-black text-brand-primary uppercase tracking-widest">
                    {qrModalBook.code || qrModalBook.id.slice(-6)}
                  </span>
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      const canvas = document.getElementById(`qr-${qrModalBook.id}`) as HTMLCanvasElement;
                      if (canvas) {
                        const pngUrl = canvas.toDataURL("image/png");
                        const downloadLink = document.createElement("a");
                        downloadLink.href = pngUrl;
                        downloadLink.download = `QR_${qrModalBook.title}.png`;
                        downloadLink.click();
                      }
                    }}
                    className="bg-brand-primary text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> ডাউনলোড
                  </button>
                  <button 
                    onClick={() => setQrModalBook(null)}
                    className="bg-stone-100 text-stone-600 py-4 rounded-2xl font-black text-sm"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                  <div>
                    <h3 className="text-2xl font-black text-stone-900">
                      {editingBook ? 'বই এডিট করুন' : 'নতুন বই যোগ করুন'}
                    </h3>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">ক্যাটালগ ইনফরমেশন</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 bg-white border border-stone-100 rounded-2xl text-stone-400 hover:text-stone-900 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">বইয়ের নাম</label>
                       <input 
                         required
                         type="text" 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                         placeholder="বইয়ের নাম লিখুন"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">লেখকের নাম</label>
                       <input 
                         required
                         type="text" 
                         value={formData.author}
                         onChange={(e) => setFormData({...formData, author: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                         placeholder="লেখকের নাম লিখুন"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">ক্যাটাগরি</label>
                       <select 
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none"
                       >
                          <option>গল্প/উপন্যাস</option>
                          <option>কবিতা</option>
                          <option>ইতিহাস</option>
                          <option>বিজ্ঞান</option>
                          <option>ধর্মীয়</option>
                          <option>অন্যান্য</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4 flex justify-between">
                          বইয়ের কোড
                          <button type="button" onClick={generateCode} className="text-brand-primary hover:underline lowercase tracking-normal">অটো জেনারেট</button>
                       </label>
                       <input 
                         required
                         type="text" 
                         value={formData.code}
                         onChange={(e) => setFormData({...formData, code: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none uppercase"
                         placeholder="যেমন: CHI-8688"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">ISBN (ঐচ্ছিক)</label>
                       <input 
                         type="text" 
                         value={formData.isbn}
                         onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                         placeholder="ISBN কোড"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">কভার ইমেজ লিংক (URL)</label>
                     <input 
                       type="url" 
                       value={formData.coverImage}
                       onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                       className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                       placeholder="https://example.com/image.jpg"
                     />
                  </div>

                  {formData.coverImage && (
                    <div className="flex justify-center">
                      <div className="w-32 aspect-[2/3] bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
                        <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-stone-100">
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : editingBook ? 'আপডেট করুন' : 'বই যোগ করুন'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
