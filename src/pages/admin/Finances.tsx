/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { TrendingUp, TrendingDown, Wallet, Printer, Filter, Receipt, PieChart as PieChartIcon, Trash2, Plus, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';

interface Transaction {
  id: string;
  date: any;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
}

export default function Finances() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    desc: '',
    amount: '',
    type: 'expense' as 'income' | 'expense'
  });

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(txData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'transactions');
    });

    return () => unsubscribe();
  }, []);

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const balance = totalIncome - totalExpense;

  const chartData = [
    { name: 'আয়', value: totalIncome || 1, color: '#10b981' },
    { name: 'ব্যয়', value: totalExpense || 1, color: '#ef4444' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'transactions'), {
        desc: formData.desc,
        amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
        type: formData.type,
        date: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ desc: '', amount: '', type: 'expense' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই লেনদেনটি মুছতে নিশ্চিত?')) {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'transactions');
      }
    }
  };

  return (
    <AdminLayout title="হিসাব-নিকাশ (Finances)">
      <div className="space-y-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                 <TrendingUp size={32} />
              </div>
              <div>
                 <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">মোট আয়</p>
                 <h3 className="text-3xl font-black text-stone-900">৳ {totalIncome}</h3>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-rose-50 text-rose-600">
                 <TrendingDown size={32} />
              </div>
              <div>
                 <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">মোট ব্যয়</p>
                 <h3 className="text-3xl font-black text-stone-900">৳ {totalExpense}</h3>
              </div>
           </div>
           <div className="bg-[#1A1D21] p-8 rounded-[2rem] text-white flex items-center gap-6 shadow-xl shadow-stone-900/10">
              <div className="p-4 rounded-2xl bg-brand-primary/20 text-brand-primary">
                 <Wallet size={32} />
              </div>
              <div>
                 <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">বর্তমান ব্যালেন্স</p>
                 <h3 className="text-3xl font-black text-white">৳ {balance}</h3>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Transactions Table */}
           <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
                 <h2 className="text-xl font-black text-stone-900 flex items-center gap-3">
                    <Receipt size={20} className="text-brand-primary" /> লেনদেনের রেকর্ড
                 </h2>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-brand-primary text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-secondary transition-all flex items-center gap-2"
                    >
                       <Plus size={14} /> এড রেকর্ড
                    </button>
                    <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all">
                       <Printer size={18} />
                    </button>
                 </div>
              </div>

              <div className="overflow-x-auto -mx-10 px-10">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-stone-300 text-[10px] font-black uppercase tracking-widest border-b border-stone-50">
                          <th className="pb-6 px-4">তারিখ</th>
                          <th className="pb-6 px-4">বিবরণ</th>
                          <th className="pb-6 px-4 text-center">পরিমাণ</th>
                          <th className="pb-6 px-4 text-right">অ্যাকশন</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="py-10 text-center text-stone-400 font-bold">লোড হচ্ছে...</td>
                          </tr>
                        ) : transactions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-10 text-center text-stone-400 font-bold">কোন লেনদেনের রেকর্ড নেই</td>
                          </tr>
                        ) : (
                          transactions.map((tx) => (
                            <tr key={tx.id} className="group hover:bg-stone-50 transition-all">
                               <td className="py-5 px-4 text-xs font-bold text-stone-400">
                                  {tx.date?.toDate().toLocaleDateString('en-GB') || 'N/A'}
                               </td>
                               <td className="py-5 px-4 text-sm font-black text-stone-800">{tx.desc}</td>
                               <td className={`py-5 px-4 text-sm font-black text-center ${tx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                  ৳ {tx.amount}
                               </td>
                               <td className="py-5 px-4 text-right">
                                  <button 
                                    onClick={() => handleDelete(tx.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 transition-all"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                               </td>
                            </tr>
                          ))
                        )}
                     </tbody>
                 </table>
              </div>
           </div>

           {/* Charts */}
           <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm flex flex-col items-center">
                 <div className="w-full flex justify-between items-center mb-10">
                    <h2 className="text-xl font-black text-stone-900">আয় বনাম ব্যয়</h2>
                    <PieChartIcon size={20} className="text-stone-400" />
                 </div>
                 
                 <div className="w-full h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={chartData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                          >
                             {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                       <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest leading-none px-4">ব্যালেন্স</p>
                       <p className="text-xl font-black text-stone-900">৳ {balance}</p>
                    </div>
                 </div>

                 <div className="mt-10 w-full space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs font-black text-stone-600 uppercase tracking-widest">আয়</span>
                       </div>
                       <span className="text-xs font-black text-stone-900">৳ {totalIncome}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-100">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                          <span className="text-xs font-black text-stone-600 uppercase tracking-widest">ব্যয়</span>
                       </div>
                       <span className="text-xs font-black text-stone-900">৳ {totalExpense}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <h3 className="text-xl font-black text-stone-900">লেনদেন যোগ করুন</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">বিবরণ</label>
                   <input 
                     required
                     type="text" 
                     value={formData.desc}
                     onChange={(e) => setFormData({...formData, desc: e.target.value})}
                     className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                     placeholder="যেমন: মাসিক ভাড়া"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">পরিমাণ (৳)</label>
                   <input 
                     required
                     type="number" 
                     value={formData.amount}
                     onChange={(e) => setFormData({...formData, amount: e.target.value})}
                     className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                     placeholder="0.00"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">ধরন</label>
                   <div className="flex gap-2">
                      {(['income', 'expense'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, type})}
                          className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                            formData.type === type 
                            ? (type === 'income' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-rose-500 text-white border-rose-500')
                            : 'bg-stone-50 border-stone-100 text-stone-400'
                          }`}
                        >
                           {type === 'income' ? 'আয়' : 'ব্যয়'}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="pt-6">
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'সংরক্ষণ করুন'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
