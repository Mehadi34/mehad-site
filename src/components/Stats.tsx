/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Users, Library, BookCopy, Zap } from 'lucide-react';

const stats = [
  { icon: <Library className="w-8 h-8" />, label: 'মোট বই', value: '১,২০০+' },
  { icon: <Users className="w-8 h-8" />, label: 'সক্রিয় সদস্য', value: '৫০০+' },
  { icon: <BookCopy className="w-8 h-8" />, label: 'দৈনিক পাঠক', value: '৫০+' },
  { icon: <Zap className="w-8 h-8" />, label: 'ডিজিটাল রিসোর্স', value: '২০০+' },
];

export default function Stats() {
  return (
    <section className="py-12 bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-brand-accent/30 transition-colors"
            >
              <div className="mb-4 text-brand-primary p-4 bg-brand-primary/5 rounded-2xl">
                {stat.icon}
              </div>
              <p className="text-3xl font-black text-stone-900 mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
