/**
 * RPS Fields Backend — Zero external dependency Node.js server
 * Uses only built-in Node modules: http, crypto, fs, path, url
 *
 * Features:
 *  - JWT-style auth (HMAC-SHA256 tokens)
 *  - User registration (customer + farmer)
 *  - Login
 *  - Product CRUD (farmers can add/edit/delete own products)
 *  - Cart & Orders (checkout)
 *  - In-memory data store (persists while server runs)
 *  - Full CORS support
 *  - Runs on port 4000
 */

const http = require("http");
const crypto = require("crypto");
const url = require("url");

const PORT = 4000;
const JWT_SECRET = "rps_fields_secret_key_2025";

// ─── In-memory database ───────────────────────────────────────────────────────
const DB = {
  users: [],      // { id, username, fullName, email, phone, password(hashed), role, address, city, createdAt }
  products: [],   // { id, farmerId, farmerName, farmerLocation, name, category, price, qty, description, img, createdAt }
  orders: [],     // { id, userId, items, total, status, address, createdAt }
};

// ─── Seed some initial products from farmers ──────────────────────────────────
const SEED_FARMER_ID = "farmer_seed_001";
DB.users.push({
  id: SEED_FARMER_ID,
  username: "ravikumar",
  fullName: "Ravi Kumar",
  email: "ravi@farm.in",
  phone: "9876543210",
  password: hashPassword("farm1234"),
  role: "farmer",
  address: "Village Sinhagad, Pune",
  city: "Pune",
  createdAt: new Date().toISOString(),
});

const SEED_PRODUCTS = [
  { name: "Fresh Tomatoes", category: "Vegetables", price: 45, qty: 120, description: "Farm-fresh tomatoes harvested daily. Rich in lycopene and natural sugars, perfect for salads and curries.", img: "https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400&q=80" },
  { name: "Alphonso Mangoes", category: "Fruits", price: 380, qty: 50, description: "Premium Alphonso mangoes directly from orchards. Naturally ripened, zero chemicals.", img: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80" },
  { name: "Basmati Rice", category: "Grains", price: 95, qty: 500, description: "Aged basmati rice with long grains and aromatic fragrance. Traditional Punjab farming methods.", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80" },
  { name: "Baby Spinach", category: "Vegetables", price: 28, qty: 90, description: "Tender baby spinach leaves rich in iron and vitamins. Pesticide-free, organic certified.", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80" },
  { name: "Strawberries", category: "Fruits", price: 180, qty: 40, description: "Plump juicy strawberries. Naturally sweet with no artificial flavors.", img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80" },
  { name: "Whole Wheat Flour", category: "Grains", price: 42, qty: 400, description: "Stone-ground whole wheat flour from heritage varieties. Nutritious and natural.", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80" },
];

SEED_PRODUCTS.forEach((p, i) => {
  DB.products.push({
    id: `prod_seed_${i + 1}`,
    farmerId: SEED_FARMER_ID,
    farmerName: "Ravi Kumar",
    farmerLocation: "Pune, MH",
    ...p,
    createdAt: new Date().toISOString(),
  });
});

const SEED_FARMER2_ID = "farmer_seed_002";
DB.users.push({
  id: SEED_FARMER2_ID,
  username: "abdulkhan",
  fullName: "Abdul Khan",
  email: "abdul@farm.in",
  phone: "9123456780",
  password: hashPassword("farm1234"),
  role: "farmer",
  address: "Srinagar Valley",
  city: "Srinagar",
  createdAt: new Date().toISOString(),
});
DB.products.push(
  { id: "prod_seed_7", farmerId: SEED_FARMER2_ID, farmerName: "Abdul Khan", farmerLocation: "Kashmir, JK", name: "Premium Almonds", category: "Dry Fruits", price: 720, qty: 80, description: "Hand-picked Kashmiri almonds. Sun-dried and vacuum packed for freshness.", img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80", createdAt: new Date().toISOString() },
  { id: "prod_seed_8", farmerId: SEED_FARMER2_ID, farmerName: "Abdul Khan", farmerLocation: "Kashmir, JK", name: "Kashmiri Walnuts", category: "Dry Fruits", price: 850, qty: 60, description: "Fresh walnuts rich in omega-3. Direct from walnut orchards.", img: "https://images.unsplash.com/photo-1605725639823-9e4f4e3c0591?w=400&q=80", createdAt: new Date().toISOString() },
  { id: "prod_seed_9", farmerId: SEED_FARMER2_ID, farmerName: "Meena Devi", farmerLocation: "Anand, GJ", name: "Organic Milk", category: "Dairy", price: 62, qty: 200, description: "Pure A2 cow milk from grass-fed desi cows. Collected fresh every morning.", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80", createdAt: new Date().toISOString() }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId() {
  return crypto.randomBytes(10).toString("hex");
}

function hashPassword(pw) {
  return crypto.createHmac("sha256", JWT_SECRET).update(pw).digest("hex");
}

function checkPassword(pw, hash) {
  return hashPassword(pw) === hash;
}

function createToken(payload) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const sig = b64url(crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

function verifyToken(token) {
  try {
    const [header, body, sig] = token.split(".");
    const expected = b64url(crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest());
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

function b64url(data) {
  if (typeof data === "string") return Buffer.from(data).toString("base64url");
  return data.toString("base64url");
}

function getAuthUser(req) {
  const auth = req.headers["authorization"] || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  return verifyToken(token);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(body);
}

function ok(res, data) { send(res, 200, { success: true, ...data }); }
function created(res, data) { send(res, 201, { success: true, ...data }); }
function err(res, status, message) { send(res, status, { success: false, error: message }); }

// ─── Router ───────────────────────────────────────────────────────────────────
const routes = [];
function route(method, path, handler) {
  routes.push({ method, path, handler });
}
function matchRoute(method, pathname) {
  for (const r of routes) {
    if (r.method !== method && r.method !== "ANY") continue;
    const rParts = r.path.split("/");
    const pParts = pathname.split("/");
    if (rParts.length !== pParts.length) continue;
    const params = {};
    let match = true;
    for (let i = 0; i < rParts.length; i++) {
      if (rParts[i].startsWith(":")) { params[rParts[i].slice(1)] = pParts[i]; }
      else if (rParts[i] !== pParts[i]) { match = false; break; }
    }
    if (match) return { handler: r.handler, params };
  }
  return null;
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Health check
route("GET", "/api/health", (req, res) => ok(res, { message: "RPS Fields API running 🌿", time: new Date().toISOString() }));

// ── Auth ──────────────────────────────────────────────────────────────────────
route("POST", "/api/auth/register", async (req, res, params) => {
  const body = await readBody(req);
  const { username, fullName, email, phone, password, confirmPassword, address, city, role } = body;

  if (!username || username.length < 6) return err(res, 400, "Username must be at least 6 characters");
  if (!fullName) return err(res, 400, "Full name is required");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(res, 400, "Valid email required");
  if (!phone || !/^\d{10}$/.test(phone)) return err(res, 400, "Phone must be 10 digits");
  if (!password || password.length < 6) return err(res, 400, "Password must be at least 6 characters");
  if (password !== confirmPassword) return err(res, 400, "Passwords do not match");
  if (!address) return err(res, 400, "Address is required");
  if (!city) return err(res, 400, "City is required");
  if (!["customer", "farmer"].includes(role)) return err(res, 400, "Role must be customer or farmer");

  if (DB.users.find((u) => u.email === email)) return err(res, 409, "Email already registered");
  if (DB.users.find((u) => u.username === username)) return err(res, 409, "Username already taken");

  const user = {
    id: genId(),
    username, fullName, email, phone,
    password: hashPassword(password),
    role: role || "customer",
    address, city,
    createdAt: new Date().toISOString(),
  };
  DB.users.push(user);

  const token = createToken({ id: user.id, role: user.role, email: user.email });
  const { password: _, ...safeUser } = user;
  created(res, { token, user: safeUser });
});

route("POST", "/api/auth/login", async (req, res) => {
  const { email, password } = await readBody(req);
  if (!email || !password) return err(res, 400, "Email and password required");

  const user = DB.users.find((u) => u.email === email);
  if (!user || !checkPassword(password, user.password)) return err(res, 401, "Invalid email or password");

  const token = createToken({ id: user.id, role: user.role, email: user.email });
  const { password: _, ...safeUser } = user;
  ok(res, { token, user: safeUser });
});

route("GET", "/api/auth/me", (req, res) => {
  const payload = getAuthUser(req);
  if (!payload) return err(res, 401, "Unauthorized");
  const user = DB.users.find((u) => u.id === payload.id);
  if (!user) return err(res, 404, "User not found");
  const { password: _, ...safeUser } = user;
  ok(res, { user: safeUser });
});

// ── Products ──────────────────────────────────────────────────────────────────
route("GET", "/api/products", (req, res) => {
  const { query } = url.parse(req.url, true);
  let products = [...DB.products];
  if (query.category) products = products.filter((p) => p.category === query.category);
  if (query.search) {
    const s = query.search.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(s) || p.farmerName.toLowerCase().includes(s));
  }
  if (query.farmerId) products = products.filter((p) => p.farmerId === query.farmerId);
  ok(res, { products });
});

route("GET", "/api/products/:id", (req, res, params) => {
  const product = DB.products.find((p) => p.id === params.id);
  if (!product) return err(res, 404, "Product not found");
  ok(res, { product });
});

route("POST", "/api/products", async (req, res) => {
  const payload = getAuthUser(req);
  if (!payload) return err(res, 401, "Unauthorized");
  if (payload.role !== "farmer") return err(res, 403, "Only farmers can add products");

  const farmer = DB.users.find((u) => u.id === payload.id);
  if (!farmer) return err(res, 404, "Farmer not found");

  const { name, category, price, qty, description, img } = await readBody(req);
  if (!name) return err(res, 400, "Product name is required");
  if (!category) return err(res, 400, "Category is required");
  if (!price || isNaN(price) || price <= 0) return err(res, 400, "Valid price is required");
  if (!qty || isNaN(qty) || qty <= 0) return err(res, 400, "Valid quantity is required");
  if (!description) return err(res, 400, "Description is required");

  const product = {
    id: genId(),
    farmerId: farmer.id,
    farmerName: farmer.fullName,
    farmerLocation: `${farmer.city}`,
    name, category,
    price: parseFloat(price),
    qty: parseInt(qty),
    description,
    img: img || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
    createdAt: new Date().toISOString(),
  };
  DB.products.push(product);
  created(res, { product });
});

route("PUT", "/api/products/:id", async (req, res, params) => {
  const payload = getAuthUser(req);
  if (!payload) return err(res, 401, "Unauthorized");

  const product = DB.products.find((p) => p.id === params.id);
  if (!product) return err(res, 404, "Product not found");
  if (product.farmerId !== payload.id) return err(res, 403, "You can only edit your own products");

  const updates = await readBody(req);
  const allowed = ["name", "category", "price", "qty", "description", "img"];
  allowed.forEach((k) => {
    if (updates[k] !== undefined) product[k] = updates[k];
  });
  product.updatedAt = new Date().toISOString();
  ok(res, { product });
});

route("DELETE", "/api/products/:id", async (req, res, params) => {
  const payload = getAuthUser(req);
  if (!payload) return err(res, 401, "Unauthorized");

  const idx = DB.products.findIndex((p) => p.id === params.id);
  if (idx === -1) return err(res, 404, "Product not found");
  if (DB.products[idx].farmerId !== payload.id) return err(res, 403, "You can only delete your own products");

  DB.products.splice(idx, 1);
  ok(res, { message: "Product deleted" });
});

// ── Orders ────────────────────────────────────────────────────────────────────
route("POST", "/api/orders", async (req, res) => {
  const payload = getAuthUser(req);
  if (!payload) return err(res, 401, "Unauthorized — please login to checkout");

  const { items, address, city, phone } = await readBody(req);
  if (!items || !Array.isArray(items) || items.length === 0) return err(res, 400, "Cart is empty");
  if (!address) return err(res, 400, "Delivery address is required");
  if (!city) return err(res, 400, "City is required");
  if (!phone || !/^\d{10}$/.test(phone)) return err(res, 400, "Valid 10-digit phone required");

  // Validate products exist and update stock
  const orderItems = [];
  for (const item of items) {
    const product = DB.products.find((p) => p.id === item.id);
    if (!product) return err(res, 404, `Product ${item.name || item.id} not found`);
    if (product.qty < item.qty) return err(res, 400, `Only ${product.qty}kg of ${product.name} available`);
    product.qty -= item.qty; // Deduct stock
    orderItems.push({ ...item, productId: product.id, farmerName: product.farmerName });
  }

  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id: `ORD-${genId().toUpperCase().slice(0, 8)}`,
    userId: payload.id,
    items: orderItems,
    total,
    address, city, phone,
    status: "confirmed",
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  DB.orders.push(order);
  created(res, { order });
});

route("GET", "/api/orders", (req, res) => {
  const payload = getAuthUser(req);
  if (!payload) return err(res, 401, "Unauthorized");
  const userOrders = DB.orders.filter((o) => o.userId === payload.id);
  ok(res, { orders: userOrders });
});

route("GET", "/api/orders/:id", (req, res, params) => {
  const payload = getAuthUser(req);
  if (!payload) return err(res, 401, "Unauthorized");
  const order = DB.orders.find((o) => o.id === params.id);
  if (!order) return err(res, 404, "Order not found");
  if (order.userId !== payload.id) return err(res, 403, "Not your order");
  ok(res, { order });
});

// Farmer: view orders for their products
route("GET", "/api/farmer/orders", (req, res) => {
  const payload = getAuthUser(req);
  if (!payload || payload.role !== "farmer") return err(res, 403, "Farmers only");
  const myProductIds = DB.products.filter((p) => p.farmerId === payload.id).map((p) => p.id);
  const relevant = DB.orders
    .map((o) => ({
      ...o,
      items: o.items.filter((i) => myProductIds.includes(i.productId || i.id)),
    }))
    .filter((o) => o.items.length > 0);
  ok(res, { orders: relevant });
});

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    });
    return res.end();
  }

  const matched = matchRoute(req.method, pathname);
  if (!matched) return err(res, 404, `Route ${req.method} ${pathname} not found`);

  try {
    await matched.handler(req, res, matched.params || {});
  } catch (e) {
    console.error("Handler error:", e.message);
    err(res, 500, "Internal server error: " + e.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n🌿 RPS Fields API running at http://localhost:${PORT}`);
  console.log(`   GET    /api/health`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/products`);
  console.log(`   POST   /api/products       (farmer)`);
  console.log(`   PUT    /api/products/:id   (farmer)`);
  console.log(`   DELETE /api/products/:id   (farmer)`);
  console.log(`   POST   /api/orders         (checkout)`);
  console.log(`   GET    /api/orders         (my orders)`);
  console.log(`   GET    /api/farmer/orders  (farmer view)`);
  console.log(`\n   Demo farmer: ravi@farm.in / farm1234`);
  console.log(`   Demo farmer: abdul@farm.in / farm1234\n`);
});
