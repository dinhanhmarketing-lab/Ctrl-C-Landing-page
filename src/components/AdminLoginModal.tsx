import React, { useState } from 'react';
import { Lock, ShieldAlert, X, Mail, KeyRound, LogIn } from 'lucide-react';
import { AuthUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  primaryColor: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  primaryColor,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetEmail = emailInput.trim().toLowerCase();
    const targetPassword = passwordInput.trim();

    if (!targetEmail || !targetPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ Tên tài khoản (Email) và Mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
        setEmailInput('');
        setPasswordInput('');
      } else {
        setErrorMsg(data.error || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1c1b1b] border-4 border-[#ffb800] w-full max-w-md p-6 md:p-8 brutalist-border-gold relative text-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d5c4ab] hover:text-[#ffb800] p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-3 bg-[#ffb800] text-black border border-black brutalist-border"
            style={{ backgroundColor: primaryColor }}
          >
            <Lock size={24} />
          </div>
          <div>
            <span className="font-label-mono text-[10px] text-[#ffb800] uppercase block tracking-widest font-bold">
              ADMIN AUTHENTICATION
            </span>
            <h3 className="font-headline-lg text-2xl uppercase font-bold text-white">
              ĐĂNG NHẬP QUẢN TRỊ
            </h3>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/90 border-2 border-red-500 text-red-200 font-label-mono text-xs flex items-start gap-3 animate-shake">
            <ShieldAlert size={20} className="shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block uppercase text-red-400">XÁC THỰC THẤT BẠI</span>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Account & Password Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1.5 font-bold flex items-center gap-1.5">
              <Mail size={14} className="text-[#ffb800]" /> TÊN TÀI KHOẢN (EMAIL):
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="dinhanh1994@gmail.com"
              className="w-full bg-[#131313] border-2 border-[#514532] p-3 font-label-mono text-sm text-white focus:border-[#ffb800] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1.5 font-bold flex items-center gap-1.5">
              <KeyRound size={14} className="text-[#ffb800]" /> MẬT KHẨU QUẢN TRỊ:
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-[#131313] border-2 border-[#514532] p-3 font-label-mono text-sm text-white focus:border-[#ffb800] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: primaryColor }}
            className="w-full bg-[#ffb800] text-black font-label-mono py-3.5 px-6 font-bold text-sm uppercase hover:bg-white transition-all border-2 border-black brutalist-border flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 mt-6"
          >
            <LogIn size={18} />
            <span>{loading ? 'ĐANG XÁC THỰC...' : 'XÁC NHẬN ĐĂNG NHẬP'}</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[#353535] flex justify-between items-center font-label-mono text-[10px] text-[#d5c4ab]">
          <span>CTRL C ADMIN AUTH v2.0</span>
          <button onClick={onClose} className="hover:text-white underline cursor-pointer">
            QUAY LẠI TRANG CHỦ
          </button>
        </div>
      </div>
    </div>
  );
};
