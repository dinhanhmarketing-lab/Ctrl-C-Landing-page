import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  isAdmin?: boolean;
  isMultiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  tagName?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'a';
  href?: string;
  inlineBtnStyle?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isAdmin = false,
  isMultiline = false,
  className = '',
  style,
  placeholder = 'Nhập nội dung...',
  tagName: Tag = 'span',
  href,
  inlineBtnStyle = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isMultiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAdmin) {
    if (Tag === 'a' && href) {
      return (
        <a href={href} className={className} style={style}>
          {value}
        </a>
      );
    }
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1 relative z-30 my-1 max-w-full">
        {isMultiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="bg-[#1a1a1a] border-2 border-[#ffb800] text-white p-2 font-mono text-sm focus:outline-none w-full min-w-[280px] shadow-2xl rounded"
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-[#1a1a1a] border-2 border-[#ffb800] text-white px-2 py-1 font-mono text-sm focus:outline-none shadow-2xl rounded min-w-[150px]"
            placeholder={placeholder}
          />
        )}
        <button
          type="button"
          onClick={handleSave}
          title="Lưu"
          className="bg-[#ffb800] text-black p-1.5 rounded hover:bg-white transition-colors cursor-pointer shrink-0 shadow"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          title="Hủy"
          className="bg-red-800 text-white p-1.5 rounded hover:bg-red-600 transition-colors cursor-pointer shrink-0 shadow"
        >
          <X size={16} />
        </button>
      </span>
    );
  }

  return (
    <span
      className={`group/editable relative inline-flex items-center border border-dashed border-[#ffb800]/50 hover:border-[#ffb800] hover:bg-[#ffb800]/10 px-1 py-0.5 rounded transition-all cursor-pointer ${
        inlineBtnStyle ? 'inline-block' : ''
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Bấm vào để chỉnh sửa nội dung này"
    >
      <Tag className={className} style={style}>
        {value || <span className="opacity-50 italic">{placeholder}</span>}
      </Tag>
      <span className="inline-flex items-center justify-center ml-1 text-[#ffb800] opacity-80 group-hover/editable:opacity-100 group-hover/editable:scale-110 transition-all bg-black/60 p-0.5 rounded border border-[#ffb800]/40">
        <Pencil size={12} />
      </span>
    </span>
  );
};
