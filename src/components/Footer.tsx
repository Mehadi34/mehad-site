/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
        
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h2 className="font-sans font-bold text-lg">Econlibery-MBSTU</h2>
          </Link>
          <p className="text-sm font-medium leading-relaxed">
            জ্ঞানের আলো ছড়িয়ে দিতে এবং একটি শিক্ষিত সমাজ গড়তে আমরা নিরলস কাজ করে যাচ্ছি। আমাদের পাঠাগার সকলের জন্য উন্মুক্ত।
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">প্রয়োজনীয় লিংক</h3>
          <ul className="space-y-4 text-sm font-bold">
            <li><Link to="/books" className="hover:text-brand-primary transition-colors">বই সংগ্রহশালা</Link></li>
            <li><Link to="/events" className="hover:text-brand-primary transition-colors">ইভেন্টস ও প্রতিযোগিতা</Link></li>
            <li><Link to="/shop" className="hover:text-brand-primary transition-colors">বই বাজার (Shop)</Link></li>
            <li><Link to="/donors" className="hover:text-brand-primary transition-colors">দাতা সদস্যদের তালিকা</Link></li>
            <li><Link to="/accounts" className="hover:text-brand-primary transition-colors">আয়-ব্যয় হিসাব</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">সহযোগিতা</h3>
          <ul className="space-y-4 text-sm font-bold">
            <li><Link to="/register" className="hover:text-brand-primary transition-colors">সদস্য হতে আবেদন</Link></li>
            <li><Link to="/login" className="hover:text-brand-primary transition-colors">অ্যাকাউন্টে লগইন</Link></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">ব্যবহারবিধি</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">যোগাযোগ করুন</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">যোগাযোগ</h3>
          <ul className="space-y-6 text-sm font-medium">
            <li className="flex items-start gap-4">
               <MapPin className="text-brand-primary shrink-0" size={18} />
               <span>6th floor, 3rd Academy building, MBSTU, Santosh, Tangail, 1902</span>
            </li>
            <li className="flex items-center gap-4">
               <Phone className="text-brand-primary shrink-0" size={18} />
               <span>01880412129</span>
            </li>
            <li className="flex items-center gap-4">
               <Mail className="text-brand-primary shrink-0" size={18} />
               <span>mehadihasan22p@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">
          © {new Date().getFullYear()} Econlibery-MBSTU. All rights reserved.
        </p>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/30">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
