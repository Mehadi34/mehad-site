/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export default function Events() {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-stone-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full aspect-video bg-white rounded-[3rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="w-24 h-24 bg-stone-50 rounded-3xl flex items-center justify-center text-stone-300 mb-8">
           <Calendar size={48} />
        </div>
        <h2 className="text-3xl font-black text-stone-900 mb-4">আপাতত নতুন কোনো ইভেন্ট নেই</h2>
        <p className="text-stone-500 font-medium max-w-sm">পরবর্তীতে আবার দেখুন অথবা আমাদের ফেসবুক পেজে চোখ রাখুন।</p>
      </motion.div>
    </div>
  );
}
