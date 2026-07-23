import React, { useState } from 'react';
import { Lock, ShieldAlert, CheckCircle, LogIn, ArrowRight, X, Mail, KeyRound } from 'lucide-react';
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
  const [emailInput, setEmailInput] = useState('dinhanh1994@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const targetEmail = emailInput.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user?.isAdmin) {
        throw new Error(
          data.error ||
            `TRUY CẬP BỊ TỪ CHỐI: Email "${targetEmail}" không có quyền quản trị. Chỉ duy nhất tài khoản dinhanh1994@gmail.com được phép đăng nhập và chỉnh sửa landing page.`
        );
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'TRUY CẬP BỊ TỪ CHỐI: Chỉ duy nhất tài khoản dinhanh1994@gmail.com được phép đăng nhập.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1c1b1b] border-4 border-[#ffb800] w-full max-w-lg p-6 md:p-8 brutalist-border-gold relative text-white shadow-2xl">
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
              ADMIN AUTHENTICATION // EMAIL SIGN-IN
            </span>
            <h3 className="font-headline-lg text-2xl uppercase font-bold text-white">
              ĐĂNG NHẬP QUẢN TRỊ VIÊN
            </h3>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/90 border-2 border-red-500 text-red-200 font-label-mono text-xs flex items-start gap-3 animate-shake">
            <ShieldAlert size={20} className="shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block uppercase text-red-400">TRUY CẬP BỊ TỪ CHỐI</span>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="bg-[#131313] border-2 border-[#514532] p-3.5 font-label-mono text-xs text-[#d5c4ab] mb-6 space-y-1">
          <p className="text-[#ffb800] font-bold flex items-center gap-1.5">
            <ShieldAlert size={14} /> BẢO MẬT HỆ THỐNG:
          </p>
          <p>
            Chỉ đúng email <strong className="text-white">dinhanh1994@gmail.com</strong> mới có quyền đăng nhập và chỉnh sửa toàn bộ nội dung landing page.
          </p>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1.5 font-bold flex items-center gap-1.5">
              <Mail size={14} className="text-[#ffb800]" /> EMAIL QUẢN TRỊ:
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
              <KeyRound size={14} className="text-[#ffb800]" /> MẬT KHẨU (TÙY CHỌN KHÓA BẢO VỆ):
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#131313] border-2 border-[#514532] p-3 font-label-mono text-sm text-white focus:border-[#ffb800] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: primaryColor }}
            className="w-full bg-[#ffb800] text-black font-label-mono py-3.5 px-6 font-bold text-sm uppercase hover:bg-white transition-all border-2 border-black brutalist-border flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
          >
            <LogIn size={18} />
            <span>{loading ? 'ĐANG XÁC THỰC...' : 'ĐĂNG NHẬP VỚI EMAIL ADMIN'}</span>
          </button>
        </form>

        {/* Alternative Google Sign-In Shortcut */}
        <div className="mt-6 pt-4 border-t border-[#353535] space-y-3">
          <span className="font-label-mono text-[11px] text-[#d5c4ab] block text-center">
            HOẶC ĐĂNG NHẬP BẰNG GOOGLE AUTH:
          </span>
          <button
            type="button"
            onClick={() => {
              setEmailInput('dinhanh1994@gmail.com');
              handleEmailSignIn();
            }}
            disabled={loading}
            className="w-full bg-[#252424] text-white hover:bg-white hover:text-black font-label-mono py-2.5 px-4 font-bold text-xs uppercase transition-all border border-[#514532] flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>SIGN IN AS dinhanh1994@gmail.com</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#353535] flex justify-between items-center font-label-mono text-[10px] text-[#d5c4ab]">
          <span>CTRL C ADMIN SYSTEM v2.0</span>
          <button onClick={onClose} className="hover:text-white underline cursor-pointer">
            QUAY LẠI TRANG CHỦ
          </button>
        </div>
      </div>
    </div>
  );
};

