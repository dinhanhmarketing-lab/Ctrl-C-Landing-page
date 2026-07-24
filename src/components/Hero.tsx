import React from 'react';
import { AppConfig } from '../types';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface HeroProps {
  heroData: AppConfig['hero'];
  primaryColor: string;
  isAdmin?: boolean;
  onUpdateHeroField?: (field: keyof AppConfig['hero'], value: string) => void;
  onOpenOrder: () => void;
  onOpenChapterModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  heroData,
  primaryColor,
  isAdmin = false,
  onUpdateHeroField,
  onOpenOrder,
}) => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end overflow-hidden border-b-2 border-[#514532] bg-[#131313]">
      {/* Background Image with Editable Image */}
      <div className="absolute inset-0">
        <EditableImage
          src={heroData.bgImage}
          onChange={(newSrc) => onUpdateHeroField?.('bgImage', newSrc)}
          isAdmin={isAdmin}
          alt="Novel Cyberpunk Banner"
          className="w-full h-full object-cover object-top filter brightness-95 saturate-110 min-h-[85vh]"
          containerClassName="w-full h-full"
        />
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#131313]/70 to-[#131313] pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 pt-40 md:pt-56 pb-12 sm:pb-16 flex flex-col items-center">
        {/* Status Tag */}
        <div
          className="inline-block bg-[#ffb800] text-black px-3.5 py-1 font-label-mono text-xs mb-4 font-bold tracking-wider uppercase border border-black brutalist-border"
          style={{ backgroundColor: primaryColor }}
        >
          <EditableText
            value={heroData.statusTag}
            onChange={(val) => onUpdateHeroField?.('statusTag', val)}
            isAdmin={isAdmin}
          />
        </div>

        {/* Display Headline */}
        <h1 className="font-headline-lg text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-none mb-6 text-white tracking-tighter drop-shadow-2xl font-black flex flex-wrap justify-center gap-3 items-center">
          <span className="text-white drop-shadow-md">
            <EditableText
              value={heroData.headlinePart1}
              onChange={(val) => onUpdateHeroField?.('headlinePart1', val)}
              isAdmin={isAdmin}
            />{' '}
            <EditableText
              value={heroData.headlinePart2}
              onChange={(val) => onUpdateHeroField?.('headlinePart2', val)}
              isAdmin={isAdmin}
            />
          </span>{' '}
          {(heroData.headlinePart3 || isAdmin) && (
            <span className="text-[#ffb800] text-3xl sm:text-4xl md:text-5xl" style={{ color: primaryColor }}>
              <EditableText
                value={heroData.headlinePart3}
                onChange={(val) => onUpdateHeroField?.('headlinePart3', val)}
                isAdmin={isAdmin}
                placeholder="Tiêu đề phụ..."
              />
            </span>
          )}
        </h1>

        {/* Subtext */}
        <div className="text-[#e5e2e1] max-w-2xl font-body-md text-base sm:text-lg mb-8 leading-relaxed font-light drop-shadow">
          <EditableText
            value={heroData.subText}
            onChange={(val) => onUpdateHeroField?.('subText', val)}
            isAdmin={isAdmin}
            isMultiline={true}
            tagName="p"
          />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center w-full max-w-xs">
          <button
            onClick={onOpenOrder}
            style={{ backgroundColor: primaryColor }}
            className="w-full bg-[#ffb800] text-black font-label-mono px-8 py-4 font-bold text-base tracking-wider uppercase brutalist-border hover:bg-white hover:text-black transition-all text-center border-2 border-black active:scale-98 cursor-pointer shadow-xl"
          >
            <EditableText
              value={heroData.button1Text || 'MUA NGAY'}
              onChange={(val) => onUpdateHeroField?.('button1Text', val)}
              isAdmin={isAdmin}
            />
          </button>
        </div>
      </div>
    </section>
  );
};
