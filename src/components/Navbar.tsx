import React from 'react';
import { User, Lock } from 'lucide-react';
import { AuthUser, AppConfig } from '../types';
import { EditableText } from './EditableText';

interface NavbarProps {
  title: string;
  navigation?: AppConfig['navigation'];
  primaryColor: string;
  user: AuthUser | null;
  onUpdateTitle?: (newTitle: string) => void;
  onUpdateNav?: (field: keyof Required<AppConfig>['navigation'], value: string) => void;
  onOpenAdmin: () => void;
  onOpenChapterModal: () => void;
  onOpenOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  navigation = {
    story: 'STORY',
    character: 'CHARACTER',
    archive: 'ARCHIVE',
    order: 'ORDER',
    readTrialButton: 'ĐỌC THỬ',
    readNowButton: 'READ NOW',
  },
  primaryColor,
  user,
  onUpdateTitle,
  onUpdateNav,
  onOpenAdmin,
  onOpenChapterModal,
  onOpenOrder,
}) => {
  const isAdmin = !!user?.isAdmin;

  return (
    <nav className="bg-[#131313] border-b-2 border-[#514532] sticky top-0 z-40">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <EditableText
            value={title}
            onChange={(val) => onUpdateTitle?.(val)}
            isAdmin={isAdmin}
            tagName="h1"
            className="font-headline-lg text-2xl md:text-3xl font-extrabold text-[#ffb800] tracking-tighter uppercase"
            style={{ color: primaryColor }}
          />

          {isAdmin && (
            <span className="bg-[#ffb800] text-black font-label-mono text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider shrink-0">
              EDIT MODE ON
            </span>
          )}
        </div>

        {/* Menu bar links with inline pencil edit support */}
        <div className="hidden md:flex gap-6 items-center">
          <a href="#story" className="font-label-mono text-xs uppercase text-[#e5e2e1] hover:text-[#ffb800] transition-colors">
            <EditableText
              value={navigation?.story || 'STORY'}
              onChange={(val) => onUpdateNav?.('story', val)}
              isAdmin={isAdmin}
            />
          </a>

          <a href="#author" className="font-label-mono text-xs uppercase text-[#e5e2e1] hover:text-[#ffb800] transition-colors">
            <EditableText
              value={navigation?.character || 'CHARACTER'}
              onChange={(val) => onUpdateNav?.('character', val)}
              isAdmin={isAdmin}
            />
          </a>

          <a href="#gallery" className="font-label-mono text-xs uppercase text-[#e5e2e1] hover:text-[#ffb800] transition-colors">
            <EditableText
              value={navigation?.archive || 'ARCHIVE'}
              onChange={(val) => onUpdateNav?.('archive', val)}
              isAdmin={isAdmin}
            />
          </a>

          <a href="#order" className="font-label-mono text-xs uppercase text-[#ffb800] border-b-2 border-[#ffb800] pb-0.5 font-bold">
            <EditableText
              value={navigation?.order || 'ORDER'}
              onChange={(val) => onUpdateNav?.('order', val)}
              isAdmin={isAdmin}
            />
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-block">
            <button
              onClick={onOpenChapterModal}
              className="border border-[#ffdca1]/30 hover:border-[#ffb800] text-[#e5e2e1] hover:text-[#ffb800] font-label-mono px-3.5 py-1.5 text-xs font-bold transition-all"
            >
              <EditableText
                value={navigation?.readTrialButton || 'ĐỌC THỬ'}
                onChange={(val) => onUpdateNav?.('readTrialButton', val)}
                isAdmin={isAdmin}
              />
            </button>
          </div>

          <button
            onClick={onOpenOrder}
            className="bg-[#ffb800] text-black font-label-mono px-4 py-1.5 font-bold text-xs uppercase hover:bg-white transition-all active:scale-95 border-2 border-black brutalist-border"
            style={{ backgroundColor: primaryColor }}
          >
            <EditableText
              value={navigation?.readNowButton || 'READ NOW'}
              onChange={(val) => onUpdateNav?.('readNowButton', val)}
              isAdmin={isAdmin}
            />
          </button>

          <button
            onClick={onOpenAdmin}
            title={isAdmin ? 'Trang Quản Trị Admin' : 'Đăng nhập Admin (/admin)'}
            className={`p-2 border transition-all flex items-center gap-1 font-label-mono text-xs ${
              isAdmin
                ? 'bg-[#ffb800] text-black border-black font-bold'
                : 'border-[#514532] text-[#d5c4ab] hover:text-[#ffb800] hover:border-[#ffb800]'
            }`}
          >
            {isAdmin ? (
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
