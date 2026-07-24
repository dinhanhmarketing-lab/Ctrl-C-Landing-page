import React from 'react';
import { Newspaper } from 'lucide-react';
import { AppConfig } from '../types';
import { EditableText } from './EditableText';

interface PressSectionProps {
  pressData: AppConfig['press'];
  primaryColor: string;
  isAdmin?: boolean;
  onUpdatePressTitle?: (title: string) => void;
  onUpdatePressQuote?: (index: number, quote: string, source: string) => void;
}

export const PressSection: React.FC<PressSectionProps> = ({
  pressData,
  primaryColor,
  isAdmin = false,
  onUpdatePressTitle,
  onUpdatePressQuote,
}) => {
  return (
    <section className="bg-black py-16 md:py-20 border-b-2 border-[#514532]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center gap-3 mb-10">
          <Newspaper className="text-[#ffb800]" size={24} style={{ color: primaryColor }} />
          <h2
            className="font-display-xl text-3xl sm:text-4xl md:text-5xl uppercase text-[#ffb800] text-center font-bold tracking-tight"
            style={{ color: primaryColor }}
          >
            <EditableText
              value={pressData.sectionTitle}
              onChange={(val) => onUpdatePressTitle?.(val)}
              isAdmin={isAdmin}
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pressData.quotes.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-6 border-2 border-[#514532] bg-[#1c1b1b] flex flex-col justify-between hover:border-[#ffb800] transition-colors brutalist-border"
            >
              <div className="font-body-md text-lg text-[#e5e2e1] mb-6 italic leading-relaxed">
                <EditableText
                  value={q.quote}
                  onChange={(val) => onUpdatePressQuote?.(idx, val, q.source)}
                  isAdmin={isAdmin}
                  isMultiline={true}
                />
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#353535]">
                <div
                  className="h-[2px] w-8 bg-[#ffb800]"
                  style={{ backgroundColor: primaryColor }}
                />
                <span
                  className="font-label-mono text-xs uppercase tracking-widest font-bold"
                  style={{ color: primaryColor }}
                >
                  <EditableText
                    value={q.source}
                    onChange={(val) => onUpdatePressQuote?.(idx, q.quote, val)}
                    isAdmin={isAdmin}
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
