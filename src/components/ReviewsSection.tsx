import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { AppConfig } from '../types';

interface ReviewsSectionProps {
  reviewsData: AppConfig['reviews'];
  primaryColor: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviewsData,
  primaryColor,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="fill-[#ffb800] text-[#ffb800]" />);
    }
    if (hasHalf) {
      stars.push(
        <Star
          key="half"
          size={14}
          className="fill-[#ffb800] text-[#ffb800] opacity-60"
        />
      );
    }
    return stars;
  };

  return (
    <section className="bg-[#131313] py-16 md:py-24 border-y-2 border-[#514532]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <div className="h-[2px] flex-grow bg-[#514532]" />
          <div className="flex items-center gap-2">
            <MessageSquare className="text-[#ffb800]" size={22} style={{ color: primaryColor }} />
            <h2
              className="font-headline-lg text-3xl sm:text-4xl uppercase text-[#ffb800] whitespace-nowrap font-bold tracking-tight"
              style={{ color: primaryColor }}
            >
              {reviewsData.sectionTitle}
            </h2>
          </div>
          <div className="h-[2px] flex-grow bg-[#514532]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsData.items.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#1c1b1b] border-2 border-[#514532] p-6 flex flex-col justify-between hover:border-[#ffb800] transition-colors brutalist-border"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    alt={rev.name}
                    className="w-10 h-10 rounded-full border-2 border-[#ffb800] grayscale object-cover"
                    src={rev.avatar}
                  />
                  <div className="flex gap-1">{renderStars(rev.rating)}</div>
                </div>

                <p className="font-label-mono text-[#e5e2e1] text-sm leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="border-t border-[#353535] pt-4">
                <div
                  className="font-label-mono text-sm uppercase font-bold tracking-tight text-[#ffb800]"
                  style={{ color: primaryColor }}
                >
                  {rev.name}
                </div>
                <div className="font-label-mono text-[10px] text-[#d5c4ab] uppercase tracking-widest mt-0.5">
                  {rev.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
