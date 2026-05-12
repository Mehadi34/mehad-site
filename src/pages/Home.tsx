/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Book, MessageCircle, ArrowRight, BookOpen, Trophy, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-brand-accent/50 to-transparent -z-10 rounded-full blur-3xl opacity-50" />
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent rounded-full text-brand-secondary border border-brand-primary/10 mb-10">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">একটি আধুনিক ডিজিটাল পাঠাগার</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-sans font-black text-stone-900 mb-8 leading-tight">
            জ্ঞানের আলোয় <br />
            <span className="text-brand-primary">সমাজ গড়ি</span>
          </h1>
          
          <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            আপনার পছন্দের বইটি এখন এক ক্লিকেই। লাইব্রেরির সদস্য হোন, ইভেন্টে অংশগ্রহণ করুন এবং নিজেকে বিকশিত করুন।
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Link to="/register" className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all flex items-center gap-3">
              সদস্য হতে আবেদন করুন <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-secondary transition-all shadow-lg">
              লগইন করুন
            </Link>
            <Link to="/books" className="bg-white text-stone-700 border-2 border-stone-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-stone-50 transition-all">
              বই ব্রাউজ করুন
            </Link>
          </div>

          <Link to="/shop" className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 rounded-full font-bold hover:bg-red-100 transition-all border border-red-100">
            <ShoppingBag size={18} /> বই কিনুন
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 bg-stone-50/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'ডিজিটাল ক্যাটালগ', 
              desc: 'হাজারো বইয়ের সংগ্রহ অনলাইনে দেখে নিন এবং আপনার পছন্দের বইটি খুঁজুন।', 
              icon: <BookOpen className="text-brand-primary" />,
              color: 'bg-brand-accent'
            },
            { 
              title: 'ইভেন্ট ও প্রতিযোগিতা', 
              desc: 'বৃত্তি পরীক্ষা এবং সাংস্কৃতিক প্রতিযোগিতায় অংশ নিন যা আপনার দক্ষতা বাড়াবে।', 
              icon: <Trophy className="text-brand-green" />,
              color: 'bg-emerald-50'
            },
            { 
              title: 'অনলাইন বুক শপ', 
              desc: 'সাশ্রয়ী মূল্যে পছন্দের বইগুলো অর্ডার করুন সরাসরি আপনার ঠিকানায়।', 
              icon: <ShoppingBag className="text-rose-500" />,
              color: 'bg-rose-50'
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center mb-8`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-4">{card.title}</h3>
              <p className="text-stone-500 font-medium leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-stone-900 rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/10 rounded-full blur-3xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-6xl font-black mb-8">আমাদের অগ্রযাত্রার <br /> অংশ হতে চান?</h2>
            <p className="text-xl text-stone-400 mb-12 max-w-2xl mx-auto">সদস্য আবেদন থেকে শুরু করে যেকোনো প্রয়োজনে আমাদের সাথেই থাকুন। জ্ঞানের আলো সবার মাঝে ছড়িয়ে দেই।</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="bg-white text-stone-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-stone-100 transition-all">
                সদস্য হতে আবেদন করুন
              </Link>
              <Link to="/donors" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">
                দাতা সদস্যদের তালিকা
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <a 
        href="https://wa.me/01880412129" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 group"
      >
        <MessageCircle size={28} />
        <span className="absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-stone-100">
           Click to Chat →
        </span>
      </a>
    </div>
  );
}
