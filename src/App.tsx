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

import { AppConfig, AuthUser, Order, PackageTier, CustomerReview, RewardItem, LogisticsItem } from './types';
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
      const ct = res.headers.get('content-type');
      if (res.ok && ct && ct.includes('application/json')) {
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
      const ct = res.headers.get('content-type');
      if (res.ok && ct && ct.includes('application/json')) {
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
    const adminEmail = user?.email || 'dinhanh1994@gmail.com';

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newConfig,
          newPackages: newPackages || packages,
          adminEmail,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.packages) setPackages(data.packages);
        return;
      }
    } catch (e) {
      console.warn('Backend save error, applying to local app state:', e);
    }

    // Direct update to local application state
    setConfig(newConfig);
    if (newPackages) setPackages(newPackages);
  };

  // Helper update state functions for inline UI editing
  const updateTitle = (newTitle: string) => {
    setConfig((prev) => ({ ...prev, title: newTitle }));
  };

  const updateNav = (field: keyof Required<AppConfig>['navigation'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      navigation: {
        story: prev.navigation?.story || 'STORY',
        character: prev.navigation?.character || 'CHARACTER',
        archive: prev.navigation?.archive || 'ARCHIVE',
        order: prev.navigation?.order || 'ORDER',
        readTrialButton: prev.navigation?.readTrialButton || 'ĐỌC THỬ',
        readNowButton: prev.navigation?.readNowButton || 'READ NOW',
        [field]: value,
      },
    }));
  };

  const updateHeroField = (field: keyof AppConfig['hero'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updatePreviewField = (field: keyof AppConfig['preview'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      preview: { ...prev.preview, [field]: value },
    }));
  };

  const updateAuthorField = (field: keyof AppConfig['author'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      author: { ...prev.author, [field]: value },
    }));
  };

  const updatePressTitle = (title: string) => {
    setConfig((prev) => ({
      ...prev,
      press: { ...prev.press, sectionTitle: title },
    }));
  };

  const updatePressQuote = (index: number, quote: string, source: string) => {
    setConfig((prev) => {
      const newQuotes = [...prev.press.quotes];
      if (newQuotes[index]) {
        newQuotes[index] = { ...newQuotes[index], quote, source };
      }
      return { ...prev, press: { ...prev.press, quotes: newQuotes } };
    });
  };

  const updateTickerMessage = (index: number, val: string) => {
    setConfig((prev) => {
      const msgs = [...(prev.ticker?.messages || [])];
      msgs[index] = val;
      return { ...prev, ticker: { ...prev.ticker, messages: msgs } };
    });
  };

  const updateRewardsTitle = (title: string) => {
    setConfig((prev) => ({ ...prev, rewards: { ...prev.rewards, sectionTitle: title } }));
  };

  const updateRewardItem = (index: number, updated: Partial<RewardItem>) => {
    setConfig((prev) => {
      const items = [...prev.rewards.items];
      if (items[index]) {
        items[index] = { ...items[index], ...updated };
      }
      return { ...prev, rewards: { ...prev.rewards, items } };
    });
  };

  const updateLogisticsTitle = (title: string) => {
    setConfig((prev) => ({ ...prev, logistics: { ...prev.logistics, sectionTitle: title } }));
  };

  const updateLogisticsItem = (index: number, updated: Partial<LogisticsItem>) => {
    setConfig((prev) => {
      const items = [...prev.logistics.items];
      if (items[index]) {
        items[index] = { ...items[index], ...updated };
      }
      return { ...prev, logistics: { ...prev.logistics, items } };
    });
  };

  const updateGalleryTitle = (title: string) => {
    setConfig((prev) => ({ ...prev, gallery: { ...prev.gallery, sectionTitle: title } }));
  };

  const updateGalleryImage = (index: number, newUrl: string) => {
    setConfig((prev) => {
      const imgs = [...prev.gallery.images];
      if (imgs[index]) {
        imgs[index] = { ...imgs[index], url: newUrl };
      }
      return { ...prev, gallery: { ...prev.gallery, images: imgs } };
    });
  };

  const updateGalleryAlt = (index: number, newAlt: string) => {
    setConfig((prev) => {
      const imgs = [...prev.gallery.images];
      if (imgs[index]) {
        imgs[index] = { ...imgs[index], alt: newAlt };
      }
      return { ...prev, gallery: { ...prev.gallery, images: imgs } };
    });
  };

  const updateReviewsTitle = (title: string) => {
    setConfig((prev) => ({ ...prev, reviews: { ...prev.reviews, sectionTitle: title } }));
  };

  const updateReviewItem = (index: number, updated: Partial<CustomerReview>) => {
    setConfig((prev) => {
      const items = [...prev.reviews.items];
      if (items[index]) {
        items[index] = { ...items[index], ...updated };
      }
      return { ...prev, reviews: { ...prev.reviews, items } };
    });
  };

  const updateFooterField = (field: keyof AppConfig['footer'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, [field]: value },
    }));
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

  const isAdmin = !!user?.isAdmin;

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
            isAdmin={isAdmin}
            onUpdateHeroField={updateHeroField}
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
            isAdmin={isAdmin}
            onUpdatePreviewField={updatePreviewField}
            onOpenChapterModal={() => setIsChapterModalOpen(true)}
          />
        );
      case 'author':
        return (
          <AuthorSection
            key="author"
            authorData={config.author}
            primaryColor={config.primaryColor}
            isAdmin={isAdmin}
            onUpdateAuthorField={updateAuthorField}
          />
        );
      case 'press':
        return (
          <PressSection
            key="press"
            pressData={config.press}
            primaryColor={config.primaryColor}
            isAdmin={isAdmin}
            onUpdatePressTitle={updatePressTitle}
            onUpdatePressQuote={updatePressQuote}
          />
        );
      case 'ticker':
        return (
          <TickerSection
            key="ticker"
            messages={config.ticker?.messages || []}
            primaryColor={config.primaryColor}
            isAdmin={isAdmin}
            onUpdateTickerMessage={updateTickerMessage}
          />
        );
      case 'rewards':
        return (
          <RewardsSection
            key="rewards"
            rewardsData={config.rewards}
            primaryColor={config.primaryColor}
            isAdmin={isAdmin}
            onUpdateRewardsTitle={updateRewardsTitle}
            onUpdateRewardItem={updateRewardItem}
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
            isAdmin={isAdmin}
            onUpdateLogisticsTitle={updateLogisticsTitle}
            onUpdateLogisticsItem={updateLogisticsItem}
          />
        );
      case 'gallery':
        return (
          <GallerySection
            key="gallery"
            galleryData={config.gallery}
            primaryColor={config.primaryColor}
            isAdmin={isAdmin}
            onUpdateGalleryTitle={updateGalleryTitle}
            onUpdateGalleryImage={updateGalleryImage}
            onUpdateGalleryAlt={updateGalleryAlt}
          />
        );
      case 'reviews':
        return (
          <ReviewsSection
            key="reviews"
            reviewsData={config.reviews}
            primaryColor={config.primaryColor}
            isAdmin={isAdmin}
            onUpdateReviewsTitle={updateReviewsTitle}
            onUpdateReviewItem={updateReviewItem}
          />
        );
      case 'footer':
        return (
          <FooterSection
            key="footer"
            footerData={config.footer}
            title={config.title}
            primaryColor={config.primaryColor}
            isAdmin={isAdmin}
            onUpdateFooterField={updateFooterField}
            onUpdateTitle={updateTitle}
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
          onSaveAll={() => handleSaveConfig(config, packages)}
          orderCount={orders.filter((o) => o.status === 'pending').length}
        />
      )}

      {/* Main Website Navigation */}
      <Navbar
        title={config.title}
        navigation={config.navigation}
        primaryColor={config.primaryColor}
        user={user}
        onUpdateTitle={updateTitle}
        onUpdateNav={updateNav}
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
        /* Public Landing Page Render with inline visual editing enabled */
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
          setAdminTab('preview');
        }}
        primaryColor={config.primaryColor}
      />
    </div>
  );
}
