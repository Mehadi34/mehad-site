/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Heart, Plus, Search, Trash2, Loader2, X, DollarSign, User, Calendar } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Donor {
  id: string;
  name: string;
  amount: number;
  date: any;
  note?: string;
}

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    note: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'donors'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donorData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Donor[];
      setDonors(donorData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'donors');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'donors'), {
        name: formData.name,
        amount: Number(formData.amount),
        note: formData.note,
        date: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ name: '', amount: '', note: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'donors');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই দাতার তথ্য মুছতে নিশ্চিত?')) {
      try {
        await deleteDoc(doc(db, 'donors', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'donors');
      }
    }
  };

  const filteredDonors = donors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalDonation = donors.reduce((sum, d) => sum + d.amount, 0);

  return (
    <AdminLayout title="দাতা সদস্য (Donors)">
       <div className="space-y-8">
          <div className="bg-[#1A1D21] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-stone-900/10 border border-white/5">
             <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="p-3 bg-brand-primary/20 rounded-2xl text-brand-primary">
                    <Heart size={32} />
                  </div>
                  <h2 className="text-4xl font-black">আমাদের দাতা সদস্য</h2>
                </div>
                <p className="text-stone-400 font-medium max-w-md">পাঠাগারের উন্নয়নে যারা আর্থিক ও শ্রম দিয়ে সহযোগিতা করছেন তাদের তালিকা।</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">মোট অনুদান</p>
                      <p className="text-xl font-black text-white">৳ {totalDonation}</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">মোট দাতা</p>
                      <p className="text-xl font-black text-white">{donors.length}</p>
                   </div>
                </div>
             </div>
             <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-brand-primary/30 flex items-center gap-2"
             >
                <Plus size={20} /> নতুন দাতা যোগ করুন
             </button>
          </div>

          <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-10">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                <h3 className="text-xl font-black text-stone-900 flex items-center gap-3">
                   <Heart size={20} className="text-brand-primary" /> দাতাদের তালিকা
                </h3>
                <div className="relative w-full max-w-md">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                   <input 
                     type="text" 
                     placeholder="নাম দিয়ে খুঁজুন..." 
                     className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-14 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                   <div className="col-span-full py-20 flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-brand-primary" size={40} />
                      <p className="text-stone-400 font-bold">লোড হচ্ছে...</p>
                   </div>
                ) : filteredDonors.length === 0 ? (
                   <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
                      <Heart size={80} className="text-stone-100" />
                      <h3 className="text-xl font-black text-stone-900">কোনো তথ্য পাওয়া যায়নি</h3>
                      <p className="text-stone-400 font-medium max-w-xs">নতুন দাতা যোগ করতে ওপরের বাটনে ক্লিক করুন।</p>
                   </div>
                ) : (
                   filteredDonors.map((donor) => (
                      <div key={donor.id} className="bg-stone-50 border border-stone-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center group relative hover:border-brand-primary/30 transition-all">
                         <button 
                          onClick={() => handleDelete(donor.id)}
                          className="absolute top-6 right-6 p-2 text-stone-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                         >
                            <Trash2 size={16} />
                         </button>
                         <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-brand-primary">
                            <User size={40} />
                         </div>
                         <h4 className="text-lg font-black text-stone-900 mb-1">{donor.name}</h4>
                         <p className="text-stone-400 text-xs font-bold mb-6 flex items-center gap-2">
                           <Calendar size={12} /> {donor.date?.toDate().toLocaleDateString('en-GB') || 'N/A'}
                         </p>
                         <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl px-6 py-3 w-full">
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60 mb-1">প্রদত্ত পরিমাণ</p>
                            <p className="text-2xl font-black text-brand-primary">৳ {donor.amount}</p>
                         </div>
                         {donor.note && (
                           <p className="mt-4 text-xs text-stone-500 italic font-medium">"{donor.note}"</p>
                         )}
                      </div>
                   ))
                )}
             </div>
          </div>
       </div>

       {/* Donor Modal */}
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
                    <Heart size={20} className="text-brand-primary" /> দাতা যোগ করুন
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">দাতার নাম</label>
                     <input 
                       required
                       type="text" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                       placeholder="দাতার নাম লিখুন"
                     />
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
                     <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">মন্তব্য (ঐচ্ছিক)</label>
                     <textarea 
                       value={formData.note}
                       onChange={(e) => setFormData({...formData, note: e.target.value})}
                       className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[100px]"
                       placeholder="কোনো বিশেষ মন্তব্য থাকলে লিখুন..."
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
