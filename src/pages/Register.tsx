/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CreditCard, Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    role: 'reader',
    paymentMethod: 'Online Payment',
    trxId: '',
    senderNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'users'), {
        ...formData,
        registrationStatus: 'pending',
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center bg-stone-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-3xl p-12 text-center shadow-2xl border border-stone-100"
        >
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-4">আবেদন সফল হয়েছে!</h1>
          <p className="text-stone-500 font-medium leading-relaxed">
            আপনার সদস্যপদ আবেদনটি গ্রহণ করা হয়েছে। এডমিন প্যানেল থেকে ভেরিফিকেশন শেষ হলে আপনি লগইন করতে পারবেন। ধন্যবাদ!
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-10 bg-brand-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
          >
            হোম পেজে ফিরে যান <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-stone-50/30 flex justify-center items-start">
      <div className="w-full max-w-[500px]">
        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden flex flex-col items-center p-8 md:p-12 mt-10">
          
          <div className="w-16 h-16 bg-stone-50 rounded-full border border-stone-200 flex items-center justify-center mb-6">
             <img src="https://ais-pre-nwtbs2ijppuzubg76cvmbw-214056953038.asia-southeast1.run.app/favicon.ico" alt="Logo" className="w-10 h-10 object-contain" />
          </div>

          <h1 className="text-[26px] font-black text-stone-900 text-center tracking-tight mb-1">পাঠাগারের সদস্য হোন</h1>
          <p className="text-stone-400 text-sm font-medium text-center mb-10">পানধোয়া উন্মুক্ত পাঠাগারের সদস্য হয়ে হাজার হাজার বই পড়ার সুযোগ নিন।</p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            
            {/* Registration Fee Box */}
            <div className="bg-stone-50/50 rounded-2xl border border-stone-100 p-6 space-y-4">
              <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-indigo-500" size={18} />
                 <h3 className="font-black text-stone-900">Registration Fee: ৳৫০</h3>
              </div>
              <p className="text-[11px] text-stone-400 font-medium">সদস্য হওয়ার জন্য ৫০ টাকা ফি প্রযোজ্য। আপনি চাইলে লাইব্রেরিতে এসে জমা দিতে পারেন অথবা অনলাইনে পাঠাতে পারেন।</p>
              
              <div className="flex gap-2 p-1 bg-stone-100/50 rounded-xl">
                 <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'Online Payment'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${formData.paymentMethod === 'Online Payment' ? 'bg-white text-brand-primary shadow-sm' : 'text-stone-400'}`}
                 >
                   <CreditCard size={14} /> Online Payment
                 </button>
                 <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'Pay at Library'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${formData.paymentMethod === 'Pay at Library' ? 'bg-white text-brand-primary shadow-sm' : 'text-stone-400'}`}
                 >
                   <Landmark size={14} /> Pay at Library
                 </button>
              </div>

              {formData.paymentMethod === 'Online Payment' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 space-y-4"
                >
                  <div className="bg-white border border-stone-100 p-3 rounded-xl text-center">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Make Payment To</p>
                    <p className="text-lg font-black text-stone-900 tracking-tight">01880412129 <span className="text-[10px] text-stone-400 font-medium">(bKash/Nagad/Rocket)</span></p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-stone-800 flex items-center gap-1">Sender Number <span className="text-red-500">*</span></label>
                      <input 
                        required
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:bg-white focus:border-brand-primary transition-all outline-none"
                        placeholder="01XXXXXXXXX"
                        value={formData.senderNumber}
                        onChange={e => setFormData({...formData, senderNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-stone-800 flex items-center gap-1">Transaction ID (TrxID) <span className="text-red-500">*</span></label>
                      <input 
                        required
                        className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3.5 text-sm font-medium focus:bg-white focus:border-brand-primary transition-all outline-none"
                        placeholder="8NXXXXXX..."
                        value={formData.trxId}
                        onChange={e => setFormData({...formData, trxId: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-stone-700">Full Name</label>
                <input 
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-sm font-medium focus:bg-white focus:border-brand-primary transition-all outline-none"
                  placeholder="আপনার পূর্ণ নাম"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-stone-700">Phone Number</label>
                <input 
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-sm font-medium focus:bg-white focus:border-brand-primary transition-all outline-none"
                  placeholder="উদা: 01XXXXXXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-stone-700">Address</label>
                <input 
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-sm font-medium focus:bg-white focus:border-brand-primary transition-all outline-none"
                  placeholder="আপনার পূর্ণ ঠিকানা..."
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-stone-700">Username</label>
                <input 
                  required
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-sm font-medium focus:bg-white focus:border-brand-primary transition-all outline-none"
                  placeholder="উদা: minhaz2026"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-stone-700">Password</label>
                <input 
                  required
                  type="password"
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-sm font-medium focus:bg-white focus:border-brand-primary transition-all outline-none"
                  placeholder="একটি শক্তিশালী পাসওয়ার্ড দিন"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#5c4fff] text-white py-4 rounded-xl font-bold text-base hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (
                <>Register as Reader <ArrowRight size={18} /></>
              )}
            </button>

            <p className="text-center text-xs font-medium text-stone-400">
              Already a member? <a href="/login" className="text-brand-primary font-bold">Log in instead</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
