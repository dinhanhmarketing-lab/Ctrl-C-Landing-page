import React, { useState } from 'react';
import { X, BookOpen, ShoppingBag, Copy, Check } from 'lucide-react';
import { AppConfig } from '../types';

interface ChapterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: AppConfig['preview'];
  primaryColor: string;
  onOpenOrder: () => void;
}

export const ChapterPreviewModal: React.FC<ChapterPreviewModalProps> = ({
  isOpen,
  onClose,
  previewData,
  primaryColor,
  onOpenOrder,
}) => {
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(previewData.fullChapterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrder = () => {
    onClose();
    onOpenOrder();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1c1b1b] border-2 border-[#ffb800] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden brutalist-border-gold">
        {/* Modal Header */}
        <div className="bg-[#2a2a2a] px-6 py-4 border-b-2 border-[#ffb800] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="text-[#ffb800]" size={20} style={{ color: primaryColor }} />
            <div>
              <span className="font-label-mono text-[10px] text-[#ffb800] uppercase block tracking-widest">
                PREVIEW MODE // SAMPLE CHAPTER
              </span>
              <h3 className="font-headline-lg text-lg text-white font-bold uppercase tracking-tight">
                {previewData.fullChapterTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size control */}
            <div className="hidden sm:flex border border-[#514532] bg-[#131313] p-1 font-label-mono text-xs">
              <button
                onClick={() => setFontSize('md')}
                className={`px-2 py-0.5 ${fontSize === 'md' ? 'bg-[#ffb800] text-black font-bold' : 'text-[#e5e2e1]'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 ${fontSize === 'lg' ? 'bg-[#ffb800] text-black font-bold' : 'text-[#e5e2e1]'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-0.5 ${fontSize === 'xl' ? 'bg-[#ffb800] text-black font-bold' : 'text-[#e5e2e1]'}`}
              >
                A++
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#e5e2e1] hover:text-[#ffb800] hover:bg-black/30 transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 bg-[#131313]">
          <div className="border-l-4 border-[#ffb800] pl-4 py-1 bg-[#20201f]">
            <p className="font-label-mono text-xs text-[#d5c4ab] italic">
              "Trích đoạn tự do từ tác phẩm {previewData.title}. Bạn đang tiếp cận dữ liệu bản mẫu độc quyền."
            </p>
          </div>

          <div
            className={`font-body-md leading-relaxed whitespace-pre-line text-[#e5e2e1] space-y-4 ${
              fontSize === 'md' ? 'text-base' : fontSize === 'lg' ? 'text-lg' : 'text-xl'
            }`}
          >
            {previewData.fullChapterText}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#1c1b1b] px-6 py-4 border-t-2 border-[#514532] flex flex-col sm:flex-row gap-3 justify-between items-center">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 font-label-mono text-xs text-[#d5c4ab] hover:text-[#ffb800] transition-colors"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            <span>{copied ? 'ĐÃ SAO CHÉP!' : 'SAO CHÉP NỘI DUNG'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 font-label-mono text-xs text-[#e5e2e1] border border-[#514532] hover:border-white transition-colors uppercase w-1/2 sm:w-auto"
            >
              ĐÓNG CỬA SỔ
            </button>
            <button
              onClick={handleOrder}
              style={{ backgroundColor: primaryColor }}
              className="px-6 py-2.5 bg-[#ffb800] text-black font-label-mono font-bold text-xs uppercase hover:bg-white transition-all flex items-center justify-center gap-2 border border-black brutalist-border w-1/2 sm:w-auto"
            >
              <ShoppingBag size={16} />
              <span>ĐẶT MUA SÁCH</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
