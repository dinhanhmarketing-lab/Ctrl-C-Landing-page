import React from 'react';
import { UserCheck } from 'lucide-react';
import { AppConfig } from '../types';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface AuthorSectionProps {
  authorData: AppConfig['author'];
  primaryColor: string;
  isAdmin?: boolean;
  onUpdateAuthorField?: (field: keyof AppConfig['author'], value: string) => void;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({
  authorData,
  primaryColor,
  isAdmin = false,
  onUpdateAuthorField,
}) => {
  return (
    <section
      className="bg-[#0e0e0e] py-16 md:py-24 border-y-2 border-[#514532] overflow-hidden"
      id="author"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
        {/* Author Portrait with Editable Image */}
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-square bg-[#20201f] border-4 border-[#ffb800] relative overflow-hidden group brutalist-border-gold">
            <EditableImage
              src={authorData.image}
              onChange={(newSrc) => onUpdateAuthorField?.('image', newSrc)}
              isAdmin={isAdmin}
              alt={authorData.name}
              className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
              containerClassName="w-full h-full"
            />
            <div
              className="absolute bottom-0 left-0 bg-[#ffb800] text-black px-4 py-2 font-label-mono font-bold text-xs uppercase border-t-2 border-r-2 border-black z-10"
              style={{ backgroundColor: primaryColor }}
            >
              <EditableText
                value={authorData.tag || `AUTHOR_ID: ${authorData.name}`}
                onChange={(val) => onUpdateAuthorField?.('tag', val)}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>

        {/* Author Bio & Info */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="flex items-center gap-2">
            <UserCheck className="text-[#ffb800]" size={20} style={{ color: primaryColor }} />
            <span className="font-label-mono text-xs text-[#ffb800] uppercase tracking-widest" style={{ color: primaryColor }}>
              CREATOR_ARCHIVE
            </span>
          </div>

          <h2 className="font-headline-lg text-4xl sm:text-5xl uppercase font-bold text-white tracking-tight">
            <EditableText
              value={authorData.title}
              onChange={(val) => onUpdateAuthorField?.('title', val)}
              isAdmin={isAdmin}
            />
          </h2>

          <h3 className="font-headline-lg text-2xl text-[#ffb800] uppercase tracking-wide font-bold" style={{ color: primaryColor }}>
            <EditableText
              value={authorData.name}
              onChange={(val) => onUpdateAuthorField?.('name', val)}
              isAdmin={isAdmin}
            />
          </h3>

          <div className="text-[#d5c4ab] text-lg sm:text-xl font-body-md leading-relaxed font-light">
            <EditableText
              value={authorData.bio}
              onChange={(val) => onUpdateAuthorField?.('bio', val)}
              isAdmin={isAdmin}
              isMultiline={true}
              tagName="p"
            />
          </div>

          <div className="flex gap-4 items-center pt-4">
            <div
              className="h-[3px] w-16 bg-[#ffb800]"
              style={{ backgroundColor: primaryColor }}
            />
            <span
              className="font-label-mono text-xs uppercase tracking-widest font-bold"
              style={{ color: primaryColor }}
            >
              TRANSMISSION_END
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
