import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { AppConfig, GalleryImage } from '../types';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface GallerySectionProps {
  galleryData: AppConfig['gallery'];
  primaryColor: string;
  isAdmin?: boolean;
  onUpdateGalleryTitle?: (title: string) => void;
  onUpdateGalleryImage?: (index: number, newUrl: string) => void;
  onUpdateGalleryAlt?: (index: number, newAlt: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryData,
  primaryColor,
  isAdmin = false,
  onUpdateGalleryTitle,
  onUpdateGalleryImage,
  onUpdateGalleryAlt,
}) => {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const images = galleryData.images || [];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 md:px-12" id="gallery">
      <div className="flex items-center gap-4 mb-10 justify-center">
        <div className="h-[2px] flex-grow bg-[#514532]" />
        <div className="flex items-center gap-2">
          <ImageIcon className="text-[#ffb800]" size={22} style={{ color: primaryColor }} />
          <h2
            className="font-headline-lg text-3xl sm:text-4xl uppercase text-[#ffb800] whitespace-nowrap font-bold tracking-tight"
            style={{ color: primaryColor }}
          >
            <EditableText
              value={galleryData.sectionTitle}
              onChange={(val) => onUpdateGalleryTitle?.(val)}
              isAdmin={isAdmin}
            />
          </h2>
        </div>
        <div className="h-[2px] flex-grow bg-[#514532]" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, index) => {
          const isFeatured = index === 0;
          const isLandscape = index === 3;

          return (
            <div
              key={img.id || index}
              className={`border-2 border-[#514532] relative overflow-hidden group bg-[#20201f] ${
                isFeatured
                  ? 'col-span-2 row-span-2 min-h-[300px]'
                  : isLandscape
                  ? 'col-span-2 aspect-[21/9]'
                  : 'aspect-square'
              }`}
            >
              <EditableImage
                src={img.url}
                onChange={(newUrl) => onUpdateGalleryImage?.(index, newUrl)}
                isAdmin={isAdmin}
                alt={img.alt}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                containerClassName="w-full h-full"
              />

              {!isAdmin && (
                <div
                  onClick={() => setActiveImage(img)}
                  className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-label-mono text-white text-xs uppercase bg-black px-2.5 py-1 border border-white/30">
                      {img.location || `IMAGE_0${index + 1}`}
                    </span>
                    <ZoomIn className="text-[#ffb800]" size={18} />
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 p-1 border border-[#ffb800] font-label-mono text-[10px] text-white z-20">
                  <EditableText
                    value={img.alt || `Tên ảnh ${index + 1}`}
                    onChange={(val) => onUpdateGalleryAlt?.(index, val)}
                    isAdmin={true}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#1c1b1b] border-2 border-[#ffb800] p-2 brutalist-border-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 bg-black text-white p-2 border border-white hover:bg-[#ffb800] hover:text-black transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
            <div className="p-3 bg-[#131313] mt-2 border-t border-[#514532] font-label-mono text-xs flex justify-between items-center text-[#d5c4ab]">
              <span>{activeImage.alt}</span>
              <span className="text-[#ffb800]">{activeImage.location || 'ARCHIVE_VISUAL'}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
