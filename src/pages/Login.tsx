/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Lock, User, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // For specific admin credentials, we sign in anonymously to get a session
    if ((trimmedUsername === 'Economics@1902' && trimmedPassword === 'Economics@1902') || 
        (trimmedUsername === 'admin' && trimmedPassword === 'admin')) {
      try {
        await signInAnonymously(auth);
        navigate('/admin/dashboard');
      } catch (err: any) {
        setError('লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
        console.error(err);
      }
    } else {
       setError('ভুল ইউজারনেম বা পাসওয়ার্ড (Incorrect username or password)');
    }
  };

  const handleDemoAdmin = async () => {
    setUsername('admin');
    setPassword('admin');
    setError(null);
    try {
      await signInAnonymously(auth);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('লগইন ব্যর্থ হয়েছে।');
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('গুগল লগইন ব্যর্থ হয়েছে।');
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center bg-brand-accent/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl shadow-brand-primary/10 border border-brand-primary/5"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/30">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 mb-2">লগইন করুন</h1>
          <p className="text-stone-500 font-medium italic">আপনার পাঠাগার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 mb-4">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-4">ইউজারনেম</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                type="text" 
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl pl-12 pr-6 py-4 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-stone-700"
                placeholder="আপনার ইউজারনেম দিন"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-4">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                type="password" 
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl pl-12 pr-6 py-4 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-stone-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-95"
          >
            লগইন করুন <ArrowRight size={20} />
          </button>
          
          <button 
            type="button"
            onClick={handleDemoAdmin}
            className="w-full bg-stone-100 text-stone-600 py-3 rounded-xl font-bold text-sm hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
          >
            <Lock size={16} /> ডেমো এডমিন লগইন (Test Only)
          </button>
        </form>

        <div className="relative my-10">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100"></div>
           </div>
           <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-stone-400 font-bold tracking-widest">অথবা</span>
           </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-white border-2 border-stone-100 text-stone-700 py-4 rounded-2xl font-black text-lg hover:bg-stone-50 transition-all flex items-center justify-center gap-3 active:scale-95 mb-10"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          গুগল দিয়ে লগইন
        </button>

        <div className="mt-10 text-center">
           <p className="text-stone-400 font-bold mb-4">অ্যাকাউন্ট নেই?</p>
           <Link to="/register" className="text-brand-primary font-black hover:underline underline-offset-4">সদস্য হতে আবেদন করুন</Link>
        </div>
      </motion.div>
    </div>
  );
}
