import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PreviewSection } from './components/PreviewSection';
import { ChapterPreviewModal } from './components/ChapterPreviewModal';
import { AuthorSection } from './components/AuthorSection';
import { PressSection } from './components/PressSection';
import { TickerSection } from './components/TickerSection';
import { RewardsSection } from './components/RewardsSection';
import { CheckoutSection } from './components/CheckoutSection';
import { LogisticsSection } from './components/LogisticsSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { FooterSection } from './components/FooterSection';
import { AdminBar } from './components/AdminBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

import { AppConfig, AuthUser, Order, PackageTier } from './types';
import { defaultConfig, defaultPackages } from './data/defaultConfig';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [packages, setPackages] = useState<PackageTier[]>(defaultPackages);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Modals & Active Tab
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'preview' | 'orders' | 'content' | 'theme' | 'images' | 'sheets'>('preview');

  // Load config on mount
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.packages) setPackages(data.packages);
      }
    } catch (e) {
      console.error('Failed to load initial config from backend', e);
    }
  };

  // Load orders (if admin)
  const fetchOrders = async (email?: string) => {
    const adminEmail = email || user?.email;
    if (!adminEmail || adminEmail.toLowerCase() !== 'dinhanh1994@gmail.com') return;

    try {
      const res = await fetch(`/api/orders?adminEmail=${encodeURIComponent(adminEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    }
  };

  useEffect(() => {
    fetchConfig();

    const checkAdminUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.endsWith('/admin') || path.includes('/admin/') || hash.includes('admin')) {
        setIsAdminLoginModalOpen(true);
      }
    };

    checkAdminUrl();
    window.addEventListener('popstate', checkAdminUrl);
    window.addEventListener('hashchange', checkAdminUrl);

    return () => {
      window.removeEventListener('popstate', checkAdminUrl);
      window.removeEventListener('hashchange', checkAdminUrl);
    };
  }, []);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchOrders(user.email);
    }
  }, [user]);

  // Handler for saving config
  const handleSaveConfig = async (newConfig: AppConfig, newPackages?: PackageTier[]) => {
    if (!user?.isAdmin) return;

    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newConfig,
        newPackages,
        adminEmail: user.email,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setConfig(data.config);
      if (data.packages) setPackages(data.packages);
    } else {
      throw new Error('Save failed');
    }
  };

  // Handler for resetting config to default
  const handleResetConfig = async () => {
    if (!user?.isAdmin) return;
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục giao diện mặc định ban đầu không?')) return;

    const res = await fetch('/api/config/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: user.email }),
    });

    if (res.ok) {
      const data = await res.json();
      setConfig(data.config);
      if (data.packages) setPackages(data.packages);
    }
  };

  // Order status update handler
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!user?.isAdmin) return;

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: user.email, status }),
    });

    if (res.ok) {
      fetchOrders();
    }
  };

  // Order delete handler
  const handleDeleteOrder = async (orderId: string) => {
    if (!user?.isAdmin) return;
    if (!window.confirm(`Xóa đơn hàng ${orderId}?`)) return;

    const res = await fetch(`/api/orders/${orderId}?adminEmail=${encodeURIComponent(user.email)}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchOrders();
    }
  };

  const scrollToOrder = () => {
    const el = document.getElementById('order');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Section Component Map
  const renderSection = (secKey: string) => {
    if (config.enabledSections && config.enabledSections[secKey] === false) {
      return null;
    }

    switch (secKey) {
      case 'hero':
        return (
          <Hero
            key="hero"
            heroData={config.hero}
            primaryColor={config.primaryColor}
            onOpenOrder={scrollToOrder}
            onOpenChapterModal={() => setIsChapterModalOpen(true)}
          />
        );
      case 'preview':
        return (
          <PreviewSection
            key="preview"
            previewData={config.preview}
            primaryColor={config.primaryColor}
            onOpenChapterModal={() => setIsChapterModalOpen(true)}
          />
        );
      case 'author':
        return (
          <AuthorSection
            key="author"
            authorData={config.author}
            primaryColor={config.primaryColor}
          />
        );
      case 'press':
        return (
          <PressSection
            key="press"
            pressData={config.press}
            primaryColor={config.primaryColor}
          />
        );
      case 'ticker':
        return (
          <TickerSection
            key="ticker"
            messages={config.ticker?.messages || []}
            primaryColor={config.primaryColor}
          />
        );
      case 'rewards':
        return (
          <RewardsSection
            key="rewards"
            rewardsData={config.rewards}
            primaryColor={config.primaryColor}
          />
        );
      case 'checkout':
        return (
          <CheckoutSection
            key="checkout"
            packages={packages}
            primaryColor={config.primaryColor}
            onOrderSubmitted={() => {
              if (user?.isAdmin) fetchOrders();
            }}
          />
        );
      case 'logistics':
        return (
          <LogisticsSection
            key="logistics"
            logisticsData={config.logistics}
            primaryColor={config.primaryColor}
          />
        );
      case 'gallery':
        return (
          <GallerySection
            key="gallery"
            galleryData={config.gallery}
            primaryColor={config.primaryColor}
          />
        );
      case 'reviews':
        return (
          <ReviewsSection
            key="reviews"
            reviewsData={config.reviews}
            primaryColor={config.primaryColor}
          />
        );
      case 'footer':
        return (
          <FooterSection
            key="footer"
            footerData={config.footer}
            title={config.title}
            primaryColor={config.primaryColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] selection:bg-[#ffb800] selection:text-black">
      {/* Top Admin Navigation Bar when logged in as dinhanh1994@gmail.com */}
      {user?.isAdmin && (
        <AdminBar
          user={user}
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          onLogout={() => setUser(null)}
          orderCount={orders.filter((o) => o.status === 'pending').length}
        />
      )}

      {/* Main Website Navigation */}
      <Navbar
        title={config.title}
        primaryColor={config.primaryColor}
        user={user}
        onOpenAdmin={() => setIsAdminLoginModalOpen(true)}
        onOpenChapterModal={() => setIsChapterModalOpen(true)}
        onOpenOrder={scrollToOrder}
      />

      {/* Show Admin Dashboard if Admin and Tab is not purely 'preview' */}
      {user?.isAdmin && adminTab !== 'preview' ? (
        <AdminDashboard
          config={config}
          packages={packages}
          orders={orders}
          adminEmail={user.email}
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          onSaveConfig={handleSaveConfig}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onResetConfig={handleResetConfig}
          onRefreshOrders={fetchOrders}
        />
      ) : (
        /* Public Landing Page Render */
        <main>{(config.sectionOrder || []).map((secKey) => renderSection(secKey))}</main>
      )}

      {/* Chapter Read Preview Modal */}
      <ChapterPreviewModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        previewData={config.preview}
        primaryColor={config.primaryColor}
        onOpenOrder={scrollToOrder}
      />

      {/* Admin Google Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setAdminTab('orders');
        }}
        primaryColor={config.primaryColor}
      />
    </div>
  );
}
