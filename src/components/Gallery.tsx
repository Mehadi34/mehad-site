/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

const images = [
  "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507733593714-724ee245b45f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1550399105-05c4a7641adb?auto=format&fit=crop&q=80&w=800",
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-brand-warm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-primary mb-4">গ্যালারি</p>
            <h2 className="text-4xl lg:text-5xl font-sans font-bold text-stone-900 leading-tight">আমাদের আঙিনা</h2>
          </div>
          <p className="text-stone-500 font-medium max-w-sm">বইয়ের বিশাল সংগ্রহ আর নিরিবিলি পড়ার পরিবেশের কিছু খণ্ডচিত্র তুলে ধরা হলো আপনাদের জন্য।</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-[2rem] shadow-lg group ${
                index === 1 ? 'md:row-span-2 aspect-[4/6]' : 'aspect-square'
              }`}
            >
              <img 
                src={src} 
                alt="Library Life" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <div className="w-6 h-6 border-b-2 border-r-2 border-white rotate-45 mb-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
