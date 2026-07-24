export interface PressQuote {
  id: string;
  quote: string;
  source: string;
}

export interface RewardItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface PackageTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  recommended?: boolean;
  features: string[];
}

export interface LogisticsItem {
  id: string;
  icon: string;
  title: string;
  cmd: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  location?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface AppConfig {
  primaryColor: string;
  primaryLight: string;
  bgColor: string;
  surfaceColor: string;
  title: string;

  navigation?: {
    story: string;
    character: string;
    archive: string;
    order: string;
    readTrialButton: string;
    readNowButton: string;
  };
  
  hero: {
    statusTag: string;
    headlinePart1: string;
    headlinePart2: string;
    headlinePart3: string;
    subText: string;
    bgImage: string;
    button1Text: string;
    button2Text: string;
  };

  preview: {
    title: string;
    p1: string;
    p2: string;
    fullChapterTitle: string;
    fullChapterText: string;
    readButtonText: string;
  };

  author: {
    title: string;
    name: string;
    tag: string;
    bio: string;
    image: string;
  };

  press: {
    sectionTitle: string;
    quotes: PressQuote[];
  };

  ticker: {
    enabled: boolean;
    messages: string[];
  };

  rewards: {
    sectionTitle: string;
    items: RewardItem[];
  };

  checkout: {
    sectionTitle: string;
    timerMinutes: number;
    defaultPackageId: string;
  };

  logistics: {
    sectionTitle: string;
    items: LogisticsItem[];
  };

  gallery: {
    sectionTitle: string;
    images: GalleryImage[];
  };

  reviews: {
    sectionTitle: string;
    items: CustomerReview[];
  };

  footer: {
    publicationId: string;
    isbn: string;
    publisher: string;
    copyright: string;
    fahasaUrl: string;
    tikiUrl: string;
    shopeeUrl: string;
    socialLinks: SocialLink[];
  };

  googleSheetWebhookUrl: string;
  sectionOrder: string[];
  enabledSections: Record<string, boolean>;
}

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  packageId: string;
  packageName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  note?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  syncedToSheet?: boolean;
  syncedAt?: string;
}

export interface AuthUser {
  email: string;
  name: string;
  picture: string;
  isAdmin: boolean;
}
