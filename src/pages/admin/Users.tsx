/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Plus, Search, Filter, Printer, MoreVertical, Shield, User, Mail, Phone, CheckCircle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryUser {
  id: string;
  fullName: string;
  username: string;
  role: string;
  registrationStatus: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('সব');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('fullName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LibraryUser[];
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (userId: string) => {
    setIsUpdating(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        registrationStatus: 'approved'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('আপনি কি এই সদস্যকে মুছে ফেলতে নিশ্চিত?')) {
      setIsUpdating(userId);
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'users');
      } finally {
        setIsUpdating(null);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      (user.phone && user.phone.includes(search));
    
    if (activeTab === 'সব') return matchesSearch;
    if (activeTab === 'সক্রিয়') return matchesSearch && user.registrationStatus === 'approved';
    if (activeTab === 'নিষ্ক্রিয়') return matchesSearch && user.registrationStatus === 'pending';
    return matchesSearch;
  });

  return (
    <AdminLayout title="সদস্য ব্যবস্থাপনা (Users)">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-[#1A1D21] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-stone-900/10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-black">সদস্য ব্যবস্থাপনা</h2>
            <p className="text-stone-400 font-medium">লাইব্রেরির সদস্যদের প্রোফাইল এবং কার্যকরি নিয়ন্ত্রণ কেন্দ্র।</p>
            <div className="flex gap-4">
               <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/5">
                  <Printer size={18} /> ডাটা প্রিন্ট
               </button>
               <button className="bg-brand-primary hover:bg-brand-secondary px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30">
                  <Plus size={18} /> সদস্য যোগ করুন
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {[
               { label: 'মোট', val: users.length, color: 'text-white' },
               { label: 'সক্রিয়', val: users.filter(u => u.registrationStatus === 'approved').length, color: 'text-emerald-400' },
               { label: 'নিষ্ক্রিয়', val: users.filter(u => u.registrationStatus === 'pending').length, color: 'text-orange-400' },
               { label: 'রক্তদান', val: '০', color: 'text-rose-400' }
             ].map(stat => (
               <div key={stat.label} className="bg-white/5 p-6 rounded-3xl border border-white/5 min-w-[120px]">
                  <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className={`text-2xl font-black ${stat.color}`}>{stat.val}</h4>
               </div>
             ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                type="text" 
                placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
            <div className="flex gap-2">
               {['সব', 'সক্রিয়', 'নিষ্ক্রিয়'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                      activeTab === tab 
                      ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' 
                      : 'bg-stone-50 border-stone-100 text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-stone-100 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredUsers.map((user, idx) => (
                <motion.div 
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col items-center text-center relative group"
                >
                  <button className="absolute top-6 right-6 p-2 text-stone-300 hover:text-stone-900 transition-all">
                     <MoreVertical size={20} />
                  </button>

                  <div className="relative mb-6">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                      alt={user.fullName} 
                      className="w-24 h-24 rounded-full bg-stone-50 border-4 border-stone-50 shadow-sm"
                    />
                    <div className="absolute -top-2 -left-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">
                       #{idx + 1}
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="font-black text-stone-900 text-lg leading-tight">{user.fullName}</h3>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest leading-none">@{user.username}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-stone-100 text-stone-500'}`}>
                          {user.role}
                       </span>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.registrationStatus === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                          {user.registrationStatus === 'approved' ? 'সক্রিয়' : 'পেন্ডিং'}
                       </span>
                    </div>
                  </div>

                  <div className="w-full pt-6 border-t border-stone-50 mb-8 space-y-2">
                     <div className="flex items-center justify-between text-xs font-bold text-stone-400 px-4">
                        <span className="flex items-center gap-2 uppercase tracking-tighter">মোবাইল</span>
                        <span className="text-stone-900">{user.phone || 'N/A'}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full mt-auto pt-6 border-t border-stone-50">
                     {user.registrationStatus === 'pending' ? (
                       <button 
                         disabled={isUpdating === user.id}
                         onClick={() => handleApprove(user.id)}
                         className="col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                       >
                          <CheckCircle size={14} /> অনুমোদন করুন
                       </button>
                     ) : (
                       <>
                         <button className="bg-stone-50 hover:bg-stone-100 text-stone-600 py-3 rounded-2xl text-xs font-black transition-all">বিস্তারিত</button>
                         <button 
                           disabled={isUpdating === user.id}
                           onClick={() => handleDelete(user.id)}
                           className="bg-rose-50 hover:bg-rose-100 text-rose-500 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                         >
                            <Trash2 size={14} /> মুছুন
                         </button>
                       </>
                     )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
