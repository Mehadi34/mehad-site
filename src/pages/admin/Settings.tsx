/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import AdminLayout from '../../components/admin/AdminLayout';
import { Calendar, BookOpen, Users, FileText, Bell, MessageSquare, RefreshCw, Trash2, Image, Shield, CheckSquare, Save } from 'lucide-react';

const SETTINGS_CARDS = [
  { icon: Calendar, title: 'ইভেন্ট তৈরি ও পরিচালনা', desc: 'নতুন ইভেন্ট তৈরি করুন, আপডেট বা মুছে ফেলুন।', color: 'bg-indigo-50 text-indigo-500' },
  { icon: BookOpen, title: 'বুক রিভিউ ও ব্লগ', desc: 'সদস্যদের ব্লগ এবং বুক রিভিউ পরিচালনা করুন।', color: 'bg-emerald-50 text-emerald-500' },
  { icon: Users, title: 'পরিচালনা পর্ষদ', desc: 'টিম মেম্বার এবং কার্যকরি পরিষদ পরিচালনা করুন।', color: 'bg-rose-50 text-rose-500' },
  { icon: FileText, title: 'গঠনতন্ত্র সেটিংস', desc: 'পাঠাগারের গঠনতন্ত্র এবং নীতিসমূহ আপডেট করুন।', color: 'bg-orange-50 text-orange-500' },
  { icon: Bell, title: 'নোটিশ বোর্ড', desc: 'সকল প্রকার নোটিশ আপডেট এবং পরিচালনা করুন।', color: 'bg-blue-50 text-blue-500' },
  { icon: MessageSquare, title: 'ম্যাসেজসমূহ', desc: 'ইউজারদের ম্যাসেজ এবং চ্যাট দেখুন।', color: 'bg-teal-50 text-teal-500' },
  { icon: RefreshCw, title: 'রিসেট রিকোয়েস্ট', desc: 'পাসওয়ার্ড এবং ইনফরমেশন রিসেট রিকোয়েস্ট ম্যানেজ করুন।', color: 'bg-purple-50 text-purple-500' },
  { icon: BookOpen, title: 'বইয়ের অনুরোধ রিকোয়েস্ট', desc: 'ইউজারদের নতুন বইয়ের অনুরোধগুলো দেখুন।', color: 'bg-blue-50 text-blue-500' },
  { icon: Calendar, title: 'প্রি-বুকিং ব্যবস্থাপনা', desc: 'বইয়ের প্রি-বুকিং তালিকা এবং স্ট্যাটাস দেখুন।', color: 'bg-yellow-50 text-yellow-600' },
  { icon: Trash2, title: 'সদস্য ডিলিট করুন', desc: 'ওয়েবসাইট থেকে যেকোনো সদস্য রিমুভ বা ডিলিট করুন।', color: 'bg-rose-50 text-rose-500' },
];

export default function Settings() {
  return (
    <AdminLayout title="ওয়েবসাইট সেটিংস">
      <div className="space-y-12 pb-20">
        <p className="text-stone-500 font-medium">ওয়েবসাইটের বিভিন্ন কনফিগারেশন এবং ইভেন্ট পরিচালনা করুন।</p>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-center">
           {SETTINGS_CARDS.map((card, i) => (
              <button 
                key={i}
                className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all flex flex-col items-center group"
              >
                 <div className={`w-16 h-16 rounded-[1.5rem] ${card.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                    <card.icon size={28} />
                 </div>
                 <h3 className="font-black text-stone-900 mb-2 leading-tight">{card.title}</h3>
                 <p className="text-stone-400 text-xs font-medium leading-relaxed">{card.desc}</p>
              </button>
           ))}
        </div>

        {/* Feature Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Event Photo Card */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <Image size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-stone-900">ইভেন্ট ফটো কার্ড</h3>
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">সর্ব শেষ ইভেন্টের ছবি আপলোড করুন</p>
                 </div>
              </div>

              <div className="aspect-[16/9] border-2 border-dashed border-stone-100 rounded-[2rem] flex items-center justify-center flex-col gap-4 bg-stone-50/50 cursor-pointer hover:bg-stone-50 transition-all">
                 <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-brand-primary">
                    <RefreshCw size={24} className="animate-spin-slow" />
                 </div>
                 <div className="text-center">
                    <p className="font-black text-stone-800">ছবি সিলেক্ট করুন</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">(MAX: 2MB, Format: JPG/PNG)</p>
                 </div>
                 <button className="bg-brand-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-primary/20 mt-2">আপলোড করুন</button>
              </div>

              <button className="w-full mt-6 bg-[#1A1D21] text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3">
                 সেটিং সেট করুন <CheckSquare size={20} className="text-emerald-400" />
              </button>
           </div>

           {/* Sub-Admin Permissions */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <Shield size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-stone-900">সাব-অ্যাডমিন ওয়েব এক্সপ্লস</h3>
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">কাস্টমাইজ করুন কোন কোন মেনু সাব-অ্যাডমিন ব্যবহার করতে পারবে</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                 {[
                    'সদস্য ব্যবস্থাপনা (Users)', 'বইয়ের তালিকা (Inventory)', 'ইস্যু ও ফেরত (Issues)',
                    'সদস্যদের বকেয়া (Dues)', 'দাতা সদস্য (Donors)', 'হিসাব-নিকাশ (Finances)',
                    'নোটিশ', 'ম্যাসেজসমূহ', 'বইয়ের অনুরোধ (Requests)', 'প্রি-বুকিং',
                    'শপ বই ব্যবস্থাপনা', 'বই বিক্রয় অর্ডার', 'স্টিকার ও QR', 'বুক রিভিউ', 'ইভেন্ট পরিচালনা'
                 ].map((item, i) => (
                    <label key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-brand-primary/20 transition-all cursor-pointer group">
                       <input type="checkbox" className="w-5 h-5 rounded-md border- stone-200 text-brand-primary focus:ring-brand-primary/20 transition-all" />
                       <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900">{item}</span>
                    </label>
                 ))}
              </div>

              <button className="w-full mt-8 bg-[#1A1D21] text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3">
                 সেটিং সেট করুন <CheckSquare size={20} className="text-emerald-400" />
              </button>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
