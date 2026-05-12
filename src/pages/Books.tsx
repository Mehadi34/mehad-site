/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Search, SlidersHorizontal, BookOpen, X, User, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  status: string;
  bookCode?: string;
  shelfNo?: string;
  tags?: string[];
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সকল বিভাগ');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      setBooks(booksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'books');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'সকল বিভাগ' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen bg-stone-50/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 mt-6 sm:mt-10 px-4">
          <h1 className="text-3xl sm:text-[42px] font-black text-stone-900 mb-2 leading-tight">বই সংগ্রহশালা</h1>
          <p className="text-stone-400 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">লাইব্রেরির সকল বইয়ের সংগ্রহ অনলাইন থেকে দেখে নিন এবং আপনার পছন্দের বইটি প্রিবুক করুন।</p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-16 flex flex-col md:flex-row gap-4 items-center px-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
            <input 
              type="text" 
              placeholder="বইয়ের নাম বা লেখক দিয়ে খুঁজুন..."
              className="w-full bg-white border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] pl-16 pr-8 py-4 sm:py-5 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium text-stone-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-auto">
             <select 
              className="w-full md:w-[240px] bg-white border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] px-8 py-4 sm:py-5 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-bold appearance-none cursor-pointer text-stone-600"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
             >
                <option>সকল বিভাগ</option>
                <option>উপন্যাস</option>
                <option>কবিতা</option>
                <option>ইতিহাস</option>
                <option>বিজ্ঞান</option>
                <option>ইসলামী বই</option>
             </select>
             <X size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 rotate-45 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
             <p className="text-stone-500 font-bold">লোড হচ্ছে...</p>
          </div>
        ) : (
          <>
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 px-4">
                 {filteredBooks.map((book) => (
                   <motion.div 
                     key={book.id}
                     whileHover={{ y: -8 }}
                     className="group cursor-pointer"
                     onClick={() => setSelectedBook(book)}
                   >
                     <div className="aspect-[3/4.2] relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-white p-2 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                        <div className="w-full h-full overflow-hidden rounded-[1.8rem] bg-stone-100">
                          <img 
                            src={book.imageUrl || 'https://images.unsplash.com/photo-1543005187-9eb71dda8e81?auto=format&fit=crop&q=80&w=400'} 
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                           <span className={`px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${
                             book.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                           } shadow-lg`}>
                             {book.status === 'available' ? 'উপলব্ধ' : 'ভাড়া দেওয়া'}
                           </span>
                        </div>
                     </div>

                     <div className="mt-4 sm:mt-6 px-2">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-primary mb-1 sm:mb-2 opacity-70">{book.category}</p>
                        <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">{book.title}</h3>
                        <p className="text-xs sm:text-sm text-stone-400 font-medium mt-1">{book.author}</p>
                        <button className="mt-3 sm:mt-4 flex items-center gap-2 text-stone-900 font-black text-[10px] sm:text-xs uppercase tracking-widest hover:gap-3 transition-all">
                           <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                             <BookOpen size={12} />
                           </div>
                           প্রিবুক করুন
                        </button>
                     </div>
                   </motion.div>
                 ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white rounded-[3rem] sm:rounded-[4rem] border border-stone-100 shadow-sm mx-4">
                 <p className="text-lg sm:text-xl font-bold text-stone-300 tracking-tight">কোনো বই পাওয়া যায়নি</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-md overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] sm:rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative shadow-[0_30px_100px_rgba(0,0,0,0.4)] custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-md text-stone-400 hover:text-stone-900 rounded-full flex items-center justify-center transition-all z-20 border border-stone-100 shadow-sm"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="w-full md:w-[45%] bg-stone-50 p-6 sm:p-16 flex items-center justify-center shrink-0">
                <div className="w-full max-w-[300px] aspect-[3/4.5] shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden rotate-[-2deg] hover:rotate-0 transition-transform duration-500 bg-stone-200">
                   <img src={selectedBook.imageUrl} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-grow p-6 sm:p-16 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                   <span className="bg-[#f0edff] text-brand-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider">{selectedBook.category || 'সাধারণ'}</span>
                   <span className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2">
                     <CheckCircle2 size={12} /> এভেইলবল
                   </span>
                </div>

                <h1 className="text-2xl sm:text-5xl font-black text-stone-900 leading-[1.2] mb-4 sm:mb-6 tracking-tight">{selectedBook.title}</h1>
                
                <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 text-stone-500 font-bold">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-100 rounded-full flex items-center justify-center">
                     <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />
                   </div>
                   <p className="text-base sm:text-lg">মূল: {selectedBook.author}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                   <div className="bg-stone-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-100">
                      <p className="text-[9px] sm:text-[10px] uppercase font-black text-stone-400 mb-1 sm:mb-2 tracking-widest">বই কোড</p>
                      <p className="text-xs sm:text-sm font-black text-stone-900">{selectedBook.bookCode || 'N/A'}</p>
                   </div>
                   <div className="bg-stone-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-100">
                      <p className="text-[9px] sm:text-[10px] uppercase font-black text-stone-400 mb-1 sm:mb-2 tracking-widest">সেলফ নং</p>
                      <p className="text-xs sm:text-sm font-black text-stone-900">{selectedBook.shelfNo || 'N/A'}</p>
                   </div>
                   <div className="bg-stone-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-100 col-span-2 lg:col-span-1">
                      <p className="text-[9px] sm:text-[10px] uppercase font-black text-stone-400 mb-1 sm:mb-2 tracking-widest">ক্যাটাগরি</p>
                      <p className="text-xs sm:text-sm font-black text-stone-900">{selectedBook.category || 'সাধারণ'}</p>
                   </div>
                </div>

                <button className="w-full bg-[#0f172a] text-white py-5 sm:py-6 rounded-[2rem] font-black text-base sm:text-lg flex items-center justify-center gap-3 sm:gap-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl">
                   <Clock className="w-5 h-5 sm:w-6 sm:h-6 opacity-60" /> প্রিবুক করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
