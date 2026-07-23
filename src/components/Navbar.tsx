import React from 'react';
import { ShieldAlert, User, Lock, ExternalLink } from 'lucide-react';
import { AuthUser } from '../types';

interface NavbarProps {
  title: string;
  primaryColor: string;
  user: AuthUser | null;
  onOpenAdmin: () => void;
  onOpenChapterModal: () => void;
  onOpenOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  primaryColor,
  user,
  onOpenAdmin,
  onOpenChapterModal,
  onOpenOrder,
}) => {
  return (
    <nav className="bg-[#131313] border-b-2 border-[#514532] sticky top-0 z-40">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="font-headline-lg text-3xl font-extrabold text-[#ffb800] tracking-tighter uppercase hover:opacity-90 transition-opacity"
            style={{ color: primaryColor }}
          >
            {title}
          </a>
          {user?.isAdmin && (
            <span className="bg-[#ffb800] text-black font-label-mono text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
              ADMIN MODE
            </span>
          )}
        </div>

        <div className="hidden md:flex gap-8 items-center">
          <a
            className="font-label-mono text-xs uppercase text-[#e5e2e1] hover:text-[#ffb800] transition-colors"
            href="#story"
          >
            STORY
          </a>
          <a
            className="font-label-mono text-xs uppercase text-[#e5e2e1] hover:text-[#ffb800] transition-colors"
            href="#author"
          >
            CHARACTER
          </a>
          <a
            className="font-label-mono text-xs uppercase text-[#e5e2e1] hover:text-[#ffb800] transition-colors"
            href="#gallery"
          >
            ARCHIVE
          </a>
          <a
            className="font-label-mono text-xs uppercase text-[#ffb800] border-b-2 border-[#ffb800] pb-1 font-bold"
            href="#order"
          >
            ORDER
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChapterModal}
            className="hidden sm:inline-block border border-[#ffdca1]/30 hover:border-[#ffb800] text-[#e5e2e1] hover:text-[#ffb800] font-label-mono px-4 py-2 text-xs font-bold transition-all"
          >
            ĐỌC THỬ
          </button>

          <button
            onClick={onOpenOrder}
            className="bg-[#ffb800] text-black font-label-mono px-5 py-2 font-bold text-xs uppercase hover:bg-white transition-all active:scale-95 border-2 border-black brutalist-border"
            style={{ backgroundColor: primaryColor }}
          >
            READ NOW
          </button>

          <button
            onClick={onOpenAdmin}
            title={user?.isAdmin ? 'Trang Quản Trị Admin' : 'Đăng nhập Admin (/admin)'}
            className={`p-2 border transition-all flex items-center gap-1 font-label-mono text-xs ${
              user?.isAdmin
                ? 'bg-[#ffb800] text-black border-black font-bold'
                : 'border-[#514532] text-[#d5c4ab] hover:text-[#ffb800] hover:border-[#ffb800]'
            }`}
          >
            {user?.isAdmin ? (
              <>
                <User size={16} />
                <span className="hidden lg:inline">ADMIN</span>
              </>
            ) : (
              <>
                <Lock size={15} />
                <span className="hidden lg:inline text-[11px]">/ADMIN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
