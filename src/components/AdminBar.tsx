import React from 'react';
import { Settings, ShoppingBag, Eye, LogOut, FileSpreadsheet, Palette, ArrowUpDown } from 'lucide-react';
import { AuthUser } from '../types';

interface AdminBarProps {
  user: AuthUser;
  activeTab: 'preview' | 'orders' | 'content' | 'theme' | 'images' | 'sheets';
  setActiveTab: (tab: 'preview' | 'orders' | 'content' | 'theme' | 'images' | 'sheets') => void;
  onLogout: () => void;
  orderCount: number;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  orderCount,
}) => {
  return (
    <div className="bg-black text-white border-b-2 border-[#ffb800] px-4 py-2 sticky top-0 z-50 shadow-lg font-label-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="bg-[#ffb800] text-black px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            ADMIN LOGGED IN
          </span>
          <span className="text-[#ffdca1] font-bold hidden sm:inline">{user.email}</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-[#ffb800] text-black'
                : 'text-[#e5e2e1] hover:bg-[#20201f]'
            }`}
          >
            <Eye size={14} />
            <span className="hidden md:inline">XEM GIAO DIỆN</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'orders'
                ? 'bg-[#ffb800] text-black'
                : 'text-[#e5e2e1] hover:bg-[#20201f]'
            }`}
          >
            <ShoppingBag size={14} />
            <span>ĐƠN HÀNG</span>
            {orderCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 rounded-full font-extrabold ml-0.5">
                {orderCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1 font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'content'
                ? 'bg-[#ffb800] text-black'
                : 'text-[#e5e2e1] hover:bg-[#20201f]'
            }`}
          >
            <Settings size={14} />
            <span className="hidden sm:inline">NỘI DUNG</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-1 font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'theme'
                ? 'bg-[#ffb800] text-black'
                : 'text-[#e5e2e1] hover:bg-[#20201f]'
            }`}
          >
            <Palette size={14} />
            <span className="hidden sm:inline">MÀU SẮC & KÉO THẢ</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-1 font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'sheets'
                ? 'bg-[#ffb800] text-black'
                : 'text-[#e5e2e1] hover:bg-[#20201f]'
            }`}
          >
            <FileSpreadsheet size={14} />
            <span className="hidden sm:inline">GOOGLE SHEETS</span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="text-[#d5c4ab] hover:text-red-400 p-1 flex items-center gap-1 transition-colors border border-transparent hover:border-red-400 px-2"
          title="Đăng xuất Admin"
        >
          <LogOut size={14} />
          <span className="hidden lg:inline text-[10px]">ĐĂNG XUẤT</span>
        </button>
      </div>
    </div>
  );
};
