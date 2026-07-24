import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { defaultConfig, defaultPackages } from './src/data/defaultConfig';
import { AppConfig, Order, PackageTier } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Persistent storage setup
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PACKAGES_FILE = path.join(DATA_DIR, 'packages.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load or initialize config
let appConfig: AppConfig = defaultConfig;
if (fs.existsSync(CONFIG_FILE)) {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    appConfig = { ...defaultConfig, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading config file, using default', e);
  }
} else {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(appConfig, null, 2));
}

// Load or initialize packages
let packages: PackageTier[] = defaultPackages;
if (fs.existsSync(PACKAGES_FILE)) {
  try {
    const raw = fs.readFileSync(PACKAGES_FILE, 'utf-8');
    packages = JSON.parse(raw);
  } catch (e) {
    console.error('Error reading packages file, using default', e);
  }
} else {
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
}

// Load or initialize orders
let orders: Order[] = [
  {
    id: 'ORD-9821',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    name: 'Nguyễn Văn An',
    email: 'nguyenan@gmail.com',
    phone: '0901234567',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    packageId: 'hardcopy',
    packageName: 'HARD_COPY (Bản In Giới Hạn)',
    price: 34,
    quantity: 1,
    totalAmount: 34,
    note: 'Giao giờ hành chính',
    status: 'confirmed',
    syncedToSheet: true,
    syncedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ORD-9822',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    name: 'Trần Thị Bích',
    email: 'bich.tran@hotmail.com',
    phone: '0988776655',
    address: '456 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    packageId: 'collector',
    packageName: 'COLLECTOR_BOX (Hộp Sưu Tầm)',
    price: 68,
    quantity: 1,
    totalAmount: 68,
    note: 'Cần bọc quà đẹp',
    status: 'pending',
    syncedToSheet: false,
  }
];

if (fs.existsSync(ORDERS_FILE)) {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    orders = JSON.parse(raw);
  } catch (e) {
    console.error('Error reading orders file', e);
  }
} else {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function saveConfig() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(appConfig, null, 2));

    // Persist directly into src/data/defaultConfig.ts code file
    const defaultConfigPath = path.join(process.cwd(), 'src', 'data', 'defaultConfig.ts');
    if (fs.existsSync(defaultConfigPath)) {
      const fileContent = `import { AppConfig, PackageTier } from '../types';\n\nexport const defaultConfig: AppConfig = ${JSON.stringify(appConfig, null, 2)};\n\nexport const defaultPackages: PackageTier[] = ${JSON.stringify(packages, null, 2)};\n`;
      fs.writeFileSync(defaultConfigPath, fileContent, 'utf-8');
    }
  } catch (err) {
    console.error('Error writing config file:', err);
  }
}

function savePackages() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
  } catch (err) {
    console.error('Error writing packages file:', err);
  }
}

function saveOrders() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

// Helper to trigger Google Sheet Webhook sync
async function syncToGoogleSheet(order: Order, webhookUrl: string) {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: order.id,
        created_at: order.createdAt,
        customer_name: order.name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        package_name: order.packageName,
        price: order.price,
        quantity: order.quantity,
        total_amount: order.totalAmount,
        status: order.status,
        note: order.note || '',
      }),
    });
    return response.ok;
  } catch (err) {
    console.error('Failed to sync order to Google Sheet webhook:', err);
    return false;
  }
}

// API Routes
app.get('/api/config', (req, res) => {
  res.json({
    config: appConfig,
    packages,
  });
});

app.post('/api/config', (req, res) => {
  const { newConfig, newPackages, adminEmail } = req.body;
  const targetEmail = (adminEmail || '').toString().toLowerCase().trim();

  if (targetEmail !== 'dinhanh1994@gmail.com') {
    return res.status(403).json({ error: 'Access denied. Only dinhanh1994@gmail.com can edit configuration.' });
  }

  try {
    if (newConfig) {
      appConfig = { ...appConfig, ...newConfig };
      saveConfig();
    }
    if (newPackages && Array.isArray(newPackages)) {
      packages = newPackages;
      savePackages();
    }

    return res.json({ success: true, config: appConfig, packages });
  } catch (err: any) {
    console.error('Failed to update config:', err);
    return res.status(500).json({ error: 'Internal server error saving configuration.' });
  }
});

app.post('/api/config/reset', (req, res) => {
  const { adminEmail } = req.body;
  if (!adminEmail || adminEmail.toLowerCase() !== 'dinhanh1994@gmail.com') {
    return res.status(403).json({ error: 'Access denied.' });
  }
  appConfig = defaultConfig;
  packages = defaultPackages;
  saveConfig();
  savePackages();
  res.json({ success: true, config: appConfig, packages });
});

app.get('/api/orders', (req, res) => {
  const adminEmail = req.query.adminEmail as string;
  if (!adminEmail || adminEmail.toLowerCase() !== 'dinhanh1994@gmail.com') {
    return res.status(403).json({ error: 'Access denied. Only dinhanh1994@gmail.com can view orders.' });
  }
  res.json({ orders });
});

app.post('/api/orders', async (req, res) => {
  const { name, email, phone, address, packageId, quantity, note } = req.body;

  if (!name || !email || !phone || !address || !packageId) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const selectedPkg = packages.find((p) => p.id === packageId) || packages[0];
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const total = selectedPkg.price * qty;

  const newOrder: Order = {
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
    totalAmount: total,
    note: note || '',
    status: 'pending',
    syncedToSheet: false,
  };

  // Check if Google Sheet Webhook URL is configured
  if (appConfig.googleSheetWebhookUrl) {
    const success = await syncToGoogleSheet(newOrder, appConfig.googleSheetWebhookUrl);
    if (success) {
      newOrder.syncedToSheet = true;
      newOrder.syncedAt = new Date().toISOString();
    }
  }

  orders.unshift(newOrder);
  saveOrders();

  res.status(201).json({ success: true, order: newOrder });
});

app.put('/api/orders/:id', (req, res) => {
  const { adminEmail, status } = req.body;
  if (!adminEmail || adminEmail.toLowerCase() !== 'dinhanh1994@gmail.com') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const orderIndex = orders.findIndex((o) => o.id === req.params.id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  orders[orderIndex].status = status;
  saveOrders();
  res.json({ success: true, order: orders[orderIndex] });
});

app.delete('/api/orders/:id', (req, res) => {
  const adminEmail = req.query.adminEmail as string;
  if (!adminEmail || adminEmail.toLowerCase() !== 'dinhanh1994@gmail.com') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  orders = orders.filter((o) => o.id !== req.params.id);
  saveOrders();
  res.json({ success: true });
});

app.post('/api/sheets/test', async (req, res) => {
  const { webhookUrl, adminEmail } = req.body;
  if (!adminEmail || adminEmail.toLowerCase() !== 'dinhanh1994@gmail.com') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  if (!webhookUrl) {
    return res.status(400).json({ error: 'Please provide a valid Google Sheet Webhook URL.' });
  }

  const dummyOrder: Order = {
    id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    name: 'Tài Khoản Test',
    email: 'test@example.com',
    phone: '0900000000',
    address: 'Hệ thống kiểm tra kết nối',
    packageId: 'hardcopy',
    packageName: 'HARD_COPY (Test)',
    price: 34,
    quantity: 1,
    totalAmount: 34,
    note: 'Kiểm tra kết nối Google Sheets thành công!',
    status: 'pending',
  };

  const ok = await syncToGoogleSheet(dummyOrder, webhookUrl);
  if (ok) {
    return res.json({ success: true, message: 'Kết nối thành công! Dữ liệu đã gửi đến Google Sheet.' });
  } else {
    return res.status(500).json({ error: 'Không thể kết nối đến Webhook URL. Hãy kiểm tra URL Google Apps Script.' });
  }
});

// Secure Admin Authentication handler
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const targetEmail = (email || '').toLowerCase().trim();
  const targetPassword = (password || '').trim();

  // Read credentials from environment variables, fallback to defaults if not provided
  const EXPECTED_EMAIL = (process.env.ADMIN_EMAIL || 'dinhanh1994@gmail.com').toLowerCase().trim();
  const EXPECTED_PASS = (process.env.ADMIN_PASSWORD || 'Dna13111994@ctrlc').trim();

  if (targetEmail === EXPECTED_EMAIL && targetPassword === EXPECTED_PASS) {
    return res.json({
      success: true,
      user: {
        email: EXPECTED_EMAIL,
        name: 'Định Anh (Admin)',
        picture:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC27zJOFA5pjQdQ1gCy2hAGdnJLyRoSeYNuBVt7GPdFoyIj8QG7dAkJh7z5RDZX4kF1ZiLjX2sOUcsOEey0Eq-Xm9aXdmko0JNdM0U6afWGa4Nir6esMdLkL75R-xwG7e2J4ufvCVP57oxtoJrhNB8g5GVqdo-g6zOVo0M5iwR7gPztGaB_PPcsoYlxUEvZu9m1O-gxg0x3TsSrmXirVflEfiX6znX0eJZ_zk9WWN2Q4HrV7CGiPDrWd8E6_z7pBUz3RkLlN7vJQNo=s64',
        isAdmin: true,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.',
    });
  }
});

// Vite or Static Production middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
