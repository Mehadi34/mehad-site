/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { TrendingUp, TrendingDown, DollarSign, ListFilter, IndianRupee } from 'lucide-react';
import { motion } from 'motion/react';

interface Transaction {
  id: string;
  date: any;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export default function Accounts() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-4 px-4">আয়-ব্যয় হিসাব (Finance)</h1>
          <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl mx-auto px-4">সচ্ছতা ও জবাবদিহিতার জন্য আমাদের পাঠাগারের সকল আর্থিক লেনদেন সরাসরি দেখুন।</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
           {[
             { label: 'মোট আয়', value: `৳${totalIncome.toLocaleString('bn-BD')}`, icon: <TrendingUp size={24} />, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
             { label: 'মোট ব্যয়', value: `৳${totalExpenses.toLocaleString('bn-BD')}`, icon: <TrendingDown size={24} />, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
             { label: 'বর্তমান ব্যালেন্স', value: `৳${balance.toLocaleString('bn-BD')}`, icon: <DollarSign size={24} />, color: 'bg-brand-accent text-brand-primary', border: 'border-brand-primary/10' },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white border ${stat.border} shadow-sm hover:shadow-xl transition-all ${i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
             >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                   {stat.icon}
                </div>
                <p className="text-[10px] sm:text-sm font-bold text-stone-400 uppercase tracking-widest mb-1 sm:mb-2">{stat.label}</p>
                <h3 className="text-2xl sm:text-4xl font-black text-stone-900">{stat.value}</h3>
             </motion.div>
           ))}
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
           <div className="p-6 sm:p-10 flex border-b border-stone-50 justify-between items-center bg-stone-50/30">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">সাম্প্রতিক লেনদেন</h2>
              <button className="flex items-center gap-2 text-stone-400 font-bold hover:text-stone-900 transition-colors text-sm sm:text-base">
                <ListFilter size={18} /> ফিল্টার
              </button>
           </div>
           
           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left min-w-[600px] sm:min-w-0">
                <thead>
                   <tr className="border-b border-stone-50 uppercase text-[10px] font-black text-stone-400 tracking-widest bg-stone-50/50">
                      <th className="px-6 sm:px-10 py-4 sm:py-6 text-center sm:text-left">তারিখ</th>
                      <th className="px-6 sm:px-10 py-4 sm:py-6">বিবরণ</th>
                      <th className="px-6 sm:px-10 py-4 sm:py-6 text-right">পরিমাণ</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                   {loading ? (
                     <tr><td colSpan={3} className="px-6 sm:px-10 py-20 text-center font-bold text-stone-300">লোড হচ্ছে...</td></tr>
                   ) : (
                     transactions.length > 0 ? transactions.map((t) => (
                       <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 sm:px-10 py-4 sm:py-6 text-xs sm:text-sm font-bold text-stone-500 text-center sm:text-left">
                             {new Date(t.date).toLocaleDateString('bn-BD')}
                          </td>
                          <td className="px-6 sm:px-10 py-4 sm:py-6 flex items-center gap-3 sm:gap-4">
                             <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {t.type === 'income' ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                             </div>
                             <span className="font-bold text-stone-800 text-sm sm:text-base line-clamp-1">{t.description}</span>
                          </td>
                          <td className={`px-6 sm:px-10 py-4 sm:py-6 text-right font-black text-lg sm:text-xl ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                             {t.type === 'income' ? '+' : '-'}৳{t.amount.toLocaleString('bn-BD')}
                          </td>
                       </tr>
                     )) : (
                       <tr><td colSpan={3} className="px-6 sm:px-10 py-20 text-center font-bold text-stone-300">কোনো লেনদেন রেকর্ড নেই</td></tr>
                     )
                   )}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
