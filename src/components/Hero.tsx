/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Book } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-[90vh] flex items-center overflow-hidden bg-brand-accent/30 pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 -skew-x-12 transform translate-x-20 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary mb-6">
            <Book size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">একটি আধুনিক ও উন্মুক্ত পাঠাগার</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-sans font-extrabold text-stone-900 leading-[1.1] mb-6 text-balance">
            জ্ঞানের আলো ছড়াতে <br />
            <span className="text-brand-primary">আমাদের পথচলা</span>
          </h1>
          
          <p className="text-lg text-stone-600 mb-8 max-w-xl font-medium leading-relaxed">
            Econlibery-MBSTU একটি ডিজিটাল পাঠাগার ব্যবস্থাপনা সিস্টেম, যা শিক্ষার্থীদের এবং দাতা সদস্যদের জন্য একটি আধুনিক প্ল্যাটফর্ম নিশ্চিত করে।
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-secondary transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 group">
              বই দেখুন
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-brand-primary border-2 border-brand-primary/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-primary/5 transition-all">
              আমাদের সম্পর্কে জানুন
            </button>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-warm bg-stone-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-stone-500">
              <span className="text-stone-900 font-bold">৫০০+</span> এলাকাবাসী আমাদের সাথে আছেন
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5] max-w-md mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200" 
              alt="Library Interior" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floating cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-1/4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 max-w-[180px]"
          >
            <p className="text-xs font-bold text-brand-primary mb-1 italic">সপ্তাহের সেরা বই</p>
            <p className="text-sm font-bold text-stone-900">নকশী কাঁথার মাঠ</p>
            <p className="text-[10px] text-stone-500 mt-1">জসীম উদ্‌দীন</p>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-12 bottom-1/4 z-20 bg-brand-primary p-5 rounded-3xl shadow-xl text-white text-center min-w-[140px]"
          >
            <p className="text-3xl font-black">১০০০+</p>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">উন্নত মানের সংকলন</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
