import React from 'react';
import { AppConfig } from '../types';

interface HeroProps {
  heroData: AppConfig['hero'];
  primaryColor: string;
  onOpenOrder: () => void;
  onOpenChapterModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  heroData,
  primaryColor,
  onOpenOrder,
}) => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end overflow-hidden border-b-2 border-[#514532] bg-[#131313]">
      {/* Background Image with Subtle Submerged Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Novel Cyberpunk Banner"
          className="w-full h-full object-cover object-top filter brightness-95 saturate-110"
          src={heroData.bgImage}
        />
        {/* Subtle dark overlay that fades from light at top to solid dark at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#131313]/70 to-[#131313]" />
      </div>

      {/* Hero Content positioned towards the lower part leaving top open */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 pt-40 md:pt-56 pb-12 sm:pb-16 flex flex-col items-center">
        {/* System Tag */}
        <div
          className="inline-block bg-[#ffb800] text-black px-3.5 py-1 font-label-mono text-xs mb-4 font-bold tracking-wider uppercase border border-black brutalist-border"
          style={{ backgroundColor: primaryColor }}
        >
          {heroData.statusTag}
        </div>

        {/* Display Headline - Reduced size and placed lower */}
        <h1 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl uppercase leading-tight mb-4 text-white tracking-tight drop-shadow-lg font-bold">
          <span style={{ color: primaryColor }} className="text-[#ffb800]">
            {heroData.headlinePart1} {heroData.headlinePart2}
          </span>{' '}
          {heroData.headlinePart3}
        </h1>

        {/* Subtext */}
        <p className="text-[#e5e2e1] max-w-2xl font-body-md text-base sm:text-lg mb-8 leading-relaxed font-light drop-shadow">
          {heroData.subText}
        </p>

        {/* CTA Button */}
        <div className="flex justify-center w-full max-w-xs">
          <button
            onClick={onOpenOrder}
            style={{ backgroundColor: primaryColor }}
            className="w-full bg-[#ffb800] text-black font-label-mono px-8 py-4 font-bold text-base tracking-wider uppercase brutalist-border hover:bg-white hover:text-black transition-all text-center border-2 border-black active:scale-98 cursor-pointer shadow-xl"
          >
            {heroData.button1Text || 'MUA NGAY'}
          </button>
        </div>
      </div>
    </section>
  );
};
