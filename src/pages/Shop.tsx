/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Search, X, Plus, Minus, Trash2, CreditCard, Truck, CheckCircle2, ArrowRight, User, Phone, MapPin } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const DEMO_PRODUCTS: Product[] = [
  { id: 'p1', name: 'রমদান প্ল্যানার ২০২৬', price: 35, category: 'প্ল্যানার', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
  { id: 'p2', name: 'বই পড়ার ডায়েরি', price: 120, category: 'স্টেশনারি', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400' },
  { id: 'p3', name: 'ব্যালেনজ বুকমার্ক ( সেট অফ ৫)', price: 45, category: 'বুকমার্ক', imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df643?auto=format&fit=crop&q=80&w=400' },
  { id: 'p4', name: 'লাইব্রেরি টোট ব্যাগ', price: 250, category: 'ব্যাগ', imageUrl: 'https://images.unsplash.com/photo-1544816153-199d887f8229?auto=format&fit=crop&q=80&w=400' },
];

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<'shopping' | 'checkout' | 'success'>('shopping');
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '', note: '' });
  const [paymentMethod, setPaymentMethod] = useState('bKash');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cart]);
  const deliveryCharge = 50;
  const total = subtotal + (cart.length > 0 ? deliveryCharge : 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (step === 'success') {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center bg-stone-50/50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-stone-100">
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/20">
             <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 mb-4">অর্ডার সফল হয়েছে!</h1>
          <p className="text-stone-500 font-medium leading-relaxed mb-10">আপনার অর্ডারটি রেকর্ড করা হয়েছে। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। আপনার অর্ডার আইডি: #ORDER-{Math.floor(Math.random() * 90000) + 10000}</p>
          <button onClick={() => setStep('shopping')} className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/10">
            আরও শপিং করুন <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-stone-50/30">
      <div className="max-w-7xl mx-auto">
        
        {step === 'shopping' ? (
          <>
            <div className="text-center mb-16">
              <h1 className="text-[52px] font-black text-stone-900 mb-4 tracking-tight leading-none">লাইব্রেরি সপ</h1>
              <p className="text-stone-400 font-medium max-w-2xl mx-auto">নতুন বই, প্ল্যানার এবং লাইব্রেরি মার্চেন্ডাইজ সংগ্রহ করুন। প্রতিটি কেনাকাটা পাঠাগার পরিচালনায় সাহায্য করে।</p>
            </div>

            <div className="max-w-4xl mx-auto mb-20 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
                 <input 
                  type="text" 
                  placeholder="পণ্য বা ক্যাটাগরি খুঁজুন..."
                  className="w-full bg-white border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] rounded-3xl pl-16 pr-8 py-5 transition-all outline-none font-medium focus:border-brand-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative bg-white border border-stone-100 shadow-sm px-8 py-5 rounded-3xl font-black text-stone-700 hover:bg-stone-50 transition-all flex items-center gap-3"
                >
                  <ShoppingCart size={22} /> কার্ট
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-4 border-white shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
               {DEMO_PRODUCTS.filter(p => p.name.includes(searchTerm)).map((product) => (
                 <motion.div 
                  key={product.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[2.5rem] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-stone-100 group flex flex-col"
                 >
                    <div className="aspect-[4/5] rounded-[1.8rem] overflow-hidden relative mb-6 bg-stone-50">
                       <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute top-4 left-4 bg-brand-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                          {product.category}
                       </div>
                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-stone-900 text-sm font-black shadow-lg">
                          ৳{product.price}
                       </div>
                    </div>
                    <div className="px-2 flex-grow flex flex-col">
                       <h3 className="text-xl font-black text-stone-900 mb-6 group-hover:text-brand-primary transition-colors leading-tight">{product.name}</h3>
                       <button 
                        onClick={() => addToCart(product)}
                        className="mt-auto w-full bg-[#0f172a] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-stone-200"
                       >
                          শপিং কার্টে যোগ করুন <ShoppingCart size={18} />
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>
          </>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 mt-10">
            {/* Left: Shipping Form */}
            <div className="flex-grow space-y-10">
               <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                  <h2 className="text-2xl font-black text-stone-900 mb-8 flex items-center gap-3">
                    <Truck className="text-brand-primary" size={24} /> শিপিং ঠিকানা (Shipping Address)
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black uppercase text-stone-400 ml-2">আপনার নাম</label>
                       <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                          <input 
                            placeholder="উদা: আব্দুল্লাহ আল মামুন"
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-brand-primary transition-all font-bold text-stone-700"
                            value={shippingInfo.name}
                            onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black uppercase text-stone-400 ml-2">ফোন নাম্বার</label>
                       <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                          <input 
                            placeholder="উদা: ০১৫৭xxxx"
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-brand-primary transition-all font-bold text-stone-700"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[11px] font-black uppercase text-stone-400 ml-2">সম্পূর্ণ ঠিকানা</label>
                       <div className="relative">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                          <input 
                            placeholder="যেমন: পানধোয়া, আশুলিয়া, ঢাকা"
                            className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-brand-primary transition-all font-bold text-stone-700"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          />
                       </div>
                    </div>
                  </div>
               </div>

               <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                  <h2 className="text-2xl font-black text-stone-900 mb-8 flex items-center gap-3">
                    <CreditCard className="text-brand-primary" size={24} /> পেমেন্ট মেথড (Payment Method)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {['bKash', 'Nagad', 'Rocket', 'Cash On Delivery'].map((m) => (
                       <button 
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`py-6 rounded-2xl font-black text-sm transition-all border ${
                          paymentMethod === m ? 'bg-brand-primary/5 border-brand-primary text-brand-primary shadow-sm' : 'bg-stone-50 border-stone-100 text-stone-400'
                        }`}
                       >
                         {m}
                       </button>
                     ))}
                  </div>

                  {paymentMethod !== 'Cash On Delivery' && (
                    <div className="mt-8 p-6 bg-brand-primary text-white rounded-[2rem] shadow-xl shadow-brand-primary/20">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2 text-center">Make payment to</p>
                       <div className="flex flex-col items-center gap-2">
                          <p className="text-3xl font-black tracking-tight">০১৫৭০২০৬৯৫৩</p>
                          <p className="text-xs font-bold opacity-80">(পার্সোনাল বিকাশ/নগদ/রকেট)</p>
                       </div>
                       <div className="mt-6 pt-6 border-t border-white/10 text-center">
                          <p className="text-sm font-medium leading-relaxed">অর্ডারের টোটাল টাকা উপরোক্ত নাম্বারে পাঠিয়ে কনফার্ম বাটনে ক্লিক করুন। ধন্যবাদ!</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* Right: Summary Box */}
            <div className="w-full lg:w-[380px] shrink-0">
               <div className="bg-white rounded-[3rem] border border-stone-100 shadow-2xl p-10 sticky top-28">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-stone-900">অর্ডার সামারি</h3>
                     <span className="bg-stone-50 text-stone-500 px-3 py-1 rounded-full text-xs font-black">{cartCount} items</span>
                  </div>

                  <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {cart.map((item) => (
                       <div key={item.product.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-stone-50 rounded-xl overflow-hidden shrink-0 border border-stone-100">
                             <img src={item.product.imageUrl} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                             <p className="text-sm font-black text-stone-900 line-clamp-1">{item.product.name}</p>
                             <p className="text-xs text-stone-400 font-bold">৳{item.product.price} × {item.quantity}</p>
                          </div>
                          <p className="text-sm font-black text-stone-900">৳{item.product.price * item.quantity}</p>
                       </div>
                     ))}
                  </div>

                  <div className="space-y-4 pt-8 border-t border-stone-50 mb-8 font-bold">
                    <div className="flex justify-between text-stone-400 text-sm">
                       <span>সাবটোটাল</span>
                       <span>৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-stone-400 text-sm">
                       <span>শিপিং চার্জ</span>
                       <span>৳{deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between text-stone-900 text-xl pt-4 border-t border-stone-50 font-black">
                       <span>মোট মূল্য</span>
                       <span className="text-brand-primary underline decoration-brand-primary/20 underline-offset-8">৳{total}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setStep('success')}
                      className="w-full bg-[#5c4fff] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      অর্ডার কনফার্ম করুন <ArrowRight size={20} />
                    </button>
                    <button 
                      onClick={() => setStep('shopping')}
                      className="w-full bg-stone-50 text-stone-400 py-3 rounded-2xl font-black text-sm hover:text-stone-600 transition-all"
                    >
                      পরিবর্তন করুন
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && step === 'shopping' && (
          <div className="fixed inset-0 z-[100] flex justify-end">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsCartOpen(false)}
               className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
               className="relative w-full max-w-[420px] bg-white h-full shadow-[0_0_80px_rgba(0,0,0,0.1)] flex flex-col p-8"
             >
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f0edff] text-brand-primary rounded-2xl flex items-center justify-center">
                        <ShoppingCart size={24} />
                      </div>
                      <h2 className="text-2xl font-black text-stone-900 leading-none">কার্ট <span className="text-stone-300 ml-1">({cartCount})</span></h2>
                   </div>
                   <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 hover:bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 transition-all">
                      <X size={24} />
                   </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                   {cart.length > 0 ? cart.map((item) => (
                     <div key={item.product.id} className="flex gap-5 group">
                        <div className="w-24 h-24 bg-stone-50 rounded-2xl overflow-hidden shrink-0 border border-stone-100 p-1">
                           <img src={item.product.imageUrl} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-1">
                           <div>
                              <div className="flex justify-between items-start mb-1">
                                 <h3 className="font-black text-stone-900 leading-snug line-clamp-2">{item.product.name}</h3>
                                 <button onClick={() => removeFromCart(item.product.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              <p className="text-xs text-stone-400 font-bold mb-3 uppercase tracking-widest">{item.product.category}</p>
                           </div>
                           <div className="flex items-center justify-between">
                              <p className="text-lg font-black text-brand-primary">৳{item.product.price * item.quantity}</p>
                              <div className="flex items-center gap-3 bg-stone-50 p-1 rounded-xl border border-stone-100">
                                 <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-brand-primary shadow-inner rounded-lg text-stone-400 transition-all"><Minus size={14} /></button>
                                 <span className="w-6 text-center text-sm font-black text-stone-900">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-brand-primary shadow-inner rounded-lg text-stone-400 transition-all"><Plus size={14} /></button>
                              </div>
                           </div>
                        </div>
                     </div>
                   )) : (
                     <div className="h-full flex flex-col items-center justify-center text-center py-20 px-10">
                        <div className="w-24 h-24 bg-stone-50 text-stone-200 rounded-full flex items-center justify-center mb-8">
                           <ShoppingCart size={48} />
                        </div>
                        <h3 className="text-xl font-black text-stone-900 mb-2">কার্ট টি খালি!</h3>
                        <p className="text-stone-400 font-medium">আপনার পছন্দের পণ্যগুলো কার্টে যোগ করুন।</p>
                     </div>
                   )}
                </div>

                <div className="mt-10 pt-8 border-t border-stone-50">
                   <div className="flex justify-between items-center mb-8">
                      <p className="text-stone-400 font-bold">টোটাল (শিপিং ব্যাতিত)</p>
                      <p className="text-[28px] font-black text-stone-900">৳{subtotal}</p>
                   </div>
                   <button 
                    disabled={cart.length === 0}
                    onClick={() => { setIsCartOpen(false); setStep('checkout'); }}
                    className="w-full bg-[#5c4fff] text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-brand-primary/20 disabled:opacity-50"
                   >
                     চেকআউট করুন <ArrowRight size={22} />
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
