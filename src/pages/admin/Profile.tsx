/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import AdminLayout from '../../components/admin/AdminLayout';
import { Camera, Edit3, Shield, Mail, Phone, MapPin, BadgeCheck, DollarSign } from 'lucide-react';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  return (
    <AdminLayout title="আমার প্রোফাইল">
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        {/* Profile Card */}
        <div className="bg-white rounded-[3rem] p-12 border border-stone-100 shadow-xl shadow-stone-200/50 relative">
          <div className="absolute top-12 right-12 flex gap-4">
             <button className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-brand-primary/20">বই কিনুন</button>
             <button className="bg-brand-primary/10 text-brand-primary px-6 py-3 rounded-2xl font-black">বই খুঁজুন (Browse)</button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-8">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" 
                alt="Profile" 
                className="w-40 h-40 rounded-[3rem] bg-stone-50 border-8 border-stone-50"
              />
              <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1A1D21] text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Camera size={20} />
              </button>
            </div>
            
            <h1 className="text-3xl font-black text-stone-900 mb-2">{user?.displayName || 'System Admin'}</h1>
            <p className="text-stone-500 font-bold tracking-widest uppercase text-xs mb-8">{user?.email || '@admin'}</p>

            <div className="space-y-4 w-full">
              <button className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3">
                 একজন রিভিউ পোস্ট করুন
              </button>
              <button className="w-full bg-stone-50 border-2 border-stone-100 text-stone-600 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3">
                 <Edit3 size={20} /> এডিট প্রোফাইল
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="p-8 rounded-[2rem] bg-stone-50 border border-stone-100/50">
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-2">Member ID</p>
               <h4 className="text-xl font-black text-stone-800">#002</h4>
            </div>
            <div className="p-8 rounded-[2rem] bg-stone-50 border border-stone-100/50">
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-2">স্ট্যাটাস</p>
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> সক্রিয়
               </div>
            </div>
            <div className="p-8 rounded-[2rem] bg-stone-50 border border-stone-100/50 md:col-span-2">
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-2">Phone</p>
               <h4 className="text-xl font-black text-stone-800">01880412129</h4>
            </div>
            <div className="p-8 rounded-[2rem] bg-stone-50 border border-stone-100/50 md:col-span-2">
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-2">Address</p>
               <h4 className="font-bold text-stone-800 text-balance">6th floor, 3rd Academy building, MBSTU, Santosh, Tangail, 1902</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
             <div className="bg-brand-primary/5 p-8 rounded-[2rem] border border-brand-primary/10">
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Paid</p>
                <h4 className="text-3xl font-black text-brand-primary">৳ ০</h4>
             </div>
             <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100">
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-2">Unpaid Dues</p>
                <h4 className="text-3xl font-black text-rose-500">৳ ০</h4>
             </div>
          </div>
        </div>

        {/* Messaging & Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-blue-100">
               <Mail className="text-blue-500 mb-6" size={32} />
               <h3 className="text-xl font-black text-stone-900 mb-2">ম্যাসেজসমূহ</h3>
               <p className="text-stone-500 text-sm font-medium mb-6">আপনার ইনবক্স চেক করুন।</p>
               <button onClick={() => navigate('/admin/messages')} className="text-blue-600 font-bold hover:underline">সবগুলো ম্যাসেজ দেখুন →</button>
            </div>
           <div className="bg-emerald-50/50 rounded-[2.5rem] p-10 border border-emerald-100">
              <BadgeCheck className="text-emerald-500 mb-6" size={32} />
              <h3 className="text-xl font-black text-stone-900 mb-2">নোটিশ বোর্ড</h3>
              <p className="text-stone-500 text-sm font-medium mb-6">সর্বশেষ নোটিশগুলো দেখে নিন।</p>
              <button className="text-emerald-600 font-bold hover:underline">নোটিশবোর্ড দেখুন →</button>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
