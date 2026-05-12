/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-primary mb-4">যোগাযোগ</p>
          <h2 className="text-4xl lg:text-5xl font-sans font-bold text-stone-900 mb-8 leading-tight">আপনার যে কোনো <span className="text-brand-primary inline-block">জিজ্ঞাসা জানান</span></h2>
          
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-stone-900 mb-1">আমাদের ঠিকানা</h4>
                <p className="text-stone-600 font-medium">6th floor, 3rd Academy building, MBSTU, Santosh, Tangail, 1902</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-stone-900 mb-1">ফোন করুন</h4>
                <p className="text-stone-600 font-medium">01880412129</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-stone-900 mb-1">ইমেইল ঠিকানা</h4>
                <p className="text-stone-600 font-medium">mehadihasan22p@gmail.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-brand-accent/50 p-10 rounded-[3rem] border border-stone-100 shadow-xl"
        >
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">আপনার নাম</label>
                <input 
                  type="text" 
                  placeholder="নাম লিখুন"
                  className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">ইমেইল</label>
                <input 
                  type="email" 
                  placeholder="ইমেইল দিন"
                  className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">বিষয়</label>
              <input 
                type="text" 
                placeholder="বিষয়ের নাম"
                className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">বার্তা</label>
              <textarea 
                rows={4}
                placeholder="আপনার মতামত বা জিজ্ঞাসা লিখুন..."
                className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium resize-none"
              />
            </div>
            <button className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-brand-secondary transition-all shadow-lg hover:shadow-2xl group">
              বার্তা পাঠান
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
