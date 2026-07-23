import React from 'react';

interface TickerSectionProps {
  messages: string[];
  primaryColor: string;
}

export const TickerSection: React.FC<TickerSectionProps> = ({
  messages,
  primaryColor,
}) => {
  if (!messages || messages.length === 0) return null;

  // Duplicate list to create smooth infinite loop
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
