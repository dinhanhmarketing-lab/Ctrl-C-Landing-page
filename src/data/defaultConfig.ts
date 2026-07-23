import { AppConfig, PackageTier } from '../types';

export const defaultConfig: AppConfig = {
  primaryColor: '#ffb800',
  primaryLight: '#ffdca1',
  bgColor: '#131313',
  surfaceColor: '#20201f',
  title: 'CTRL C',

  hero: {
    statusTag: 'SYSTEM_STATUS: OVERRIDE',
    headlinePart1: 'CTRL',
    headlinePart2: 'C',
    headlinePart3: 'IS THE NEW END.',
    subText: 'A cyber-brutalist descent into the architecture of consciousness. In a world of digital replication, the original is the most dangerous artifact.',
    bgImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvvubOhSTNL-h9xGJV8hUOlWbrtfdvbyRbb8DFJ8YtRhRg4WnLpyYywsHTWkwsd-2gCyoTFI1oGDsnHtzo3df1ps-FAcpiiQENI4oJ7oYpozEtQXgkjSYM7QIqzD9AdZ3L7sCh9oaBc0wBdHLbk5eHM2ocRW-uRLgu-egHwxmM93l-SPio8VUFf7SA9jwNaNeSIbaOvosVp8bRexKFZil8qgzss15e92gch-4tnhp7mqotJEOpdKW-dAA',
    button1Text: 'MUA NGAY',
    button2Text: 'CHAPTER_01',
  },

  preview: {
    title: 'THE PREVIEW',
    p1: 'The screen flickered. Not the usual static of a failing terminal, but something rhythmic. Hex codes bled across the retina-scan interface like digital ink. "Access Denied" was a lie; the system wasn\'t locking me out—it was inviting me in.',
    p2: 'I pressed Ctrl+C. The command didn\'t stop the process. It duplicated the universe. In the reflection of the black monitor, I saw my shadow detach and walk away. That was the moment I realized reality was just a temporary file awaiting deletion.',
    fullChapterTitle: 'CHƯƠNG 01: BẢN SAO ĐẦU TIÊN (THE FIRST COPY)',
    fullChapterText: `1. MẶT HỒ KỸ THUẬT SỐ

Màn hình nhấp nháy. Không phải loại nhiễu sóng thông thường của một máy trạm hỏng hóc, mà là một nhịp điệu có quy luật. Những dòng mã hex chảy tràn qua giao diện quét võng mạc như mực kỹ thuật số. "Access Denied" chỉ là một lời nói dối; hệ thống không khóa tôi ở ngoài — nó đang mời tôi vào.

Tôi đặt đầu ngón tay lên bàn phím cơ. Tiếng lạch cạch vang lên trong căn phòng tối om, nơi ánh sáng duy nhất phát ra từ dãy đèn LED cảm biến của bộ vi xử lý sinh học. 

Tôi nhấn phím tổ hợp: Ctrl + C.

Lệnh đó không dừng tiến trình. Nó nhân bản vũ trụ.

Trong bản phản chiếu của màn hình màu đen, tôi nhìn thấy bóng của mình tách ra khỏi cơ thể và bước đi. Đó là khoảnh khắc tôi nhận ra thực tại chỉ là một tệp tạm thời đang chờ bị xóa.

2. CẤU TRÚC CỦA Ý THỨC

"Cậu có biết sự khác biệt giữa bản gốc và bản sao là gì không?" - Giọng của V.S. vang lên qua chiếc tai nghe cấy ghép.

"Bản gốc có linh hồn?" tôi hỏi, mắt không rời khỏi những dòng lệnh đang tự viết trên màn hình.

"Không," V.S. cười nhẹ. "Bản gốc là kẻ duy nhất có quyền nhấn lệnh Xóa. Tất cả chúng ta chỉ là những tệp đúp được lưu trong bộ nhớ tạm của một thực thể cao hơn."

Những bức tường phòng lab bắt đầu biến đổi, lộ ra cấu trúc khung xương kim loại và những dải cáp quang phát sáng vàng kim. Đây không phải là Hà Nội năm 2024. Đây là lõi dữ liệu của dự án ARCHIVE - nơi ký ức của loài người được nén lại thành những đoạn mã tối ưu.

3. LỜI LỆNH OVERRIDE

Nếu bạn đang đọc những dòng này, có nghĩa là bản in vật lý của cuốn sách đã đến tay bạn. Nhưng hãy cẩn thận với trang 194. Đừng lật nó nếu bạn chưa sẵn sàng đối mặt với bản sao của chính mình đang đứng ngay sau lưng.`,
    readButtonText: 'Đọc thử',
  },

  author: {
    title: 'THE ARCHITECT',
    name: 'V.S. ARCHIVE',
    tag: 'AUTHOR_ID: V.S. ARCHIVE',
    bio: 'V.S. Archive is a ghost in the machine of contemporary fiction. Specializing in techno-philosophical thrillers that blur the line between user and interface, Archive\'s work has been called "the manual for our inevitable simulation."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC27zJOFA5pjQdQ1gCy2hAGdnJLyRoSeYNuBVt7GPdFoyIj8QG7dAkJh7z5RDZX4kF1ZiLjX2sOUcsOEey0Eq-Xm9aXdmko0JNdM0U6afWGa4Nir6esMdLkL75R-xwG7e2J4ufvCVP57oxtoJrhNB8g5GVqdo-g6zOVo0M5iwR7gPztGaB_PPcsoYlxUEvZu9m1O-gxg0x3TsSrmXirVflEfiX6znX0eJZ_zk9WWN2Q4HrV7CGiPDrWd8E6_z7pBUz3RkLlN7vJQNo',
  },

  press: {
    sectionTitle: 'BÁO CHÍ NÓI GÌ',
    quotes: [
      {
        id: '1',
        quote: 'Một kiệt tác của chủ nghĩa hư vô kỹ thuật số, thách thức mọi giới hạn của thể loại cyberpunk hiện đại.',
        source: 'THE WIRED CIRCUIT',
      },
      {
        id: '2',
        quote: 'Sự giao thoa hoàn hảo giữa The Matrix và phong cách tối giản Thụy Sĩ. Một trải nghiệm thị giác và trí tuệ bùng nổ.',
        source: 'NEO-CRITIC',
      },
      {
        id: '3',
        quote: 'CTRL C không chỉ là một cuốn sách, nó là một bản tuyên ngôn về thực tại trong kỷ nguyên số hóa toàn cầu.',
        source: 'CODE REVIEWS',
      },
    ],
  },

  ticker: {
    enabled: true,
    messages: [
      '"A MASTERPIECE OF DIGITAL NIHILISM" - THE WIRED CIRCUIT',
      '"THE MATRIX MEETS SWISS MINIMALISM" - NEO-CRITIC',
      '"CTRL C REDEFINES THE GENRE" - CODE REVIEWS',
      '"KIỆT TÁC VIỄN TƯỞNG CYBER-BRUTALIST ĐẦU TIÊN" - TIỂU THUYẾT VIỆT',
    ],
  },

  rewards: {
    sectionTitle: 'SYSTEM REWARDS',
    items: [
      {
        id: '1',
        icon: 'key',
        title: 'ACCESS KEYS',
        desc: 'Exclusive digital wallpapers and conceptual art for your OS.',
      },
      {
        id: '2',
        icon: 'terminal',
        title: 'THE SCRIPT',
        desc: 'Signed physical prints of the original manuscript\'s code-base.',
      },
      {
        id: '3',
        icon: 'token',
        title: 'VOID TOKEN',
        desc: 'Membership to the CTRL C inner-circle community archive.',
      },
    ],
  },

  checkout: {
    sectionTitle: 'BẢNG GIÁ & ĐẶT HÀNG',
    timerMinutes: 60,
    defaultPackageId: 'hardcopy',
  },

  logistics: {
    sectionTitle: 'SYSTEM LOGISTICS',
    items: [
      { id: '1', icon: 'terminal', title: 'PROCESSING', cmd: 'CMD: PROCESS_ORDER' },
      { id: '2', icon: 'local_shipping', title: 'SHIPPING', cmd: 'CMD: DISPATCH_PACKET' },
      { id: '3', icon: 'lock', title: 'DELIVERY', cmd: 'CMD: GRANT_ACCESS' },
      { id: '4', icon: 'rotate_left', title: 'RETURNS', cmd: 'CMD: SYSTEM_RESTORE' },
    ],
  },

  gallery: {
    sectionTitle: 'ARCHIVE_VISUALS',
    images: [
      {
        id: '1',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALb4X-gCLBJiew7UAWWpL7dKVOfYYi9pMyHyag6ATeAX6e7OBHiS3yJQr828HL8-i6Lx48QsVMrsXEPFmHBgqpaqVaI_CV0ZC51H_rpubipRaSu_WQIHx2oi5-QpbkJOQ7UuJnGpv_rDIG9Pyg9oDj6h_N6ob2-TfH-fClLoNbw6G5iBY4ol7ddcF3zBhBgDijmykfSrOpsCtWu1tvra1E-gjSn6DpXF9ACkb0F5OvJLAWeESnqYjvJgwT-4g2cR09Lmlh4qXhpnE',
        alt: 'Archive Main Frame',
        location: 'LOCATION: MAIN_FRAME',
      },
      {
        id: '2',
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLvvubOhSTNL-h9xGJV8hUOlWbrtfdvbyRbb8DFJ8YtRhRg4WnLpyYywsHTWkwsd-2gCyoTFI1oGDsnHtzo3df1ps-FAcpiiQENI4oJ7oYpozEtQXgkjSYM7QIqzD9AdZ3L7sCh9oaBc0wBdHLbk5eHM2ocRW-uRLgu-egHwxmM93l-SPio8VUFf7SA9jwNaNeSIbaOvosVp8bRexKFZil8qgzss15e92gch-4tnhp7mqotJEOpdKW-dAA',
        alt: 'Archive Cover Details',
      },
      {
        id: '3',
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLslzT8Pt8S_-X1oyHBvXFZnjPY7Xv6I_OoRHy6IJoNW7JkWsD04TQorVp7svbP4wmWPlOmVfwlwENef9qcAhxxQ3T8YJrsZlQj-NN7HGlNEN4lz-I0VE_O1kqGIY0OnBc02l2KRKNhBgZiiSiW02IR85snzhZFqdLfr3Dht35agoXrDFvGCtiAyQ_lXMqBrXoozmTqLs5vp0D343fodk4WtXpbgtzcn-Zk2wHD7ScJGhAyp_mmNp2aAShk',
        alt: 'Archive Book Mockup',
      },
      {
        id: '4',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWYaIRV4RU9xHo0CYDO4IMKatCzQrNSEpUtHkLav3V3SxtaoFYMaF9PRScQHoTnlzVWaSfq4Yd4KgzqaYzu4ShJHlYloZg8MUL_VseqyqNhrwIA1tJgT__t8tes-gUlLUeSTFFfEgJaVpKgpQv4riMde1oz5sTuWgNZ_8DwWkUYXPdXWAOh64Kt3I4eY0ANGjkTmvA_szXM4AYXiL8mEUTSt3qIEltRHxywqxx4uo5MWU4_GhaWw0heeNGyXh51AgMV2h2H8Cazpg',
        alt: 'Archive Worldbuilding Illustration',
      },
    ],
  },

  reviews: {
    sectionTitle: 'USER_FEEDBACK',
    items: [
      {
        id: '1',
        name: 'Kaelen Vance',
        role: 'Cyber-Security Analyst',
        rating: 5,
        comment: 'Giao diện của thực tại bị bẻ gãy hoàn toàn. Đọc xong cảm giác như vừa được nạp một bản vá lỗi cho nhận thức.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf9UvG7Z4vPjL8-wHlO-qV8S9j6T2rE2K-K6pP2N1mXvJ3R6S4m2C1=s64',
      },
      {
        id: '2',
        name: 'Maya Sterling',
        role: 'Sci-Fi Enthusiast',
        rating: 5,
        comment: 'Không chỉ là một cuốn sách, đây là một trải nghiệm đa giác quan. Hình ảnh và nội dung hòa quyện cực kỳ ám ảnh.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9E46ASJzWgqjuEw1t6CSDTLRMQMlQMdSvstKkE2s22uJvYuevXJnLfucYYU9V05sM_7pItsMZZTA-jZfKQMHeo49LjABMCC-TH2GWGrBGuzzUuOt4YseCjYMIcKUZRpmkXiQSFVHduVRuf92zcv5ecUfQVgY4tCmSIgAUYtoDVQjXF6nSob_v2pEeszb6i4RXWSNKLlugBP5UjO0dGG0F9ZfeId10HWf-j7Sa_QuhJdRn1HP4vdQZyImdsBHZAtlMEcCdGd6RFOc=s64',
      },
      {
        id: '3',
        name: 'Soren Archive',
        role: 'System Architect',
        rating: 4.5,
        comment: 'Triết học techno sâu sắc. Cốt truyện hack não khiến tôi phải đọc lại lần thứ hai để thực sự thấu hiểu.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC27zJOFA5pjQdQ1gCy2hAGdnJLyRoSeYNuBVt7GPdFoyIj8QG7dAkJh7z5RDZX4kF1ZiLjX2sOUcsOEey0Eq-Xm9aXdmko0JNdM0U6afWGa4Nir6esMdLkL75R-xwG7e2J4ufvCVP57oxtoJrhNB8g5GVqdo-g6zOVo0M5iwR7gPztGaB_PPcsoYlxUEvZu9m1O-gxg0x3TsSrmXirVflEfiX6znX0eJZ_zk9WWN2Q4HrV7CGiPDrWd8E6_z7pBUz3RkLlN7vJQNo=s64',
      },
      {
        id: '4',
        name: 'Elias Thorne',
        role: 'Digital Ethicist',
        rating: 5,
        comment: 'Một tuyệt phẩm Brutalist. Cảm ơn V.S. Archive đã mang đến một góc nhìn mới về kỷ nguyên số hóa.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_64X5A6I_8Vv-6r7e_S9y9p7N-m2X0C2T=s64',
      },
    ],
  },

  footer: {
    publicationId: 'PUBLICATION_ID: #CTRLC-2024-X',
    isbn: 'ISBN: 978-604-987-654-3',
    publisher: 'PUBLISHER: vh - Literature Publishing House',
    copyright: '© 2024 CTRL C. ALL RIGHTS OVERRIDDEN.',
    fahasaUrl: 'https://fahasa.com',
    tikiUrl: 'https://tiki.vn',
    shopeeUrl: 'https://shopee.vn',
    socialLinks: [
      { id: '1', label: 'OFFICIAL_WEB', url: '#', icon: 'link' },
      { id: '2', label: 'FACEBOOK', url: '#', icon: 'public' },
      { id: '3', label: 'INSTAGRAM', url: '#', icon: 'camera' },
      { id: '4', label: 'X_PLATFORM', url: '#', icon: 'close' },
    ],
  },

  googleSheetWebhookUrl: '',
  sectionOrder: [
    'hero',
    'preview',
    'author',
    'press',
    'ticker',
    'rewards',
    'checkout',
    'logistics',
    'gallery',
    'reviews',
    'footer',
  ],
  enabledSections: {
    hero: true,
    preview: true,
    author: true,
    press: true,
    ticker: true,
    rewards: true,
    checkout: true,
    logistics: true,
    gallery: true,
    reviews: true,
    footer: true,
  },
};

export const defaultPackages: PackageTier[] = [
  {
    id: 'hardcopy',
    name: 'HARD_COPY (Bản In Giới Hạn)',
    price: 34,
    badge: 'RECOMMENDED',
    recommended: true,
    features: [
      'PREMIUM HARDCOVER (Bìa cứng dập nổi)',
      'SIGNED AUTHOR PLATE (Kèm chữ ký tác giả)',
      'ALL DIGITAL REWARDS (Toàn bộ quà tặng số)',
      'LIMITED EDITION DUST JACKET & BOOKMARK',
    ],
  },
  {
    id: 'digital',
    name: 'DIGITAL_ACCESS (Bản Điện Tử)',
    price: 18,
    features: [
      'EPUB & PDF HIGH RES',
      'EXCLUSIVE DIGITAL WALLPAPERS',
      'CTRL C DISCORD COMMUNITY ACCESS',
    ],
  },
  {
    id: 'collector',
    name: 'COLLECTOR_BOX (Hộp Sưu Tầm)',
    price: 68,
    badge: 'ULTIMATE',
    features: [
      'ALL HARD_COPY INCLUSIONS',
      'PHYSICAL MANUSCRIPT CODE PRINTS',
      'CYBER BRUTALIST METAL VOID TOKEN',
      'SPECIAL CREDIT IN CHAPTER 0',
    ],
  },
];
