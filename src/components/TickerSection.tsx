import React from 'react';
import { AppConfig } from '../types';
import { EditableText } from './EditableText';

interface TickerSectionProps {
  messages: string[];
  primaryColor: string;
  isAdmin?: boolean;
  onUpdateTickerMessage?: (index: number, val: string) => void;
}

export const TickerSection: React.FC<TickerSectionProps> = ({
  messages,
  primaryColor,
  isAdmin = false,
  onUpdateTickerMessage,
}) => {
  if (!messages || messages.length === 0) return null;

  if (isAdmin) {
    return (
      <section
        className="bg-[#ffb800] py-3.5 border-b-2 border-black overflow-x-auto shadow-inner px-4 text-black font-label-mono text-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <span className="font-extrabold uppercase bg-black text-white px-2 py-0.5 text-xs">
            CHỈNH SỬA TICKER CHẠY:
          </span>
          {messages.map((msg, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-black/10 p-1 border border-black/30 rounded">
              <span className="font-bold">#{idx + 1}:</span>
              <EditableText
                value={msg}
                onChange={(val) => onUpdateTickerMessage?.(idx, val)}
                isAdmin={true}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const duplicated = [...messages, ...messages, ...messages];

  return (
    <section
      className="bg-[#ffb800] py-3.5 border-b-2 border-black overflow-hidden whitespace-nowrap shadow-inner"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="animate-marquee flex items-center">
        {duplicated.map((msg, idx) => (
          <span
            key={idx}
            className="font-label-mono font-extrabold text-black text-sm md:text-base uppercase italic px-6 border-r-2 border-black/40 flex items-center gap-3 shrink-0"
          >
            <span>⚡</span>
            <span>{msg}</span>
          </span>
        ))}
      </div>
    </section>
  );
};
