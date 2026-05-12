/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  const points = [
    "সম্পূর্ণ বিনামূল্যে বই পড়ার সুবিধা",
    "আধুনিক এবং আরামদায়ক পড়াশোনার পরিবেশ",
    "ডিজিটাল লাইব্রেরি এবং ই-বুক সুবিধা",
    "শিশুদের জন্য বিশেষ কর্নার",
    "নিয়মিত সাহিত্য ও সাংস্কৃতিক অনুষ্ঠান",
  ];

  return (
    <section id="about" className="py-24 bg-brand-warm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1549675584-91f19337af3d?auto=format&fit=crop&q=80&w=600" 
              alt="Library Activity" 
              className="rounded-3xl shadow-xl w-full h-full object-cover translate-y-8"
            />
            <div className="flex flex-col gap-4">
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600" 
                alt="Books" 
                className="rounded-3xl shadow-xl w-full h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1529148482759-b35b25c5f217?auto=format&fit=crop&q=80&w=600" 
                alt="Community" 
                className="rounded-3xl shadow-xl w-full flex-grow object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-primary mb-4">আমাদের লক্ষ্য ও উদ্দেশ্য</p>
          <h2 className="text-4xl lg:text-5xl font-sans font-bold text-stone-900 mb-8 max-w-lg leading-tight">
            সমাজ গড়ার মূল হাতিয়ার <span className="italic text-brand-primary">হলো শিক্ষা</span>
          </h2>
          <p className="text-lg text-stone-600 mb-10 leading-relaxed">
            পানধোয়া উন্মুক্ত পাঠাগার শুধুমাত্র বইয়ের সমাহার নয়, এটি একটি জ্ঞানতীর্থ। আমরা বিশ্বাস করি, একটি সমৃদ্ধ সমাজ গঠনের জন্য জ্ঞানের চর্চা অপরিহার্য। তাই আমরা নিয়ে এসেছি এমন এক প্ল্যাটফর্ম যেখানে সবাই সমান অধিকারে শিখতে পারবে।
          </p>
          
          <div className="space-y-4">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-1 px-2 mb-1">
                  <CheckCircle2 className="text-brand-primary w-6 h-6" />
                </div>
                <span className="text-lg font-medium text-stone-800">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
