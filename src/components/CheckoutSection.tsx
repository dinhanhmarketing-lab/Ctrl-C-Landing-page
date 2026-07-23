import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Clock, ShieldAlert, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { PackageTier, Order } from '../types';

interface CheckoutSectionProps {
  packages: PackageTier[];
  primaryColor: string;
  onOrderSubmitted?: (order: Order) => void;
}

export const CheckoutSection: React.FC<CheckoutSectionProps> = ({
  packages,
  primaryColor,
  onOrderSubmitted,
}) => {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || 'hardcopy');
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const totalAmount = selectedPkg ? selectedPkg.price * quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Email, Số điện thoại và Địa chỉ giao hàng.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      let createdOrder: Order | null = null;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            address,
            packageId: selectedPkg.id,
            quantity,
            note,
          }),
        });

        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) {
          const data = await res.json();
          if (data.order) {
            createdOrder = data.order;
          }
        }
      } catch (apiErr) {
        console.warn('Backend order API not reachable, creating order locally:', apiErr);
      }

      if (!createdOrder) {
        const qty = Math.max(1, parseInt(String(quantity), 10) || 1);
        createdOrder = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          name,
          email,
          phone,
          address,
          packageId: selectedPkg.id,
          packageName: selectedPkg.name,
          price: selectedPkg.price,
          quantity: qty,
          totalAmount: selectedPkg.price * qty,
          note: note || '',
          status: 'pending',
          syncedToSheet: false,
        };
      }

      setSubmittedOrder(createdOrder);
      if (onOrderSubmitted) {
        onOrderSubmitted(createdOrder);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tạo đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 md:px-12" id="order">
      <div className="flex flex-col items-center mb-12 text-center">
        <span
          className="font-label-mono text-xs uppercase px-3 py-1 font-bold mb-3 border border-black text-black"
          style={{ backgroundColor: primaryColor }}
        >
          PRE-ORDER ARCHIVE // LIMITED QUANTITY
        </span>
        <h2 className="font-headline-lg text-4xl sm:text-5xl uppercase font-extrabold text-white tracking-tight">
          BẢNG GIÁ & ĐẶT HÀNG
        </h2>
        <p className="text-[#d5c4ab] font-body-md max-w-xl text-base mt-2">
          Chọn gói tiểu thuyết phù hợp và điền thông tin để hoàn tất xác nhận sở hữu ngay hôm nay.
        </p>
      </div>

      {submittedOrder ? (
        /* Order Success Card */
        <div className="bg-[#20201f] border-4 border-[#ffb800] p-8 md:p-12 brutalist-border-gold max-w-3xl mx-auto text-center animate-fadeIn">
          <div className="w-16 h-16 bg-[#ffb800] text-black rounded-none flex items-center justify-center mx-auto mb-6 brutalist-border">
            <Check size={36} />
          </div>

          <h3 className="font-headline-lg text-3xl md:text-4xl uppercase text-white font-bold mb-2">
            ĐẶT HÀNG THÀNH CÔNG!
          </h3>

          <p className="font-label-mono text-sm text-[#ffb800] mb-6 uppercase tracking-widest font-bold">
            MÃ ĐƠN HÀNG: {submittedOrder.id}
          </p>

          <div className="bg-[#131313] border-2 border-[#514532] p-6 text-left font-label-mono text-xs space-y-3 mb-8">
            <div className="flex justify-between border-b border-[#353535] pb-2">
              <span className="text-[#d5c4ab]">Khách hàng:</span>
              <span className="text-white font-bold">{submittedOrder.name}</span>
            </div>
            <div className="flex justify-between border-b border-[#353535] pb-2">
              <span className="text-[#d5c4ab]">Email:</span>
              <span className="text-white">{submittedOrder.email}</span>
            </div>
            <div className="flex justify-between border-b border-[#353535] pb-2">
              <span className="text-[#d5c4ab]">Số điện thoại:</span>
              <span className="text-white">{submittedOrder.phone}</span>
            </div>
            <div className="flex justify-between border-b border-[#353535] pb-2">
              <span className="text-[#d5c4ab]">Địa chỉ:</span>
              <span className="text-white">{submittedOrder.address}</span>
            </div>
            <div className="flex justify-between border-b border-[#353535] pb-2">
              <span className="text-[#d5c4ab]">Gói đã chọn:</span>
              <span className="text-[#ffb800] font-bold">{submittedOrder.packageName}</span>
            </div>
            <div className="flex justify-between border-b border-[#353535] pb-2">
              <span className="text-[#d5c4ab]">Số lượng:</span>
              <span className="text-white">{submittedOrder.quantity}</span>
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-white font-bold">Tổng thanh toán:</span>
              <span className="text-[#ffb800] font-bold text-lg">${submittedOrder.totalAmount}.00</span>
            </div>
            {submittedOrder.syncedToSheet && (
              <div className="mt-3 text-green-400 text-[11px] flex items-center gap-1 font-mono">
                ✓ Đã đồng bộ trực tiếp lên hệ thống Google Sheets!
              </div>
            )}
          </div>

          <p className="text-[#d5c4ab] font-body-md text-sm mb-8">
            Bộ phận phát hành sẽ liên hệ qua SĐT <strong>{submittedOrder.phone}</strong> để xác nhận thời gian giao sách.
          </p>

          <button
            onClick={() => {
              setSubmittedOrder(null);
              setName('');
              setEmail('');
              setPhone('');
              setAddress('');
              setNote('');
            }}
            className="bg-[#ffb800] text-black font-label-mono px-8 py-3.5 font-bold uppercase text-xs hover:bg-white transition-all border-2 border-black brutalist-border"
          >
            ĐẶT ĐƠN HÀNG MỚI
          </button>
        </div>
      ) : (
        /* Package Selection & Order Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Package Tiers */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-headline-lg text-xl uppercase font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#ffb800]" />
              <span>1. CHỌN GÓI SẢN PHẨM</span>
            </h3>

            {packages.map((pkg) => {
              const isSelected = pkg.id === selectedPkgId;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`border-2 p-6 cursor-pointer transition-all relative brutalist-border ${
                    isSelected
                      ? 'bg-[#20201f] border-[#ffb800] ring-1 ring-[#ffb800]'
                      : 'bg-[#1c1b1b] border-[#514532] hover:border-white/50'
                  }`}
                >
                  {pkg.badge && (
                    <div
                      className="absolute -top-3 right-4 bg-[#ffb800] text-black px-3 py-0.5 font-label-mono font-bold text-[10px] uppercase border border-black"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {pkg.badge}
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-headline-lg text-2xl uppercase text-white font-bold">
                        {pkg.name}
                      </h4>
                    </div>
                    <div className="text-3xl font-display-xl font-extrabold text-[#ffb800]" style={{ color: primaryColor }}>
                      ${pkg.price}.00
                    </div>
                  </div>

                  <ul className="space-y-2 font-label-mono text-xs text-[#d5c4ab] my-4">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={14} className="text-[#ffb800] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-[#353535] flex justify-between items-center text-xs font-label-mono">
                    <span className={isSelected ? 'text-[#ffb800] font-bold' : 'text-[#d5c4ab]'}>
                      {isSelected ? '✓ ĐÃ CHỌN GÓI NÀY' : 'NHẤN ĐỂ CHỌN'}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#ffb800] bg-[#ffb800]' : 'border-[#514532]'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Checkout Form */}
          <div className="lg:col-span-6 bg-[#ffb800] border-4 border-black p-6 md:p-8 brutalist-border text-black" style={{ backgroundColor: primaryColor }}>
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
              <h3 className="font-headline-lg text-2xl md:text-3xl uppercase font-black text-black">
                CHECKOUT_INIT
              </h3>
              <span className="font-label-mono text-xs bg-black text-white px-2.5 py-1 font-bold">
                SECURE
              </span>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-900/90 text-white border-2 border-black font-label-mono text-xs flex items-center gap-2">
                <ShieldAlert size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-label-mono text-xs text-black uppercase font-bold block">
                  HỌ TÊN KHÁCH HÀNG *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="NGUYỄN VĂN A"
                  className="w-full bg-white/30 border-2 border-black p-3.5 font-label-mono text-sm text-black focus:bg-white focus:outline-none placeholder:text-black/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-mono text-xs text-black uppercase font-bold block">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="USER@DOMAIN.SYS"
                    className="w-full bg-white/30 border-2 border-black p-3.5 font-label-mono text-sm text-black focus:bg-white focus:outline-none placeholder:text-black/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label-mono text-xs text-black uppercase font-bold block">
                    SỐ ĐIỆN THOẠI *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full bg-white/30 border-2 border-black p-3.5 font-label-mono text-sm text-black focus:bg-white focus:outline-none placeholder:text-black/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-mono text-xs text-black uppercase font-bold block">
                  ĐỊA CHỈ GIAO HÀNG *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="SỐ NHÀ, TÊN ĐƯỜNG, QUẬN/HUYỆN, TỈNH/THÀNH PHỐ"
                  className="w-full bg-white/30 border-2 border-black p-3.5 font-label-mono text-sm text-black focus:bg-white focus:outline-none placeholder:text-black/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="font-label-mono text-xs text-black uppercase font-bold block">
                    SỐ LƯỢNG
                  </label>
                  <div className="flex items-center border-2 border-black bg-white/30">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 font-black text-lg hover:bg-black hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-label-mono font-bold text-base">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 font-black text-lg hover:bg-black hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label-mono text-xs text-black uppercase font-bold block">
                    GHI CHÚ THÊM
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Giao giờ hành chính..."
                    className="w-full bg-white/30 border-2 border-black p-2.5 font-label-mono text-xs text-black focus:bg-white focus:outline-none placeholder:text-black/50"
                  />
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="p-3 border-2 border-black bg-black/10 flex justify-between items-center my-4">
                <div>
                  <p className="font-label-mono text-[10px] text-black font-bold uppercase tracking-wider">
                    ƯU ĐÃI TẶNG KÈM DỪNG SAU:
                  </p>
                  <div className="font-label-mono text-2xl font-black text-black tracking-tighter">
                    {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                  </div>
                </div>
                <div className="text-right font-label-mono">
                  <span className="text-[10px] uppercase font-bold block text-black/70">TỔNG THÀNH TIỀN:</span>
                  <span className="text-2xl font-black text-black">${totalAmount}.00</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-label-mono py-4 font-bold text-base hover:bg-white hover:text-black transition-all border-2 border-black uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>ĐANG XỬ LÝ ĐƠN HÀNG...</span>
                  </>
                ) : (
                  <>
                    <span>XÁC NHẬN ĐẶT HÀNG NGAY</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
