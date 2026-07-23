import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { AppConfig } from '../types';

interface PreviewSectionProps {
  previewData: AppConfig['preview'];
  primaryColor: string;
  onOpenChapterModal: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  previewData,
  primaryColor,
  onOpenChapterModal,
}) => {
  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-6 md:px-12" id="story">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 bg-white border-4 border-black p-8 md:p-12 brutalist-border relative overflow-hidden">
          {/* Top Label */}
          <div className="flex items-center justify-between mb-6 border-b-2 border-black/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-black" size={20} />
              <span className="font-label-mono text-xs font-bold text-black uppercase tracking-widest">
                CHAPTER_EXCERPT // TRANSMISSION
              </span>
            </div>
            <span className="font-label-mono text-xs bg-black text-white px-3 py-1 font-bold">
              VER_1.0
            </span>
          </div>

          <h2 className="font-headline-lg text-4xl md:text-5xl uppercase mb-6 text-black tracking-tight font-extrabold">
            {previewData.title}
          </h2>

          <div className="space-y-5 text-black font-body-md leading-relaxed text-lg sm:text-xl">
            <p className="first-letter:text-6xl first-letter:font-extrabold first-letter:mr-3 first-letter:float-left first-letter:text-black first-letter:font-headline-lg">
              {previewData.p1}
            </p>
            <p className="text-black/90 font-medium">{previewData.p2}</p>
          </div>

          <div className="mt-8 pt-4 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onOpenChapterModal}
              className="bg-black text-white font-label-mono px-10 py-4 font-bold text-sm tracking-wider uppercase hover:bg-[#ffb800] hover:text-black transition-all flex items-center gap-3 border-2 border-black brutalist-border cursor-pointer active:scale-98"
            >
              <BookOpen size={18} />
              <span>{previewData.readButtonText}</span>
            </button>

            <span className="font-label-mono text-xs text-black/60 uppercase">
              NHẤN ĐỂ ĐỌC TRỌN VẸN CHƯƠNG 1
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
