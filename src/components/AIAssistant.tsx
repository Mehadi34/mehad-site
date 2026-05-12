import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, Database, History, Search, Info, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Lazy initialize AI client
  const ai = useMemo(() => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    return new GoogleGenAI({ apiKey: key });
  }, []);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'আসসালামু আলাইকুম! আমি আপনার লাইব্রেরি অ্যাসিস্ট্যান্ট AI। আমি আপনাকে বই খুঁজে পেতে বা লাইব্রেরি সম্পর্কে জানতে সাহায্য করতে পারি।' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ books: 0, issues: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const booksSnap = await getDocs(query(collection(db, 'books'), limit(100)));
        setStats({ books: booksSnap.size, issues: 0 });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      if (!ai) {
        throw new Error("AI Assistant is not configured. The GEMINI_API_KEY is missing from the environment.");
      }
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `You are a highly advanced library assistant for "Econlibery-MBSTU". 
              The current library statistics are: Books: ${stats.books}, Issues: ${stats.issues}.
              Provide answers in Bengali. Be extremely helpful, polite, and use emojis if appropriate. 
              The library is located at: 6th floor, 3rd Academy building, MBSTU, Santosh, Tangail, 1902. 
              Registration fee: 50 TK.
              Working hours: Daily 10 AM to 5 PM.
              Suggest specific books if the user asks for recommendations. 
              Always try to encourage reading among the youth.` },
              { text: userMessage }
            ]
          }
        ]
      });

      const botReply = response.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।";
      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { text: 'বই খুঁজবো কিভাবে?', icon: <Search size={14} /> },
    { text: 'নতুন বই কি কি আছে?', icon: <Sparkles size={14} /> },
    { text: 'কিভাবে মেম্বার হওয়া যায়?', icon: <Info size={14} /> },
    { text: 'বই ফেরত দেওয়ার নিয়ম কি?', icon: <History size={14} /> },
  ];

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#5c4fff] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60]"
      >
        <Bot size={30} />
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[600px] bg-white sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden z-[110] border border-stone-100"
            >
              {/* Header */}
              <div className="bg-[#5c4fff] p-4 sm:p-5 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base leading-none mb-1">লাইব্রেরি অ্যাসিস্ট্যান্ট AI</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="bg-stone-50 border-b border-stone-100 px-4 py-2 flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-2 text-stone-500">
                  <Database size={14} />
                  <span className="text-[11px] font-bold">বই: {stats.books}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <History size={14} />
                  <span className="text-[11px] font-bold">ইস্যু: {stats.issues}</span>
                </div>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-stone-50/30 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-[#5c4fff] text-white rounded-tr-none shadow-md' 
                      : 'bg-white border border-stone-100 text-stone-700 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-stone-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex gap-1">
                      <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-stone-200 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Chips */}
              <div className="p-4 bg-white border-t border-stone-50 overflow-x-auto shrink-0">
                <div className="flex gap-2 whitespace-nowrap scrollbar-hide pb-1">
                  {suggestions.map((s) => (
                    <button 
                      key={s.text}
                      onClick={() => setInput(s.text)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl text-[10px] sm:text-xs font-bold text-stone-600 hover:bg-white hover:border-brand-primary transition-all shadow-sm"
                    >
                      <HelpCircle size={12} className="text-brand-primary" /> {s.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-stone-100 shrink-0 pb-6 sm:pb-4">
                <div className="relative flex items-center gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-100">
                   <input 
                    className="flex-grow bg-transparent text-sm font-medium px-2 py-1 outline-none text-stone-700" 
                    placeholder="বই খুঁজুন বা প্রশ্ন করুন..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   />
                   <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-[#5c4fff] text-white p-2 rounded-xl hover:brightness-110 active:scale-90 transition-all disabled:opacity-50"
                   >
                     <Send size={18} />
                   </button>
                </div>
                <div className="mt-2 text-center">
                   <span className="text-[9px] text-stone-400 font-medium">AI can make mistakes. Verify important info.</span>
                </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
