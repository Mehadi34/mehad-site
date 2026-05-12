/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, BookOpen, Globe, User, LogIn } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'হোম', href: '/' },
    { name: 'বইসমূহ', href: '/books' },
    { name: 'ইভেন্ট', href: '/events' },
    { name: 'বই কিনুন', href: '/shop' },
    { name: 'দাতা সদস্য', href: '/donors' },
  ];

  const moreLinks = [
    { name: 'আয়-ব্যয় হিসাব', href: '/accounts', icon: <Globe size={16} className="text-brand-green" /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-1' : 'bg-white py-2 border-b border-stone-100'}`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <Menu size={20} className="text-stone-400" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-px bg-stone-200 mx-1 hidden sm:block" />
            <h1 className="font-sans font-bold text-[17px] tracking-tight text-stone-800">
              Econlibery-MBSTU
            </h1>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-all ${
                location.pathname === link.href 
                ? 'text-brand-primary' 
                : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative group px-3 py-2 cursor-pointer text-[14px] font-medium text-stone-600 flex items-center gap-1">
            আরো <X size={12} className="rotate-45" />
            <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-2xl rounded-xl border border-stone-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {moreLinks.map(link => (
                <Link key={link.name} to={link.href} className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 text-stone-700">
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-stone-100 mx-4" />

          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-all px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold uppercase tracking-wider">
               <Globe size={14} /> EN
             </button>
             
             <Link to="/accounts" className="bg-[#00c28d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:brightness-110 transition-all">
               আয়-ব্যয় হিসাব
             </Link>

             {user ? (
               <button 
                onClick={() => signOut(auth)}
                className="text-stone-600 hover:text-stone-900 font-bold text-sm"
               >
                 লগআউট
               </button>
             ) : (
               <Link to="/login" className="text-stone-600 hover:text-stone-900 font-bold text-sm">
                 লগইন
               </Link>
             )}

             <Link to="/register" className="bg-[#5c4fff] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:brightness-110 transition-all">
               Join Now
             </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-stone-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-stone-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-stone-800"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-stone-100 my-2" />
              <Link to="/accounts" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-brand-green">
                আয়-ব্যয় হিসাব
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-primary text-white text-center py-3 rounded-xl font-bold">
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
