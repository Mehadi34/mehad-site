/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { BookOpen, Globe, Users, Headphones, Sparkles, Heart } from 'lucide-react';

const services = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "অবারিত বইয়ের সমাহার",
    description: "সাহিত্য, বিজ্ঞান, ইতিহাস থেকে শুরু করে সব ধরণের বইয়ের বিশাল সংকলন।"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "ডিজিটাল লাইব্রেরি",
    description: "ই-বুক এবং অনলাইন রিসোর্স ব্যবহারের জন্য আমাদের রয়েছে বিশেষ জোন।"
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "অডিও বুক সুবিধা",
    description: "যারা শুনতে ভালোবাসেন তাদের জন্য রয়েছে জনপ্রিয় বইয়ের অডিও সংস্করণ।"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "স্টাডি গ্রুপ",
    description: "দলগত ভাবে পড়াশোনা এবং আলোচনার জন্য রয়েছে নিরিবিলি পরিবেশ।"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "শিশু কর্নার",
    description: "শিশুদের রূপকথার জগত আর রঙিন বইয়ের জন্য আলাদা ব্যবস্থা।"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "সাংস্কৃতিক আড্ডা",
    description: "প্রতিনিয়ত লেখক আড্ডা, বই পড়া উৎসব এবং সাহিত্য প্রতিযোগিতার আয়োজন।"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-primary mb-4">আমাদের বিশেষত্বসমূহ</p>
          <h2 className="text-4xl lg:text-5xl font-sans font-bold text-stone-900 mb-6">আমরা যা দিচ্ছি আপনাকে</h2>
          <div className="w-24 h-1.5 bg-brand-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-10 rounded-[2.5rem] bg-brand-accent/30 border border-stone-100 hover:border-brand-primary/20 hover:bg-white hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-brand-primary text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">{service.title}</h3>
              <p className="text-stone-600 leading-relaxed font-medium">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
