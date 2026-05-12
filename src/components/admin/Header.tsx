/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Bell, Moon, Sun, Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="h-[72px] bg-white border-b border-stone-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 text-stone-600 lg:hidden hover:bg-stone-50 rounded-lg transition-colors"
          >
            <MenuIcon size={24} />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-black text-stone-900 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="বই বা মেম্বার খুঁজুন..."
            className="bg-stone-50 border border-stone-100 rounded-full pl-12 pr-6 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-[300px]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 text-stone-500 hover:bg-stone-50 rounded-xl transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2.5 text-stone-500 hover:bg-stone-50 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-6 border-l border-stone-100">
          <div className="text-right hidden sm:block">
            <h3 className="text-sm font-black text-stone-900">System Admin</h3>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Admin</p>
          </div>
          <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-black text-lg">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
