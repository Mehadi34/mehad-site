/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { CreditCard, Search, Filter, CheckCircle2, AlertCircle, Loader2, DollarSign, User, X, Plus } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Due {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'paid';
  createdAt: any;
}

export default function Dues() {
  const [dues, setDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    amount: '',
    reason: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'dues'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dueData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Due[];
      setDues(dueData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'dues');
    });

    return () => unsubscribe();
  }, []);

  const handlePay = async (id: string) => {
    if (window.confirm('আপনি কি এই বকেয়াটি পরিশোধিত হিসেবে মার্ক করতে চান?')) {
      try {
        await updateDoc(doc(db, 'dues', id), {
          status: 'paid',
          paidAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'dues');
      }
    }
  };

  const handleAddDue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'dues'), {
        memberId: formData.memberId,
        memberName: formData.memberName,
        amount: Number(formData.amount),
        reason: formData.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ memberId: '', memberName: '', amount: '', reason: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'dues');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDues = dues.filter(due => 
    due.memberName.toLowerCase().includes(search.toLowerCase()) ||
    due.memberId.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = dues
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <AdminLayout title="সদস্যদের বকেয়া (Dues)">
       <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                   <h2 className="text-3xl font-black text-stone-900 leading-tight">সদস্যদের বকেয়া ও ফাইন</h2>
                   <p className="text-stone-500 font-medium">বই ফেরত বিলম্ব বা অন্যান্য কারণে সদস্যদের বকেয়া ম্যানেজ করুন।</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-brand-primary/20 flex items-center gap-2 hover:bg-brand-secondary transition-all shrink-0"
                >
                   <Plus size={20} /> নতুন বকেয়া যোগ করুন
                </button>
             </div>
             <div className="bg-[#1A1D21] p-10 rounded-[2.5rem] text-white flex flex-col justify-center items-center gap-2 shadow-xl shadow-stone-900/10">
                <AlertCircle className="text-rose-500 mb-2" size={32} />
                <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest leading-none">মোট বকেয়া পরিমাণ</p>
                <h3 className="text-4xl font-black text-white">৳ {totalPending}</h3>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <div className="relative w-full max-w-md">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                   <input 
                     type="text" 
                     placeholder="সদস্যের নাম বা আইডি..." 
                     className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-14 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <select className="appearance-none bg-stone-50 border border-stone-100 rounded-2xl pl-6 pr-12 py-4 text-xs font-black uppercase tracking-widest outline-none">
                         <option>সব স্ট্যাটাস</option>
                         <option>বকেয়া</option>
                         <option>পরিশোধিত</option>
                      </select>
                      <Filter size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                   </div>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="text-stone-300 text-[10px] font-black uppercase tracking-widest border-b border-stone-50">
                         <th className="pb-6 text-left">সদস্য</th>
                         <th className="pb-6 text-left">কারণ</th>
                         <th className="pb-6 text-center">পরিমাণ</th>
                         <th className="pb-6 text-center">স্ট্যাটাস</th>
                         <th className="pb-6 text-right">অ্যাকশন</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-50">
                      {loading ? (
                         <tr>
                            <td colSpan={5} className="py-20 text-center text-stone-400 font-bold">লোড হচ্ছে...</td>
                         </tr>
                      ) : filteredDues.length === 0 ? (
                         <tr>
                            <td colSpan={5} className="py-20 text-center text-stone-400 font-bold">কোনো বকেয়ার রেকর্ড পাওয়া যায়নি</td>
                         </tr>
                      ) : (
                         filteredDues.map((due) => (
                            <tr key={due.id} className="group hover:bg-stone-50/50 transition-all">
                               <td className="py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-stone-300">
                                        <User size={20} />
                                     </div>
                                     <div>
                                        <h4 className="font-black text-stone-800 leading-tight">{due.memberName}</h4>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">ID: {due.memberId}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="py-6">
                                  <p className="text-sm font-medium text-stone-600">{due.reason}</p>
                               </td>
                               <td className="py-6 text-center">
                                  <span className="text-sm font-black text-stone-900">৳ {due.amount}</span>
                               </td>
                               <td className="py-6 text-center">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    due.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                     {due.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                                  </span>
                               </td>
                               <td className="py-6 text-right">
                                  {due.status === 'pending' && (
                                     <button 
                                      onClick={() => handlePay(due.id)}
                                      className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
                                     >
                                        <CheckCircle2 size={14} /> পে করুন
                                     </button>
                                  )}
                               </td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
       </div>

       {/* Add Due Modal */}
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
                  <h3 className="text-xl font-black text-stone-900 flex items-center gap-3">
                    <CreditCard size={20} className="text-brand-primary" /> বকেয়া যোগ করুন
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAddDue} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">সদস্যের নাম</label>
                       <input 
                         required
                         type="text" 
                         value={formData.memberName}
                         onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                         placeholder="সদস্যের নাম"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">সদস্য আইডি</label>
                       <input 
                         required
                         type="text" 
                         value={formData.memberId}
                         onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                         placeholder="ID"
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">পরিমাণ (৳)</label>
                     <div className="relative">
                        <DollarSign size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" />
                        <input 
                          required
                          type="number" 
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                          placeholder="0.00"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">কারণ</label>
                     <textarea 
                       required
                       value={formData.reason}
                       onChange={(e) => setFormData({...formData, reason: e.target.value})}
                       className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[100px]"
                       placeholder="যেমন: বই ফেরত বিলম্ব (৭ দিন)"
                     />
                  </div>
                  <div className="pt-6">
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : 'তথ্য সংরক্ষণ করুন'}
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
