/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MessageSquare, Trash2, CheckCircle2, User, Clock, Loader2, Search } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: any;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'messages');
    });

    return () => unsubscribe();
  }, []);

  const handleMarkRead = async (id: string, currentStatus: string) => {
    if (currentStatus === 'unread') {
      try {
        await updateDoc(doc(db, 'messages', id), {
          status: 'read'
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'messages');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই মেসেজটি মুছতে নিশ্চিত?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'messages');
      }
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.senderName.toLowerCase().includes(search.toLowerCase()) ||
    msg.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="মেসেজ বক্স (Messages)">
      <div className="space-y-8">
        {/* Header Search */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-stone-900">ইনবক্স</h2>
              <p className="text-stone-400 font-medium">সদস্যদের কাছ থেকে আসা সকল অনুসন্ধানের তালিকা।</p>
           </div>
           <div className="relative w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
              <input 
                type="text" 
                placeholder="মেসেজ খুঁজুন..." 
                className="w-full bg-stone-50 border border-stone-100 rounded-3xl px-16 py-5 text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-20 rounded-[2.5rem] border border-stone-100 flex flex-col items-center justify-center gap-4">
               <Loader2 className="animate-spin text-brand-primary" size={40} />
               <p className="text-stone-400 font-bold">মেসেজ লোড হচ্ছে...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="bg-white p-20 rounded-[2.5rem] border border-stone-100 flex flex-col items-center justify-center gap-4">
               <MessageSquare className="text-stone-100" size={80} />
               <p className="text-stone-400 font-bold">ইনবক্স বর্তমানে খালি আছে</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleMarkRead(msg.id, msg.status)}
                className={`bg-white p-8 rounded-[2rem] border transition-all cursor-pointer group flex flex-col md:flex-row items-center gap-8 ${
                  msg.status === 'unread' ? 'border-brand-primary/30 shadow-lg shadow-brand-primary/5 bg-brand-primary/[0.02]' : 'border-stone-100 opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.status === 'unread' ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30' : 'bg-stone-50 text-stone-400'
                }`}>
                  <User size={32} />
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                    <h3 className="text-lg font-black text-stone-900">{msg.senderName}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-300 border border-stone-200 px-3 py-1 rounded-full">
                      {msg.senderEmail}
                    </span>
                    {msg.status === 'unread' && (
                      <span className="bg-brand-primary text-white text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full pulse">NEW</span>
                    )}
                  </div>
                  <h4 className="font-black text-stone-700">{msg.subject}</h4>
                  <p className="text-stone-500 font-medium line-clamp-2 md:line-clamp-1">{msg.content}</p>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-6 md:gap-4 shrink-0 pr-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-300">
                    <Clock size={14} />
                    {msg.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                      className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                    {msg.status === 'replied' && (
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500">
                        <CheckCircle2 size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
