/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  CreditCard, 
  ShoppingBag, 
  Printer, 
  ScanBarcode, 
  History,
  Heart,
  Store,
  LogOut,
  ArrowLeft,
  MessageSquare,
  X,
  Menu
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const MENU_ITEMS = [
  { icon: User, label: 'আমার প্রোফাইল', path: '/admin/profile' },
  { icon: LayoutDashboard, label: 'ওভারভিউ (Overview)', path: '/admin/dashboard' },
  { icon: Users, label: 'সদস্য ব্যবস্থাপনা (Users)', path: '/admin/users' },
  { icon: BookOpen, label: 'বইয়ের তালিকা (Inventory)', path: '/admin/inventory' },
  { icon: Printer, label: 'স্টিকার ও QR (Stickers)', path: '/admin/stickers' },
  { icon: ScanBarcode, label: 'বারকোড স্ক্যানার', path: '/admin/scanner' },
  { icon: History, label: 'ইস্যু ও ফেরত (Issues)', path: '/admin/issues' },
  { icon: Store, label: 'শপ বই ব্যবস্থাপনা', path: '/admin/shop-mgmt' },
  { icon: ShoppingBag, label: 'বই বিক্রয় অর্ডার', path: '/admin/orders' },
  { icon: CreditCard, label: 'সদস্যদের বকেয়া (Dues)', path: '/admin/dues' },
  { icon: Heart, label: 'দাতা সদস্য (Donors)', path: '/admin/donors' },
  { icon: BarChart3, label: 'হিসাব-নিকাশ (Finances)', path: '/admin/finances' },
  { icon: MessageSquare, label: 'মেসেজ বক্স (Messages)', path: '/admin/messages' },
  { icon: Settings, label: 'ওয়েবসাইট সেটিংস', path: '/admin/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className={cn(
      "w-[280px] bg-[#0E1217] text-white flex flex-col h-screen sticky top-0 shrink-0 transition-transform duration-300 z-50",
      "fixed lg:sticky lg:translate-x-0 lg:left-0",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Brand */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl">
            E
          </div>
          <div>
            <h1 className="text-sm font-black leading-tight">Econlibery-MBSTU</h1>
            <p className="text-[10px] text-stone-500 font-bold tracking-widest uppercase">Admin Gateway</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-stone-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Admin Info */}
      <div className="p-4 mx-4 my-6 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" 
          alt="Admin" 
          className="w-10 h-10 rounded-xl bg-white/10"
        />
        <div className="min-w-0">
          <h2 className="text-sm font-black truncate">System Admin</h2>
          <p className="text-[10px] text-stone-500 font-bold truncate">@admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group relative",
                isActive 
                  ? "bg-brand-primary/10 text-brand-primary" 
                  : "text-stone-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-brand-primary/10 border-l-4 border-brand-primary rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon size={18} className={cn("relative z-10", isActive ? "text-brand-primary" : "text-stone-500 group-hover:text-stone-300")} />
              <span className="relative z-10 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:text-white transition-all text-sm font-bold">
          <ArrowLeft size={18} />
          <span>Back to Site</span>
        </Link>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-bold"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
