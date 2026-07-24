import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, Upload, Link as LinkIcon, X } from 'lucide-react';

interface EditableImageProps {
  src: string;
  onChange: (newSrc: string) => void;
  isAdmin?: boolean;
  alt?: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  onChange,
  isAdmin = false,
  alt = '',
  className = '',
  containerClassName = '',
  style,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Dung lượng hình ảnh lớn hơn 8MB, vui lòng chọn hình ảnh nhẹ hơn.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
          setShowModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowModal(false);
      setUrlInput('');
    }
  };

  return (
    <div className={`relative group/editable-img ${containerClassName}`}>
      <img src={src} alt={alt} className={className} style={style} />

      {/* Admin Hover Overlay with Plus Button */}
      <div
        onClick={() => setShowModal(true)}
        className="absolute inset-0 bg-black/60 opacity-0 group-hover/editable-img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-[#ffb800] rounded z-20 backdrop-blur-[2px]"
      >
        <div className="bg-[#ffb800] text-black p-2.5 rounded-full shadow-xl transform group-hover/editable-img:scale-110 transition-transform flex items-center justify-center">
          <Plus size={24} className="stroke-[3]" />
        </div>
        <span className="font-label-mono text-xs font-bold text-white uppercase bg-black/80 px-2.5 py-1 rounded border border-[#ffb800]/50">
          THÊM / ĐỔI ẢNH
        </span>
      </div>

      {/* Modal / Options Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1c1b1b] border-2 border-[#ffb800] p-6 max-w-md w-full shadow-2xl relative text-white font-label-mono text-sm">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-[#d5c4ab] hover:text-[#ffb800] p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-[#ffb800] font-bold text-base mb-4 uppercase">
              <ImageIcon size={20} />
              <span>CẬP NHẬT HÌNH ẢNH</span>
            </div>

            {/* Current Image Preview */}
            <div className="mb-4 bg-black/50 p-2 border border-[#353535] flex justify-center">
              <img src={src} alt="Preview" className="max-h-36 object-contain rounded" />
            </div>

            <div className="space-y-4">
              {/* File Upload Option */}
              <div>
                <label className="block text-xs font-bold text-[#d5c4ab] mb-2 uppercase">
                  1. TẢI ẢNH TỪ MÁY TÍNH (+):
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#ffb800] text-black py-2.5 px-4 font-bold uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer border border-black"
                >
                  <Upload size={16} />
                  <span>CHỌN FILE HÌNH ẢNH (...)</span>
                </button>
              </div>

              <div className="text-center text-xs text-[#888] font-bold uppercase">- HOẶC -</div>

              {/* URL Option */}
              <form onSubmit={handleUrlSubmit}>
                <label className="block text-xs font-bold text-[#d5c4ab] mb-1.5 uppercase">
                  2. NHẬP LINK HÌNH ẢNH (URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="flex-1 bg-[#131313] border border-[#514532] p-2 text-xs text-white focus:border-[#ffb800] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#ffb800] text-black px-4 font-bold text-xs uppercase hover:bg-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon size={14} />
                    <span>ÁP DỤNG</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
