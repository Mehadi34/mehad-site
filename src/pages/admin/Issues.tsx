/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { History, Plus, FileText, CheckCircle2, MoreHorizontal, Loader2, X, Search, User, Book as BookIcon } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, getDocs, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface Issue {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCode: string;
  memberId: string;
  memberName: string;
  status: 'active' | 'returned' | 'overdue';
  issueDate: any;
  dueDate: any;
}

export default function Issues() {
  const location = useLocation();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('সবগুলো');
  
  const [formData, setFormData] = useState({
    bookId: '',
    bookTitle: '',
    bookCode: '',
    memberId: '',
    memberName: '',
    days: '7'
  });

  useEffect(() => {
    if (location.state && location.state.bookId) {
      setFormData(prev => ({
        ...prev,
        bookId: location.state.bookId,
        bookTitle: location.state.bookTitle,
        bookCode: location.state.bookCode
      }));
      setIsModalOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('issueDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issueData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Issue[];
      setIssues(issueData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'issues');
    });

    return () => unsubscribe();
  }, []);

  const handleReturn = async (id: string) => {
    if (window.confirm('আপনি কি এই বইটি ফেরত নিতে চান?')) {
      try {
        await updateDoc(doc(db, 'issues', id), {
          status: 'returned',
          returnDate: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'issues');
      }
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(issueDate.getDate() + Number(formData.days));

      await addDoc(collection(db, 'issues'), {
        ...formData,
        status: 'active',
        issueDate: serverTimestamp(),
        dueDate: dueDate
      });
      setIsModalOpen(false);
      setFormData({ bookId: '', bookTitle: '', bookCode: '', memberId: '', memberName: '', days: '7' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'issues');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (activeTab === 'সবগুলো') return true;
    if (activeTab === 'বর্তমানে ইস্যুকৃত') return issue.status === 'active';
    if (activeTab === 'ফেরত দেওয়া') return issue.status === 'returned';
    if (activeTab === 'ওভারডিউ বা লেট') return issue.status === 'overdue';
    return true;
  });

  return (
    <AdminLayout title="ইস্যু ও ফেরত (Issues)">
       <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
             <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-stone-900 leading-tight">ইস্যু ও ফেরত</h2>
                   <p className="text-stone-500 font-medium">লাইব্রেরির বই প্রদান এবং ফেরত আসা ব্যবস্থাপনা করুন।</p>
                </div>
                <div className="flex flex-wrap gap-3">
                   <button className="bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-black border border-rose-100 flex items-center gap-2">
                      <FileText size={18} /> রিপোর্ট
                   </button>
                   <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-primary/30 flex items-center gap-2"
                   >
                      <Plus size={18} /> নতুন ইস্যু
                   </button>
                </div>
             </div>

             <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-2 custom-scrollbar">
                {['সবগুলো', 'বর্তমানে ইস্যুকৃত', 'ওভারডিউ বা লেট', 'ফেরত দেওয়া', 'সময় বৃদ্ধির রিকোয়েস্ট'].map((tab) => (
                   <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${activeTab === tab ? 'bg-brand-primary text-white border-brand-primary' : 'bg-stone-50 text-stone-500 border-stone-100 hover:bg-stone-100'}`}
                   >
                      {tab}
                   </button>
                ))}
             </div>

             {/* Table View */}
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="text-stone-300 text-[10px] font-black uppercase tracking-widest border-b border-stone-50">
                         <th className="pb-6 text-left">ইস্যু / স্ট্যাটাস</th>
                         <th className="pb-6 text-left">বইয়ের তথ্য</th>
                         <th className="pb-6 text-left">সদস্যের তথ্য</th>
                         <th className="pb-6 text-right">অ্যাকশন</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-50">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="py-10 text-center text-stone-400 font-bold">লোড হচ্ছে...</td>
                        </tr>
                      ) : filteredIssues.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-10 text-center text-stone-400 font-bold">কোন ইস্যু করার রেকর্ড নেই</td>
                        </tr>
                      ) : (
                        filteredIssues.map((issue) => (
                          <tr key={issue.id} className="group hover:bg-stone-50 transition-all border-b border-stone-50/50">
                            <td className="py-8">
                               <div className="space-y-2">
                                  <p className="text-sm font-black text-stone-800">#{issue.id.slice(0, 6)}</p>
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    issue.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                                    issue.status === 'returned' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                    {issue.status === 'active' ? 'অ্যাক্টিভ' : issue.status === 'returned' ? 'ফেরত দেওয়া' : 'বিলম্বিত'}
                                  </span>
                               </div>
                            </td>
                            <td className="py-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-16 bg-stone-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center text-stone-300">
                                     <BookIcon size={24} />
                                  </div>
                                  <div>
                                     <h4 className="font-black text-stone-800 leading-tight">{issue.bookTitle}</h4>
                                     <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">কোড: {issue.bookCode}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="py-8">
                               <div className="space-y-1">
                                  <h4 className="font-black text-stone-800 leading-tight">{issue.memberName}</h4>
                                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">আইডি: {issue.memberId}</p>
                               </div>
                            </td>
                            <td className="py-8 text-right">
                               <div className="flex justify-end gap-2">
                                  {issue.status === 'active' && (
                                    <button 
                                      onClick={() => handleReturn(issue.id)}
                                      className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                       <CheckCircle2 size={16} /> ফেরত নিন
                                    </button>
                                  )}
                                  <button className="p-2.5 bg-stone-50 text-stone-400 rounded-xl hover:bg-stone-100">
                                     <MoreHorizontal size={20} />
                                  </button>
                               </div>
                            </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
       </div>

       {/* Issue Modal */}
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
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                  <h3 className="text-xl font-black text-stone-900">নতুন বই ইস্যু করুন</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleIssue} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">বইয়ের নাম</label>
                       <input 
                         required
                         type="text" 
                         value={formData.bookTitle}
                         onChange={(e) => setFormData({...formData, bookTitle: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                         placeholder="বইয়ের নাম"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">বইয়ের কোড</label>
                       <input 
                         required
                         type="text" 
                         value={formData.bookCode}
                         onChange={(e) => setFormData({...formData, bookCode: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                         placeholder="যেমন: CHI-8688"
                       />
                    </div>
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
                         placeholder="যেমন: ৩৩৭"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">ইস্যু করার মেয়াদ (দিন)</label>
                       <input 
                         required
                         type="number" 
                         value={formData.days}
                         onChange={(e) => setFormData({...formData, days: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20"
                         placeholder="৭"
                       />
                    </div>
                  </div>
                  <div className="pt-6">
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : 'বই ইস্যু করুন'}
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
