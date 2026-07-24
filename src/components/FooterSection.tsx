import React from 'react';
import { Link2 } from 'lucide-react';
import { AppConfig } from '../types';
import { EditableText } from './EditableText';

interface FooterSectionProps {
  footerData: AppConfig['footer'];
  title: string;
  primaryColor: string;
  isAdmin?: boolean;
  onUpdateFooterField?: (field: keyof AppConfig['footer'], value: string) => void;
  onUpdateTitle?: (newTitle: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  footerData,
  title,
  primaryColor,
  isAdmin = false,
  onUpdateFooterField,
  onUpdateTitle,
}) => {
  return (
    <footer
      className="bg-[#ffb800] border-t-4 border-black py-12 text-black"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1: Metadata */}
        <div className="space-y-4">
          <div className="font-headline-lg text-4xl font-extrabold tracking-tighter uppercase">
            <EditableText
              value={title}
              onChange={(val) => onUpdateTitle?.(val)}
              isAdmin={isAdmin}
            />
          </div>
          <div className="font-label-mono text-xs space-y-1.5 font-medium">
            <p>
              <EditableText
                value={footerData.publicationId}
                onChange={(val) => onUpdateFooterField?.('publicationId', val)}
                isAdmin={isAdmin}
              />
            </p>
            <p>
              <EditableText
                value={footerData.isbn}
                onChange={(val) => onUpdateFooterField?.('isbn', val)}
                isAdmin={isAdmin}
              />
            </p>
            <p>
              <EditableText
                value={footerData.publisher}
                onChange={(val) => onUpdateFooterField?.('publisher', val)}
                isAdmin={isAdmin}
              />
            </p>
            <p className="pt-2 font-bold">
              <EditableText
                value={footerData.copyright}
                onChange={(val) => onUpdateFooterField?.('copyright', val)}
                isAdmin={isAdmin}
              />
            </p>
          </div>
        </div>

        {/* Col 2: Transmission Channels */}
        <div className="space-y-4">
          <h4 className="font-label-mono text-sm uppercase font-extrabold tracking-widest border-b-2 border-black/20 pb-2">
            TRANSMISSION_CHANNELS
          </h4>
          <div className="flex flex-col gap-2">
            {footerData.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="font-label-mono text-xs uppercase font-bold text-black hover:text-white flex items-center gap-2 transition-colors"
              >
                <Link2 size={14} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Col 3: External Nodes (Ecommerce links) */}
        <div className="space-y-4">
          <h4 className="font-label-mono text-sm uppercase font-extrabold tracking-widest border-b-2 border-black/20 pb-2">
            EXTERNAL_NODES
          </h4>
          <div className="space-y-3">
            <a
              target="_blank"
              rel="noreferrer"
              href={footerData.fahasaUrl || '#'}
              className="block bg-black border-2 border-black hover:bg-white transition-colors p-3 text-center group"
            >
              <span className="font-label-mono text-white group-hover:text-black font-extrabold text-sm uppercase">
                BUY ON <span className="text-[#EF2C1E]">FAHASA</span>
              </span>
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href={footerData.tikiUrl || '#'}
              className="block bg-black border-2 border-black hover:bg-white transition-colors p-3 text-center group"
            >
              <span className="font-label-mono text-white group-hover:text-black font-extrabold text-sm uppercase">
                BUY ON <span className="text-[#1A94FF]">TIKI</span>
              </span>
            </a>

            {footerData.shopeeUrl && (
              <a
                target="_blank"
                rel="noreferrer"
                href={footerData.shopeeUrl}
                className="block bg-black border-2 border-black hover:bg-white transition-colors p-3 text-center group"
              >
                <span className="font-label-mono text-white group-hover:text-black font-extrabold text-sm uppercase">
                  BUY ON <span className="text-[#EE4D2D]">SHOPEE</span>
                </span>
              </a>
            )}
          </div>

          <div className="pt-2 flex gap-4">
            <a href="#" className="font-label-mono text-[10px] uppercase font-bold text-black/70 hover:text-white">
              PRIVACY
            </a>
            <a href="#" className="font-label-mono text-[10px] uppercase font-bold text-black/70 hover:text-white">
              TERMS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
