import React, { useState } from 'react';
import { Lock, ShieldAlert, CheckCircle, LogIn, ArrowRight, X } from 'lucide-react';
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
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async (emailToVerify: string) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToVerify }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user?.isAdmin) {
        throw new Error(
          data.error ||
            `TRUY CẬP BỊ TỪ CHỐI: Tài khoản "${emailToVerify}" không có quyền chỉnh sửa. Chỉ tài khoản dinhanh1994@gmail.com mới có quyền quản trị.`
        );
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Xác thực không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1c1b1b] border-4 border-[#ffb800] w-full max-w-lg p-6 md:p-8 brutalist-border-gold relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d5c4ab] hover:text-[#ffb800] p-1 transition-colors"
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
              ADMIN AUTHENTICATION // GOOGLE SIGN-IN
            </span>
            <h3 className="font-headline-lg text-2xl uppercase font-bold text-white">
              ĐĂNG NHẬP TRANG QUẢN TRỊ
            </h3>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/90 border-2 border-red-500 text-red-200 font-label-mono text-xs flex items-start gap-3">
            <ShieldAlert size={20} className="shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block uppercase">TRUY CẬP BỊ TỪ CHỐI</span>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="bg-[#131313] border-2 border-[#514532] p-4 font-label-mono text-xs text-[#d5c4ab] mb-6 space-y-2">
          <p className="text-[#ffb800] font-bold">🔒 HỆ THỐNG PHÂN QUYỀN:</p>
          <p>
            Chỉ tài khoản Google chính thức <strong className="text-white">dinhanh1994@gmail.com</strong> được cấp quyền chỉnh sửa nội dung, màu sắc, kéo thả giao diện và xem đơn hàng.
          </p>
        </div>

        {/* Quick Google Login Card for Authorized Admin */}
        <div className="space-y-4">
          <button
            onClick={() => handleGoogleSignIn('dinhanh1994@gmail.com')}
            disabled={loading}
            className="w-full bg-[#ffb800] text-black font-label-mono py-4 px-6 font-bold text-sm uppercase hover:bg-white transition-all border-2 border-black brutalist-border flex items-center justify-between group cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>SIGN IN WITH GOOGLE (dinhanh1994@gmail.com)</span>
            </div>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Test Custom Email Entry to Demonstrate Authorization Security */}
          <div className="pt-4 border-t border-[#353535]">
            <label className="font-label-mono text-[11px] text-[#d5c4ab] block mb-1">
              Kiểm tra tài khoản Google khác (Thử nghiệm phân quyền):
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nhap_email@gmail.com"
                className="flex-1 bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-xs text-white focus:border-[#ffb800] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleGoogleSignIn(emailInput)}
                disabled={loading}
                className="bg-[#353535] text-white hover:bg-white hover:text-black font-label-mono px-4 py-2 text-xs font-bold transition-all border border-[#514532]"
              >
                XÁC NHẬN
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#353535] flex justify-between items-center font-label-mono text-[10px] text-[#d5c4ab]">
          <span>CTRL C ADMIN SYSTEM v2.0</span>
          <button onClick={onClose} className="hover:text-white underline">
            QUAY LẠI TRANG CHỦ
          </button>
        </div>
      </div>
    </div>
  );
};
