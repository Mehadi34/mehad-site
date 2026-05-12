/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Crown, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface Donor {
  id: string;
  name: string;
  designation: string;
  location: string;
  imageUrl?: string;
  type: string;
}

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('honored');

  useEffect(() => {
    const q = query(collection(db, 'donors'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donorData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donor));
      setDonors(donorData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donors');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredDonors = donors.filter(d => d.type === activeTab);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">পাঠাগার এগিয়ে চলছে।</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
            <button 
              onClick={() => setActiveTab('honored')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'honored' ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <Crown size={16} /> সম্মানিত দাতা
            </button>
            <button 
              onClick={() => setActiveTab('recent')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'recent' ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <Users size={16} /> সাম্প্রতিক অনুদান
            </button>
          </div>

          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 lg:p-20 border border-stone-100 shadow-sm relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                   <Crown className="text-amber-500" size={32} />
                   <h2 className="text-2xl sm:text-3xl font-black text-stone-900">সম্মানিত দাতা সদস্যবৃন্দ</h2>
                </div>
                <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-16">
                  যে সকল মহৎ ব্যক্তিদের অনুদানে আমাদের কার্যক্রম পরিচালিত হচ্ছে, আমরা তাঁদের প্রতি গভীরভাবে কৃতজ্ঞ।
                </p>

                {loading ? (
                   <div className="py-20 flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-stone-400 font-bold">লোড হচ্ছে...</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {filteredDonors.length > 0 ? filteredDonors.map((donor) => (
                      <motion.div
                        key={donor.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center bg-white border border-stone-100 p-6 sm:p-8 rounded-[2rem] hover:shadow-xl transition-all group"
                      >
                         <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                            <img 
                              src={donor.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${donor.name}&backgroundColor=fffbeb`} 
                              className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm"
                              alt={donor.name}
                            />
                            <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md text-amber-500">
                               <Crown size={12} />
                            </div>
                         </div>
                         <h3 className="text-xl font-black text-stone-900 mb-1">{donor.name}</h3>
                         <p className="text-sm font-bold text-brand-primary/60 uppercase tracking-widest">{donor.designation}</p>
                         <p className="text-stone-400 text-xs mt-2 font-medium">{donor.location}</p>
                      </motion.div>
                    )) : (
                      <div className="col-span-full py-20 text-center">
                        <p className="text-stone-400 font-bold">আপাতত কোনো তথ্য নেই।</p>
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
