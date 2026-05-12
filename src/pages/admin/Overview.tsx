/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, BookOpen, Activity, Banknote, Plus, ShoppingCart, MessageSquare, ArrowUpRight, Clock, CheckCircle2, ScanBarcode } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_DATA = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

interface ActivityItem {
  id: string;
  type: 'issue' | 'return' | 'user' | 'message';
  title: string;
  time: any;
  status?: string;
}

export default function Overview() {
  const [stats, setStats] = useState({
    usersCount: 0,
    booksCount: 0,
    activeIssues: 0,
    balance: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Users Count
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, usersCount: snapshot.size }));
    });

    // Books Count
    const unsubBooks = onSnapshot(collection(db, 'books'), (snapshot) => {
      setStats(prev => ({ ...prev, booksCount: snapshot.size }));
    });

    // Active Issues
    const qIssues = query(collection(db, 'issues'), where('status', '==', 'active'));
    const unsubIssues = onSnapshot(qIssues, (snapshot) => {
      setStats(prev => ({ ...prev, activeIssues: snapshot.size }));
    });

    // Balance (Simplified sum from transactions)
    const unsubTx = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const balance = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return data.type === 'income' ? acc + data.amount : acc - data.amount;
      }, 0);
      setStats(prev => ({ ...prev, balance }));
    });

    // Recent Activity (Latest 5 issues/returns)
    const qRecent = query(collection(db, 'issues'), orderBy('issueDate', 'desc'), limit(5));
    const unsubRecent = onSnapshot(qRecent, (snapshot) => {
      const activity = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.status === 'active' ? 'issue' : 'return' as any,
          title: `${data.memberName} - ${data.bookTitle}`,
          time: data.issueDate,
          status: data.status
        };
      });
      setRecentActivity(activity);
    });

    return () => {
      unsubUsers();
      unsubBooks();
      unsubIssues();
      unsubTx();
      unsubRecent();
    };
  }, []);

  const statCards = [
    { 
      label: 'নিবন্ধিত সদস্য', 
      value: stats.usersCount, 
      icon: Users, 
      color: 'bg-blue-50 text-blue-600',
      path: '/admin/users'
    },
    { 
      label: 'ক্যাটালগে বই', 
      value: stats.booksCount, 
      icon: BookOpen, 
      color: 'bg-indigo-50 text-indigo-600',
      path: '/admin/inventory'
    },
    { 
      label: 'সক্রিয় ইস্যু', 
      value: stats.activeIssues, 
      icon: Activity, 
      color: 'bg-orange-50 text-orange-600',
      path: '/admin/issues'
    },
    { 
      label: 'বর্তমান তহবিল', 
      value: `৳ ${stats.balance}`, 
      icon: Banknote, 
      color: 'bg-emerald-50 text-emerald-600',
      path: '/admin/finances'
    },
  ];

  return (
    <AdminLayout title="ওভারভিউ (Overview)">
      <div className="space-y-8 pb-10">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-[#1A1D21] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-stone-900/10 border border-white/5">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest border border-white/5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                System Live
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">ইকোনমিকস <br /> পাঠাগার অ্যাডমিন</h1>
              <p className="text-stone-400 font-medium max-w-md">স্বাগতম! আপনার পাঠাগারের দৈনন্দিন কার্যক্রম পরিচালনা এবং তদারকি করুন এখান থেকেই।</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <button 
                  onClick={() => navigate('/admin/inventory')}
                  className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/5"
                >
                   <Plus size={18} /> বই যোগ করুন
                </button>
                <button 
                  onClick={() => navigate('/admin/scanner')}
                  className="bg-brand-primary hover:bg-brand-secondary px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30"
                >
                   <ScanBarcode size={18} /> বারকোড স্ক্যানার
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
               <div className="w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] absolute -top-10 -right-10"></div>
               <div className="relative z-10 w-48 h-48 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Activity size={80} className="text-brand-primary/40 animate-pulse" />
               </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(stat.path)}
              className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:shadow-stone-200/50 transition-all border-b-4 border-b-transparent hover:border-b-brand-primary cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                  <stat.icon size={24} />
                </div>
                <ArrowUpRight size={18} className="text-stone-200 group-hover:text-brand-primary transition-all" />
              </div>
              <div className="space-y-1">
                <p className="text-stone-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-black text-stone-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Activity */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
                 <h2 className="text-xl font-black text-stone-900 mb-8 flex items-center gap-3">
                    <Activity size={24} className="text-brand-primary" /> অ্যাক্টিভিটি ট্রেন্ড (বই সংগৃহীত)
                 </h2>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={CHART_DATA}>
                          <defs>
                             <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5145CD" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#5145CD" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#A8A29E'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#A8A29E'}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }} 
                          />
                          <Area type="monotone" dataKey="value" stroke="#5145CD" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
                 <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-stone-900 flex items-center gap-3">
                       <Clock size={24} className="text-brand-primary" /> সাম্প্রতিক কার্যকলাপ
                    </h2>
                    <button onClick={() => navigate('/admin/issues')} className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest">সকল হিস্ট্রি দেখুন →</button>
                 </div>
                 
                 <div className="space-y-6">
                    {recentActivity.length === 0 ? (
                       <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[2rem]">
                          <Activity className="mx-auto text-stone-100 mb-4" size={48} />
                          <p className="text-stone-300 font-bold italic">বর্তমানে কোনো কার্যকলাপ রেকর্ড করা নেই</p>
                       </div>
                    ) : (
                       recentActivity.map((act) => (
                          <div key={act.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100">
                             <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                   act.status === 'active' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'
                                }`}>
                                   {act.status === 'active' ? <Plus size={20} /> : <CheckCircle2 size={20} />}
                                </div>
                                <div>
                                   <h4 className="font-black text-stone-800 text-sm">{act.title}</h4>
                                   <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
                                      {act.status === 'active' ? 'ইস্যু করা হয়েছে' : 'ফেরত নেওয়া হয়েছে'} • {act.time?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </p>
                                </div>
                             </div>
                             <button className="p-2 text-stone-300 hover:text-stone-600 transition-all">
                                <ArrowUpRight size={18} />
                             </button>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>

           {/* Quick Action Widget */}
           <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#1A1D21] to-[#2D3135] rounded-[2.5rem] p-10 text-white shadow-xl shadow-stone-900/10 border border-white/5">
                 <h3 className="text-xl font-black mb-6">দ্রুত লিঙ্ক</h3>
                 <div className="space-y-4">
                    {[
                       { icon: MessageSquare, label: 'নতুন মেসেজ', path: '/admin/messages', color: 'text-blue-400' },
                       { icon: ShoppingCart, label: 'কেনাকাটা হিসাব', path: '/admin/finances', color: 'text-purple-400' },
                       { icon: Users, label: 'সদস্য অনুমোদন', path: '/admin/users', color: 'text-emerald-400' },
                       { icon: Banknote, label: 'বকেয়া তালিকা', path: '/admin/dues', color: 'text-rose-400' },
                    ].map((link, i) => (
                       <button 
                         key={i}
                         onClick={() => navigate(link.path)}
                         className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                       >
                          <div className="flex items-center gap-4">
                             <link.icon size={20} className={link.color} />
                             <span className="font-bold text-sm">{link.label}</span>
                          </div>
                          <Plus size={16} className="text-stone-600 group-hover:text-white transition-all transform group-hover:rotate-90" />
                       </button>
                    ))}
                 </div>
              </div>

              <div className="bg-brand-primary rounded-[2.5rem] p-10 text-white shadow-xl shadow-brand-primary/30 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                    <BookOpen size={120} />
                 </div>
                 <h3 className="text-xl font-black mb-4 relative z-10">বইয়ের স্টিকার</h3>
                 <p className="text-white/70 text-sm font-medium mb-8 relative z-10">নতুন বইয়ের জন্য QR কোড স্টিকার জেনারেট করুন দ্রুততম সময়ে।</p>
                 <button 
                  onClick={() => navigate('/admin/stickers')}
                  className="w-full bg-white text-brand-primary py-4 rounded-xl font-black shadow-lg shadow-black/10 relative z-10 hover:scale-105 transition-transform"
                 >
                    জেনারেট করুন
                 </button>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
