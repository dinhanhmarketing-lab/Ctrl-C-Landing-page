import React, { useState } from 'react';
import {
  AppConfig,
  Order,
  PackageTier,
  PressQuote,
  RewardItem,
  GalleryImage,
  CustomerReview,
} from '../types';
import {
  ShoppingBag,
  FileSpreadsheet,
  Settings,
  Palette,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Download,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  config: AppConfig;
  packages: PackageTier[];
  orders: Order[];
  adminEmail: string;
  activeTab: 'preview' | 'orders' | 'content' | 'theme' | 'images' | 'sheets';
  setActiveTab: (tab: 'preview' | 'orders' | 'content' | 'theme' | 'images' | 'sheets') => void;
  onSaveConfig: (newConfig: AppConfig, newPackages?: PackageTier[]) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onResetConfig: () => Promise<void>;
  onRefreshOrders: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  packages,
  orders,
  adminEmail,
  activeTab,
  setActiveTab,
  onSaveConfig,
  onUpdateOrderStatus,
  onDeleteOrder,
  onResetConfig,
  onRefreshOrders,
}) => {
  // Local state copy for editing
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [localPackages, setLocalPackages] = useState<PackageTier[]>(packages);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Orders filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Google Sheets test status
  const [testingSheet, setTestingSheet] = useState(false);
  const [sheetTestResult, setSheetTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await onSaveConfig(localConfig, localPackages);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (e) {
      setSaveStatus('error');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate order stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;

  // CSV Export
  const exportOrdersCSV = () => {
    const headers = ['Ma_Don', 'Ngay_Tao', 'Ten_Khach', 'Email', 'SDT', 'Dia_Chi', 'Goi_Sach', 'So_Luong', 'Tong_Tien', 'Trang_Thai', 'Ghi_Chu'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString('vi-VN'),
      `"${o.name}"`,
      o.email,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.packageName}"`,
      o.quantity,
      `$${o.totalAmount}`,
      o.status,
      `"${(o.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_don_hang_ctrlc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Sheet Test
  const testGoogleSheet = async () => {
    if (!localConfig.googleSheetWebhookUrl) {
      setSheetTestResult({ success: false, message: 'Vui lòng nhập Webhook URL trước khi kiểm tra.' });
      return;
    }

    setTestingSheet(true);
    setSheetTestResult(null);

    try {
      const res = await fetch('/api/sheets/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: localConfig.googleSheetWebhookUrl,
          adminEmail,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSheetTestResult({ success: true, message: data.message || 'Kết nối thành công!' });
      } else {
        setSheetTestResult({ success: false, message: data.error || 'Kết nối không thành công.' });
      }
    } catch (err: any) {
      setSheetTestResult({ success: false, message: err.message || 'Lỗi mạng khi gọi webhook.' });
    } finally {
      setTestingSheet(false);
    }
  };

  // Google Apps Script code template
  const appsScriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Tạo hàng tiêu đề nếu bảng tính còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Mã Đơn", "Thời Gian", "Tên Khách Hàng", "Email", 
        "Số Điện Thoại", "Địa Chỉ", "Gói Sách", "Giá", 
        "Số Lượng", "Tổng Tiền ($)", "Trạng Thái", "Ghi Chú"
      ]);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.order_id || "",
      new Date().toLocaleString("vi-VN"),
      data.customer_name || "",
      data.email || "",
      "'" + (data.phone || ""),
      data.address || "",
      data.package_name || "",
      data.price || 0,
      data.quantity || 1,
      data.total_amount || 0,
      data.status || "pending",
      data.note || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyAppsScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Move section in order
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...localConfig.sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setLocalConfig({ ...localConfig, sectionOrder: list });
  };

  // Toggle section visibility
  const toggleSection = (key: string) => {
    const current = localConfig.enabledSections || {};
    setLocalConfig({
      ...localConfig,
      enabledSections: { ...current, [key]: !current[key] },
    });
  };

  return (
    <div className="bg-[#131313] min-h-screen text-white font-body-md pb-24">
      {/* Save Bar Floating at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1b1b] border-t-2 border-[#ffb800] p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-label-mono text-xs">
            {saveStatus === 'saved' ? (
              <span className="text-green-400 font-bold flex items-center gap-1">
                <CheckCircle size={16} /> ĐÃ LƯU CẤU HÌNH THÀNH CÔNG!
              </span>
            ) : saveStatus === 'error' ? (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertCircle size={16} /> LỖI KHI LƯU CẤU HÌNH!
              </span>
            ) : (
              <span className="text-[#d5c4ab]">
                Nhấn "LƯU TẤT CẢ THAY ĐỔI" để áp dụng cho trang Landing Page công khai.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetConfig}
              className="bg-[#353535] text-[#e5e2e1] hover:bg-red-900 hover:text-white font-label-mono px-4 py-2 text-xs font-bold transition-all border border-[#514532] flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>KHÔI PHỤC MẶC ĐỊNH</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-[#ffb800] text-black font-label-mono px-6 py-2 font-extrabold text-xs uppercase hover:bg-white transition-all border-2 border-black brutalist-border flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>{saveStatus === 'saving' ? 'ĐANG LƯU...' : 'LƯU TẤT CẢ THAY ĐỔI'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-[#514532] pb-4">
              <div>
                <h2 className="font-headline-lg text-3xl uppercase font-bold text-white flex items-center gap-3">
                  <ShoppingBag className="text-[#ffb800]" />
                  <span>QUẢN LÝ ĐƠN HÀNG ĐẶT MUA</span>
                </h2>
                <p className="font-label-mono text-xs text-[#d5c4ab] mt-1">
                  Danh sách tất cả các đơn đăng ký từ Landing Page công khai.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onRefreshOrders}
                  className="bg-[#20201f] text-[#e5e2e1] border border-[#514532] hover:border-[#ffb800] px-3 py-2 font-label-mono text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  <span>LÀM MỚI</span>
                </button>

                <button
                  onClick={exportOrdersCSV}
                  className="bg-[#ffb800] text-black border border-black font-label-mono px-4 py-2 text-xs font-bold flex items-center gap-1.5 brutalist-border"
                >
                  <Download size={14} />
                  <span>XUẤT BẢNG CSV</span>
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-label-mono">
              <div className="bg-[#1c1b1b] border-2 border-[#514532] p-4">
                <span className="text-[10px] text-[#d5c4ab] uppercase block">TỔNG SỐ ĐƠN</span>
                <span className="text-3xl font-extrabold text-white">{orders.length}</span>
              </div>
              <div className="bg-[#1c1b1b] border-2 border-[#ffb800] p-4">
                <span className="text-[10px] text-[#ffb800] uppercase block font-bold">ĐƠN CHỜ XÁC NHẬN</span>
                <span className="text-3xl font-extrabold text-[#ffb800]">{pendingCount}</span>
              </div>
              <div className="bg-[#1c1b1b] border-2 border-green-500 p-4">
                <span className="text-[10px] text-green-400 uppercase block font-bold">ĐÃ XÁC NHẬN</span>
                <span className="text-3xl font-extrabold text-green-400">{confirmedCount}</span>
              </div>
              <div className="bg-[#1c1b1b] border-2 border-[#514532] p-4">
                <span className="text-[10px] text-[#d5c4ab] uppercase block">TỔNG DOANH THU</span>
                <span className="text-3xl font-extrabold text-[#ffb800]">${totalRevenue}.00</span>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1c1b1b] p-4 border border-[#514532] font-label-mono text-xs">
              <input
                type="text"
                placeholder="Tìm kiếm theo Tên, Email, SĐT, Mã đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#131313] border border-[#514532] p-2.5 text-white focus:border-[#ffb800] focus:outline-none w-full sm:w-80"
              />

              <div className="flex items-center gap-2">
                <span className="text-[#d5c4ab]">Lọc trạng thái:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#131313] border border-[#514532] p-2.5 text-white focus:border-[#ffb800] focus:outline-none"
                >
                  <option value="all">TẤT CẢ TÌNH TRẠNG</option>
                  <option value="pending">CHỜ XÁC NHẬN (PENDING)</option>
                  <option value="confirmed">ĐÃ XÁC NHẬN (CONFIRMED)</option>
                  <option value="shipped">ĐÃ GIAO HÀNG (SHIPPED)</option>
                  <option value="cancelled">ĐÃ HỦY (CANCELLED)</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto border-2 border-[#514532] bg-[#1c1b1b]">
              <table className="w-full text-left font-label-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#20201f] border-b-2 border-[#514532] text-[#ffb800]">
                    <th className="p-3">MÃ ĐƠN</th>
                    <th className="p-3">THỜI GIAN</th>
                    <th className="p-3">KHÁCH HÀNG</th>
                    <th className="p-3">SĐT / EMAIL</th>
                    <th className="p-3">ĐỊA CHỈ</th>
                    <th className="p-3">GÓI SÁCH</th>
                    <th className="p-3 text-right">TỔNG TIỀN</th>
                    <th className="p-3">TRẠNG THÁI</th>
                    <th className="p-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#353535]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-[#d5c4ab]">
                        Chưa có đơn hàng nào khớp với tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#20201f]/60 transition-colors">
                        <td className="p-3 font-bold text-white">{o.id}</td>
                        <td className="p-3 text-[#d5c4ab]">
                          {new Date(o.createdAt).toLocaleString('vi-VN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="p-3 font-bold text-white">{o.name}</td>
                        <td className="p-3 text-[#d5c4ab]">
                          <div>{o.phone}</div>
                          <div className="text-[10px] text-[#ffb800]">{o.email}</div>
                        </td>
                        <td className="p-3 text-[#d5c4ab] max-w-xs truncate" title={o.address}>
                          {o.address}
                        </td>
                        <td className="p-3">
                          <span className="bg-[#353535] text-white px-2 py-0.5 font-bold">
                            {o.packageName} x{o.quantity}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-[#ffb800]">${o.totalAmount}.00</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                              o.status === 'confirmed'
                                ? 'bg-green-900 text-green-300'
                                : o.status === 'shipped'
                                ? 'bg-blue-900 text-blue-300'
                                : o.status === 'cancelled'
                                ? 'bg-red-900 text-red-300'
                                : 'bg-[#ffb800] text-black'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {o.status === 'pending' && (
                              <button
                                onClick={() => onUpdateOrderStatus(o.id, 'confirmed')}
                                className="bg-green-700 hover:bg-green-600 text-white p-1.5 text-[10px] font-bold"
                                title="Xác nhận đơn"
                              >
                                XÁC NHẬN
                              </button>
                            )}

                            {o.status === 'confirmed' && (
                              <button
                                onClick={() => onUpdateOrderStatus(o.id, 'shipped')}
                                className="bg-blue-700 hover:bg-blue-600 text-white p-1.5 text-[10px] font-bold"
                                title="Đánh dấu đã giao"
                              >
                                ĐÃ GIAO
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteOrder(o.id)}
                              className="text-red-400 hover:text-white p-1.5 hover:bg-red-900"
                              title="Xóa đơn hàng"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Content Text Editor */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="border-b-2 border-[#514532] pb-4">
              <h2 className="font-headline-lg text-3xl uppercase font-bold text-white flex items-center gap-3">
                <Settings className="text-[#ffb800]" />
                <span>TỦY CHỈNH NỘI DUNG VĂN BẢN LANDING PAGE</span>
              </h2>
              <p className="font-label-mono text-xs text-[#d5c4ab] mt-1">
                Chỉnh sửa tất cả tiêu đề, trích đoạn, giới thiệu tác giả, đánh giá và link liên kết.
              </p>
            </div>

            {/* Hero Section Content */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                1. HERO BANNER
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    STATUS TAG
                  </label>
                  <input
                    type="text"
                    value={localConfig.hero.statusTag}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        hero: { ...localConfig.hero, statusTag: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-sm text-white focus:border-[#ffb800]"
                  />
                </div>

                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    TIÊU ĐỀ NỔI BẬT PART 1 / PART 2 / PART 3
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={localConfig.hero.headlinePart1}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          hero: { ...localConfig.hero, headlinePart1: e.target.value },
                        })
                      }
                      className="bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-sm text-white w-1/3"
                    />
                    <input
                      type="text"
                      value={localConfig.hero.headlinePart2}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          hero: { ...localConfig.hero, headlinePart2: e.target.value },
                        })
                      }
                      className="bg-[#131313] border border-[#ffb800] p-2.5 font-label-mono text-sm text-[#ffb800] w-1/3"
                    />
                    <input
                      type="text"
                      value={localConfig.hero.headlinePart3}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          hero: { ...localConfig.hero, headlinePart3: e.target.value },
                        })
                      }
                      className="bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-sm text-white w-1/3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                  ĐOẠN MÔ TẢ NGẮN (HERO SUBTEXT)
                </label>
                <textarea
                  rows={2}
                  value={localConfig.hero.subText}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      hero: { ...localConfig.hero, subText: e.target.value },
                    })
                  }
                  className="w-full bg-[#131313] border border-[#514532] p-2.5 font-body-md text-sm text-white focus:border-[#ffb800]"
                />
              </div>
            </div>

            {/* Preview & Full Chapter Read Content */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                2. GIỚI THIỆU TÁC PHẨM & ĐỌC THỬ (THE PREVIEW)
              </h3>

              <div>
                <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                  TIÊU ĐỀ SECTION
                </label>
                <input
                  type="text"
                  value={localConfig.preview.title}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      preview: { ...localConfig.preview, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    ĐOẠN TRÍCH 1 (TRÊN LANDING PAGE)
                  </label>
                  <textarea
                    rows={3}
                    value={localConfig.preview.p1}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        preview: { ...localConfig.preview, p1: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-body-md text-sm text-white"
                  />
                </div>

                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    ĐOẠN TRÍCH 2 (TRÊN LANDING PAGE)
                  </label>
                  <textarea
                    rows={3}
                    value={localConfig.preview.p2}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        preview: { ...localConfig.preview, p2: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-body-md text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-mono text-xs text-[#ffb800] font-bold block mb-1">
                  NỘI DUNG ĐẦY ĐỦ CHO POPUP "ĐỌC THỬ" (FULL CHAPTER READ TEXT)
                </label>
                <textarea
                  rows={8}
                  value={localConfig.preview.fullChapterText}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      preview: { ...localConfig.preview, fullChapterText: e.target.value },
                    })
                  }
                  className="w-full bg-[#131313] border-2 border-[#ffb800] p-3 font-body-md text-sm text-white font-mono"
                />
              </div>
            </div>

            {/* Author Section */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                3. TÁC GIẢ (THE ARCHITECT)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    TÊN TÁC GIẢ
                  </label>
                  <input
                    type="text"
                    value={localConfig.author.name}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        author: { ...localConfig.author, name: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-sm text-white"
                  />
                </div>

                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    TAG TÁC GIẢ
                  </label>
                  <input
                    type="text"
                    value={localConfig.author.tag}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        author: { ...localConfig.author, tag: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                  TIỂU SỬ TÁC GIẢ
                </label>
                <textarea
                  rows={3}
                  value={localConfig.author.bio}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      author: { ...localConfig.author, bio: e.target.value },
                    })
                  }
                  className="w-full bg-[#131313] border border-[#514532] p-2.5 font-body-md text-sm text-white"
                />
              </div>
            </div>

            {/* Pricing Tiers Editor */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                4. QUẢN LÝ GÓI SẢN PHẨM & BẢNG GIÁ
              </h3>

              <div className="space-y-4">
                {localPackages.map((pkg, index) => (
                  <div key={pkg.id} className="p-4 bg-[#131313] border border-[#514532] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-label-mono text-xs text-[#ffb800] font-bold">
                        GÓI #{index + 1} ({pkg.id})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-label-mono text-[10px] text-[#d5c4ab] block">TÊN GÓI</label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => {
                            const updated = [...localPackages];
                            updated[index].name = e.target.value;
                            setLocalPackages(updated);
                          }}
                          className="w-full bg-[#1c1b1b] border border-[#514532] p-2 font-label-mono text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="font-label-mono text-[10px] text-[#d5c4ab] block">GIÁ ($ USD)</label>
                        <input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => {
                            const updated = [...localPackages];
                            updated[index].price = parseFloat(e.target.value) || 0;
                            setLocalPackages(updated);
                          }}
                          className="w-full bg-[#1c1b1b] border border-[#514532] p-2 font-label-mono text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="font-label-mono text-[10px] text-[#d5c4ab] block">HUY HIỆU (BADGE)</label>
                        <input
                          type="text"
                          value={pkg.badge || ''}
                          onChange={(e) => {
                            const updated = [...localPackages];
                            updated[index].badge = e.target.value;
                            setLocalPackages(updated);
                          }}
                          placeholder="RECOMMENDED..."
                          className="w-full bg-[#1c1b1b] border border-[#514532] p-2 font-label-mono text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer External Nodes */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                5. LINK LIÊN KẾT BÁN HÀNG SÀN THƯƠNG MẠI
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    LINK MUA TRÊN FAHASA
                  </label>
                  <input
                    type="text"
                    value={localConfig.footer.fahasaUrl}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        footer: { ...localConfig.footer, fahasaUrl: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    LINK MUA TRÊN TIKI
                  </label>
                  <input
                    type="text"
                    value={localConfig.footer.tikiUrl}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        footer: { ...localConfig.footer, tikiUrl: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    LINK MUA TRÊN SHOPEE
                  </label>
                  <input
                    type="text"
                    value={localConfig.footer.shopeeUrl}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        footer: { ...localConfig.footer, shopeeUrl: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Colors & Drag Drop Layout Order */}
        {activeTab === 'theme' && (
          <div className="space-y-8">
            <div className="border-b-2 border-[#514532] pb-4">
              <h2 className="font-headline-lg text-3xl uppercase font-bold text-white flex items-center gap-3">
                <Palette className="text-[#ffb800]" />
                <span>MÀU SẮC CHỦ ĐẠO & KÉO THẢ THỨ TỰ CÁC SECTION</span>
              </h2>
              <p className="font-label-mono text-xs text-[#d5c4ab] mt-1">
                Tùy chỉnh tông màu thiết kế Đen + Vàng, thay đổi thứ tự xuất hiện hoặc ẩn/hiện các phần.
              </p>
            </div>

            {/* Color Palette Selector */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                1. MÀU SẮC CHỦ ĐẠO (THEME PALETTE)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-2">
                    MÀU CHỦ ĐẠO ACCENT (PRIMARY COLOR)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={localConfig.primaryColor}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, primaryColor: e.target.value })
                      }
                      className="w-12 h-12 bg-transparent cursor-pointer border-2 border-white"
                    />
                    <input
                      type="text"
                      value={localConfig.primaryColor}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, primaryColor: e.target.value })
                      }
                      className="bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-sm text-white w-32"
                    />
                  </div>
                </div>

                {/* Preset Palettes */}
                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-2">
                    BẢNG MÀU GỢI Ý MẪU CYBER BRUTALIST
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Vàng Cyber', color: '#ffb800' },
                      { name: 'Xanh Neon', color: '#00e5ff' },
                      { name: 'Đỏ Cyberpunk', color: '#ff3366' },
                      { name: 'Xanh Matrix', color: '#00ff66' },
                      { name: 'Cam Hổ Phách', color: '#ff8800' },
                    ].map((p) => (
                      <button
                        key={p.color}
                        onClick={() => setLocalConfig({ ...localConfig, primaryColor: p.color })}
                        className="px-3 py-1.5 font-label-mono text-xs font-bold text-black border border-black flex items-center gap-1.5"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Reorder & Visibility Toggle */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                2. KÉO THẢ & SẮP XẾP THỨ TỰ SECTION (SECTION LAYOUT REORDER)
              </h3>
              <p className="font-label-mono text-xs text-[#d5c4ab]">
                Nhấn mũi tên lên/xuống để thay đổi thứ tự xuất hiện các phần trên Landing Page hoặc bấm nút mắt để Ẩn/Hiện.
              </p>

              <div className="space-y-2 max-w-2xl">
                {localConfig.sectionOrder.map((secKey, index) => {
                  const isEnabled = localConfig.enabledSections?.[secKey] !== false;
                  return (
                    <div
                      key={secKey}
                      className="flex items-center justify-between p-3 bg-[#131313] border border-[#514532] font-label-mono text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#ffb800] font-bold">#{index + 1}</span>
                        <span className="font-bold text-white uppercase">{secKey}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Toggle section visibility */}
                        <button
                          onClick={() => toggleSection(secKey)}
                          className={`p-1.5 border font-bold flex items-center gap-1 ${
                            isEnabled
                              ? 'bg-green-900/60 text-green-300 border-green-500'
                              : 'bg-red-900/60 text-red-300 border-red-500'
                          }`}
                        >
                          {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
                          <span>{isEnabled ? 'HIỆN' : 'ẨN'}</span>
                        </button>

                        {/* Up button */}
                        <button
                          disabled={index === 0}
                          onClick={() => moveSection(index, 'up')}
                          className="p-1.5 bg-[#353535] text-white hover:bg-[#ffb800] hover:text-black disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>

                        {/* Down button */}
                        <button
                          disabled={index === localConfig.sectionOrder.length - 1}
                          onClick={() => moveSection(index, 'down')}
                          className="p-1.5 bg-[#353535] text-white hover:bg-[#ffb800] hover:text-black disabled:opacity-30"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Images & Asset Manager */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            <div className="border-b-2 border-[#514532] pb-4">
              <h2 className="font-headline-lg text-3xl uppercase font-bold text-white flex items-center gap-3">
                <ImageIcon className="text-[#ffb800]" />
                <span>QUẢN LÝ HÌNH ẢNH & ARCHIVE VISUALS GALLERY</span>
              </h2>
              <p className="font-label-mono text-xs text-[#d5c4ab] mt-1">
                Thay đổi đường dẫn hình ảnh Banner, Ảnh Tác giả và Bộ sưu tập hình ảnh.
              </p>
            </div>

            {/* Hero Image & Author Image */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                1. ẢNH NỀN HERO & ẢNH CHÂN DUNG TÁC GIẢ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    URL ẢNH NỀN HERO BANNER
                  </label>
                  <input
                    type="text"
                    value={localConfig.hero.bgImage}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        hero: { ...localConfig.hero, bgImage: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-xs text-white"
                  />
                  <div className="mt-2 aspect-video bg-black border border-[#514532] overflow-hidden">
                    <img
                      src={localConfig.hero.bgImage}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-mono text-xs text-[#d5c4ab] block mb-1">
                    URL ẢNH CHÂN DUNG TÁC GIẢ
                  </label>
                  <input
                    type="text"
                    value={localConfig.author.image}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        author: { ...localConfig.author, image: e.target.value },
                      })
                    }
                    className="w-full bg-[#131313] border border-[#514532] p-2.5 font-label-mono text-xs text-white"
                  />
                  <div className="mt-2 aspect-square max-w-[180px] bg-black border border-[#514532] overflow-hidden">
                    <img
                      src={localConfig.author.image}
                      alt="Author Preview"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Images List */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                  2. THƯ VIỆN HÌNH ẢNH (ARCHIVE VISUALS GALLERY)
                </h3>
                <button
                  onClick={() => {
                    const newImg: GalleryImage = {
                      id: String(Date.now()),
                      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWYaIRV4RU9xHo0CYDO4IMKatCzQrNSEpUtHkLav3V3SxtaoFYMaF9PRScQHoTnlzVWaSfq4Yd4KgzqaYzu4ShJHlYloZg8MUL_VseqyqNhrwIA1tJgT__t8tes-gUlLUeSTFFfEgJaVpKgpQv4riMde1oz5sTuWgNZ_8DwWkUYXPdXWAOh64Kt3I4eY0ANGjkTmvA_szXM4AYXiL8mEUTSt3qIEltRHxywqxx4uo5MWU4_GhaWw0heeNGyXh51AgMV2h2H8Cazpg',
                      alt: 'New Visual Archive',
                      location: 'LOCATION: CYBER_NODE',
                    };
                    setLocalConfig({
                      ...localConfig,
                      gallery: {
                        ...localConfig.gallery,
                        images: [...localConfig.gallery.images, newImg],
                      },
                    });
                  }}
                  className="bg-[#ffb800] text-black font-label-mono px-3 py-1.5 text-xs font-bold flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>THÊM ẢNH MỚI</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localConfig.gallery.images.map((img, idx) => (
                  <div key={img.id || idx} className="p-4 bg-[#131313] border border-[#514532] space-y-2 relative">
                    <button
                      onClick={() => {
                        const updated = localConfig.gallery.images.filter((_, i) => i !== idx);
                        setLocalConfig({
                          ...localConfig,
                          gallery: { ...localConfig.gallery, images: updated },
                        });
                      }}
                      className="absolute top-2 right-2 bg-red-900 text-white p-1 hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                    </button>

                    <label className="font-label-mono text-[10px] text-[#d5c4ab] block">URL ẢNH #{idx + 1}</label>
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => {
                        const updated = [...localConfig.gallery.images];
                        updated[idx].url = e.target.value;
                        setLocalConfig({
                          ...localConfig,
                          gallery: { ...localConfig.gallery, images: updated },
                        });
                      }}
                      className="w-full bg-[#1c1b1b] border border-[#514532] p-2 font-label-mono text-xs text-white"
                    />

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mô tả ảnh..."
                        value={img.alt}
                        onChange={(e) => {
                          const updated = [...localConfig.gallery.images];
                          updated[idx].alt = e.target.value;
                          setLocalConfig({
                            ...localConfig,
                            gallery: { ...localConfig.gallery, images: updated },
                          });
                        }}
                        className="w-1/2 bg-[#1c1b1b] border border-[#514532] p-2 font-label-mono text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Location Tag..."
                        value={img.location || ''}
                        onChange={(e) => {
                          const updated = [...localConfig.gallery.images];
                          updated[idx].location = e.target.value;
                          setLocalConfig({
                            ...localConfig,
                            gallery: { ...localConfig.gallery, images: updated },
                          });
                        }}
                        className="w-1/2 bg-[#1c1b1b] border border-[#514532] p-2 font-label-mono text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Google Sheets Integration */}
        {activeTab === 'sheets' && (
          <div className="space-y-8">
            <div className="border-b-2 border-[#514532] pb-4">
              <h2 className="font-headline-lg text-3xl uppercase font-bold text-white flex items-center gap-3">
                <FileSpreadsheet className="text-[#ffb800]" />
                <span>KẾT NỐI VÀ ĐỒNG BỘ DỮ LIỆU VỚI GOOGLE SHEETS</span>
              </h2>
              <p className="font-label-mono text-xs text-[#d5c4ab] mt-1">
                Tự động ghi thông tin đơn hàng từ form đăng ký mua sang tệp Google Sheet online thời gian thực.
              </p>
            </div>

            {/* Webhook URL Config */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-4">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                1. ĐƯỜNG DẪN WEBHOOK GOOGLE APPS SCRIPT
              </h3>

              <div className="space-y-2">
                <label className="font-label-mono text-xs text-[#d5c4ab] block">
                  NHẬP GOOGLE APPS SCRIPT WEBHOOK URL:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={localConfig.googleSheetWebhookUrl}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, googleSheetWebhookUrl: e.target.value })
                    }
                    className="flex-1 bg-[#131313] border-2 border-[#ffb800] p-3 font-label-mono text-xs text-white focus:outline-none"
                  />

                  <button
                    onClick={testGoogleSheet}
                    disabled={testingSheet}
                    className="bg-[#ffb800] text-black font-label-mono px-6 py-3 font-bold text-xs uppercase hover:bg-white border-2 border-black brutalist-border flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {testingSheet ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                    <span>KIỂM TRA KẾT NỐI</span>
                  </button>
                </div>
              </div>

              {sheetTestResult && (
                <div
                  className={`p-4 font-label-mono text-xs border-2 ${
                    sheetTestResult.success
                      ? 'bg-green-950 border-green-500 text-green-200'
                      : 'bg-red-950 border-red-500 text-red-200'
                  }`}
                >
                  <p className="font-bold uppercase mb-1">
                    {sheetTestResult.success ? '✓ KẾT NỐI THÀNH CÔNG!' : '✕ LỖI KẾT NỐI'}
                  </p>
                  <p>{sheetTestResult.message}</p>
                </div>
              )}
            </div>

            {/* Step-by-Step Guide */}
            <div className="bg-[#1c1b1b] border-2 border-[#514532] p-6 space-y-6">
              <h3 className="font-headline-lg text-xl uppercase font-bold text-[#ffb800]">
                2. HƯỚNG DẪN TẠO GOOGLE SHEET & CẤU HÌNH TRONG 3 BƯỚC
              </h3>

              <div className="space-y-4 font-body-md text-sm text-[#e5e2e1]">
                <div className="p-4 bg-[#131313] border-l-4 border-[#ffb800] space-y-2">
                  <span className="font-label-mono text-xs font-bold text-[#ffb800] uppercase block">
                    BƯỚC 1: TẠO GOOGLE SHEET MỚI
                  </span>
                  <p>
                    Truy cập{' '}
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#ffb800] underline font-bold"
                    >
                      sheets.new <ExternalLink size={12} className="inline" />
                    </a>{' '}
                    để tạo tệp Google Sheet trực tuyến mới. Đặt tên tệp tùy ý (Ví dụ: <em>CTRL_C_Orders_2024</em>).
                  </p>
                </div>

                <div className="p-4 bg-[#131313] border-l-4 border-[#ffb800] space-y-2">
                  <span className="font-label-mono text-xs font-bold text-[#ffb800] uppercase block">
                    BƯỚC 2: MỞ APPS SCRIPT VÀ DÁN CODE MẪU
                  </span>
                  <p>
                    Trên tệp Google Sheet, chọn menu <strong>Tiện ích mở rộng (Extensions)</strong> &rarr;{' '}
                    <strong>Apps Script</strong>. Xóa toàn bộ nội dung cũ và dán mã bên dưới:
                  </p>

                  <div className="relative mt-2">
                    <pre className="bg-black p-4 text-xs font-mono text-green-400 border border-[#514532] overflow-x-auto max-h-60">
                      {appsScriptCode}
                    </pre>
                    <button
                      onClick={copyAppsScript}
                      className="absolute top-2 right-2 bg-[#ffb800] text-black font-label-mono text-[11px] font-bold px-3 py-1 border border-black flex items-center gap-1 hover:bg-white"
                    >
                      {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode ? 'ĐÃ SAO CHÉP!' : 'SAO CHÉP CODE'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#131313] border-l-4 border-[#ffb800] space-y-2">
                  <span className="font-label-mono text-xs font-bold text-[#ffb800] uppercase block">
                    BƯỚC 3: TRIỂN KHAI VÀ LẤY URL WEBHOOK
                  </span>
                  <p>
                    Nhấn nút <strong>Triển khai (Deploy)</strong> ở góc trên bên phải &rarr;{' '}
                    <strong>Triển khai dưới dạng ứng dụng web (New deployment)</strong>:
                  </p>
                  <ul className="list-disc list-inside font-label-mono text-xs text-[#d5c4ab] space-y-1">
                    <li>
                      Thực thi dưới dạng (Execute as): <strong className="text-white">Tôi (Me)</strong>
                    </li>
                    <li>
                      Ai có quyền truy cập (Who has access):{' '}
                      <strong className="text-[#ffb800]">Bất kỳ ai (Anyone)</strong>
                    </li>
                  </ul>
                  <p className="pt-1">
                    Nhấn <strong>Triển khai (Deploy)</strong>, cấp quyền truy cập tài khoản Google, sau đó sao chép{' '}
                    <strong>URL Ứng dụng web (Web App URL)</strong> và dán vào mục 1 ở trên!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
