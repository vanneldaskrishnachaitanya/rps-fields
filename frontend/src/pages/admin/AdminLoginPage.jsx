import { useState, createContext, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";

// ── Admin design tokens ───────────────────────────────────────────────────────
const A = {
  bg:      "#0a1510",
  sidebar: "#060f09",
  card:    "#0f1f14",
  cardAlt: "#132219",
  border:  "#1e3a28",
  text:    "#e0f0e6",
  textMid: "#7ab890",
  textLt:  "#4a7a5a",
  green:   "#52b788",
  greenDk: "#40916c",
  gold:    "#d4a017",
  blue:    "#3b82f6",
  red:     "#ef4444",
  orange:  "#f97316",
  purple:  "#a855f7",
};

// ── Simple admin session (localStorage) ──────────────────────────────────────
const ADMIN_EMAIL    = "admin@rpsfields.in";
const ADMIN_PASSWORD = "admin123";

function isAdminLoggedIn() {
  return localStorage.getItem("rps_admin") === "true";
}
function adminLogin(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("rps_admin", "true");
    return true;
  }
  return false;
}
function adminLogout() {
  localStorage.removeItem("rps_admin");
}

// ── Shared AdminLayout ────────────────────────────────────────────────────────
function AdminSidebar() {
  const navigate = useNavigate();

  const links = [
    ["📊", "Dashboard",  "/admin/dashboard"],
    ["📦", "Products",   "/admin/products"],
    ["👥", "Users",      "/admin/users"],
    ["🛒", "Orders",     "/admin/orders"],
  ];

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <aside style={{
      width: 230, flexShrink: 0,
      background: A.sidebar,
      borderRight: `1px solid ${A.border}`,
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px", borderBottom: `1px solid ${A.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>🌿</span>
          <span style={{ color: "#fff", fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 18 }}>
            RPS Admin
          </span>
        </div>
        <div style={{ fontSize: 10, color: A.textLt, letterSpacing: "2px", textTransform: "uppercase", paddingLeft: 2 }}>
          Control Panel
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "16px 10px" }}>
        {links.map(([icon, label, to]) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, marginBottom: 3,
              textDecoration: "none",
              background: isActive ? `${A.green}22` : "transparent",
              color: isActive ? A.green : A.textMid,
              fontWeight: 700, fontSize: 14,
              borderLeft: isActive ? `3px solid ${A.green}` : "3px solid transparent",
              transition: "all 0.18s",
            })}
            onMouseEnter={e => { if (!e.currentTarget.style.borderLeft.includes(A.green)) e.currentTarget.style.background = `${A.green}10`; }}
            onMouseLeave={e => { if (!e.currentTarget.style.borderLeft.includes(A.green)) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Back to site + Logout */}
      <div style={{ padding: "14px 10px", borderTop: `1px solid ${A.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, textDecoration: "none", color: A.textLt, fontSize: 13, fontWeight: 600 }}>
          ← Back to Site
        </NavLink>
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", textAlign: "left", width: "100%" }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

function AdminLayout({ title, children }) {
  const navigate = useNavigate();

  // Guard: redirect to login if not authenticated
  if (!isAdminLoggedIn()) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: A.bg, fontFamily: "'Nunito','Segoe UI',sans-serif", color: A.text }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        {title && (
          <h1 style={{ fontSize: 28, fontFamily: "'Playfair Display',Georgia,serif", color: A.text, marginBottom: 6, marginTop: 0 }}>
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}

// Stat card component
function StatCard({ icon, label, value, sub, color = A.green }) {
  return (
    <div style={{ background: A.card, borderRadius: 16, padding: "22px 24px", border: `1px solid ${A.border}` }}>
      <div style={{ fontSize: 30, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 34, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontWeight: 700, color: A.text, fontSize: 14, marginBottom: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: A.textLt }}>{sub}</div>}
    </div>
  );
}

// Table wrapper
function AdminTable({ headers, rows }) {
  return (
    <div style={{ background: A.card, borderRadius: 16, border: `1px solid ${A.border}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${A.border}` }}>
            {headers.map(h => (
              <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: A.textLt, textTransform: "uppercase", letterSpacing: "0.6px", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${A.border}` : "none" }}
              onMouseEnter={e => e.currentTarget.style.background = `${A.green}08`}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "13px 18px", fontSize: 14 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span style={{ background: bg || `${color}22`, color: color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function ActionBtn({ label, color = A.textLt, border = A.border, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${border}`, color, borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Already logged in → go to dashboard
  if (isAdminLoggedIn()) {
    navigate("/admin/dashboard");
    return null;
  }

  const handleLogin = () => {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setTimeout(() => {                       // small delay for UX feel
      const ok = adminLogin(email, password);
      if (ok) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials. Try admin@rpsfields.in / admin123");
        setLoading(false);
      }
    }, 600);
  };

  const inp = err => ({
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: `1.5px solid ${err ? "#ef4444" : A.border}`,
    background: err ? "rgba(239,68,68,0.08)" : "#0d1a10",
    color: A.text, fontSize: 14,
    boxSizing: "border-box", outline: "none", fontFamily: "inherit",
  });

  return (
    <div style={{ minHeight: "100vh", background: A.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Card */}
        <div style={{ background: A.card, borderRadius: 24, padding: "44px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", border: `1px solid ${A.border}` }}>
          {/* Icon + title */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: `${A.green}18`, border: `2px solid ${A.green}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>
              🛡
            </div>
            <h1 style={{ fontSize: 26, fontFamily: "'Playfair Display',Georgia,serif", color: A.text, margin: "0 0 6px" }}>
              Admin Login
            </h1>
            <p style={{ color: A.textLt, fontSize: 13, margin: 0 }}>RPS Fields — Staff Access Only</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 10, padding: "10px 14px", marginBottom: 18, color: "#fca5a5", fontSize: 13, fontWeight: 600 }}>
              ⚠ {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: A.textMid, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
              Admin Email
            </label>
            <input type="email" style={inp(false)} placeholder="admin@rpsfields.in" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: A.textMid, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
              Password
            </label>
            <input type="password" style={inp(false)} placeholder="••••••••" value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          {/* Login button */}
          <button onClick={handleLogin} disabled={loading} style={{
            width: "100%", padding: "14px 0",
            background: loading ? A.greenDk : `linear-gradient(135deg, ${A.green}, ${A.greenDk})`,
            color: "#fff", border: "none", borderRadius: 12,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 800, fontSize: 15, fontFamily: "inherit",
            boxShadow: `0 4px 20px ${A.green}40`,
            opacity: loading ? 0.8 : 1, transition: "opacity 0.2s",
          }}>
            {loading ? "Signing in..." : "Sign in to Admin →"}
          </button>

          {/* Demo hint */}
          <div style={{ marginTop: 20, padding: "12px 16px", background: "#0d1a10", borderRadius: 10, border: `1px solid ${A.border}` }}>
            <div style={{ fontSize: 11, color: A.textLt, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
              Demo credentials
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: A.textMid }}>
                <div>📧 admin@rpsfields.in</div>
                <div>🔑 admin123</div>
              </div>
              <button
                onClick={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASSWORD); setError(""); }}
                style={{ padding: "6px 14px", background: A.green, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}
              >
                Fill →
              </button>
            </div>
          </div>
        </div>

        {/* Back to site */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <NavLink to="/" style={{ color: A.textLt, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
            ← Back to RPS Fields
          </NavLink>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard Overview">
      <p style={{ color: A.textLt, marginBottom: 30, marginTop: -4 }}>
        Welcome back, Admin. Here's the platform snapshot.
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard icon="👥" label="Total Users"     value="2,341"  sub="↑ 12% this month"    color={A.green} />
        <StatCard icon="🌾" label="Active Farmers"  value="78"     sub="3 pending approval"  color={A.gold} />
        <StatCard icon="📦" label="Total Products"  value="189"    sub="Across 5 categories" color={A.blue} />
        <StatCard icon="🛒" label="Orders Today"    value="47"     sub="₹34,200 revenue"     color={A.orange} />
      </div>

      {/* Two panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Recent activity */}
        <div style={{ background: A.card, borderRadius: 16, padding: 24, border: `1px solid ${A.border}` }}>
          <h3 style={{ color: A.text, fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>🕐 Recent Activity</h3>
          {[
            { icon: "🌾", title: "New farmer registered", sub: "Ramesh Yadav — Lucknow", time: "2m ago", color: A.gold },
            { icon: "🛒", title: "Order placed",          sub: "ORD-ABC123 · ₹890",        time: "8m ago", color: A.green },
            { icon: "✅", title: "Product approved",      sub: "Desi Ghee by Savita Sharma",time: "15m ago",color: A.blue },
            { icon: "👤", title: "New customer signup",   sub: "Priya Singh — Delhi",       time: "1h ago", color: A.purple },
            { icon: "🚚", title: "Order delivered",       sub: "ORD-XYZ789 · Pune",         time: "2h ago", color: A.textMid },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 0", borderBottom: i < 4 ? `1px solid ${A.border}` : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: A.text, fontSize: 13 }}>{item.title}</div>
                <div style={{ color: A.textLt, fontSize: 12, marginTop: 2 }}>{item.sub}</div>
              </div>
              <div style={{ color: A.textLt, fontSize: 11, whiteSpace: "nowrap", marginTop: 2 }}>{item.time}</div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div style={{ background: A.card, borderRadius: 16, padding: 24, border: `1px solid ${A.border}` }}>
          <h3 style={{ color: A.text, fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>📊 Orders by Category</h3>
          {[
            ["🥦 Vegetables", 62, A.green],
            ["🍎 Fruits",     48, A.gold],
            ["🌾 Grains",     31, A.blue],
            ["🥛 Dairy",      24, A.orange],
            ["🥜 Dry Fruits", 18, A.purple],
          ].map(([cat, count]) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: A.textMid }}>{cat}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: A.text }}>{count} orders</span>
              </div>
              <div style={{ background: "#0d1a10", borderRadius: 4, height: 7, overflow: "hidden" }}>
                <div style={{ width: `${Math.round((count / 62) * 100)}%`, height: "100%", background: A.green, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { name: "Fresh Tomatoes",    farmer: "Ravi Kumar",    category: "Vegetables", price: 45,  qty: 120, status: "active" },
  { name: "Alphonso Mangoes",  farmer: "Suresh Patil",  category: "Fruits",     price: 380, qty: 50,  status: "active" },
  { name: "Organic Milk",      farmer: "Meena Devi",    category: "Dairy",      price: 62,  qty: 200, status: "active" },
  { name: "Premium Almonds",   farmer: "Abdul Khan",    category: "Dry Fruits", price: 720, qty: 80,  status: "pending" },
  { name: "Basmati Rice",      farmer: "Harpal Singh",  category: "Grains",     price: 95,  qty: 500, status: "active" },
  { name: "Baby Spinach",      farmer: "Ravi Kumar",    category: "Vegetables", price: 28,  qty: 90,  status: "active" },
  { name: "Strawberries",      farmer: "Suresh Patil",  category: "Fruits",     price: 180, qty: 40,  status: "active" },
  { name: "Kashmiri Walnuts",  farmer: "Abdul Khan",    category: "Dry Fruits", price: 850, qty: 60,  status: "active" },
];

export function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.farmer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = (i) => {
    setProducts(prev => prev.map((p, idx) => idx === i ? { ...p, status: p.status === "active" ? "pending" : "active" } : p));
  };

  return (
    <AdminLayout title="📦 Products Management">
      <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by product or farmer..."
          style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${A.border}`, background: "#0d1a10", color: A.text, fontSize: 13, outline: "none", fontFamily: "inherit", minWidth: 260 }} />
        {["all", "active", "pending"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${filter === s ? A.green : A.border}`, background: filter === s ? `${A.green}22` : "transparent", color: filter === s ? A.green : A.textMid, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", textTransform: "capitalize" }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span style={{ color: A.textLt, fontSize: 13, marginLeft: "auto" }}>{filtered.length} products</span>
      </div>

      <AdminTable
        headers={["Product", "Farmer", "Category", "Price", "Stock", "Status", "Actions"]}
        rows={filtered.map((p, i) => [
          <span style={{ fontWeight: 700, color: A.text }}>{p.name}</span>,
          <span style={{ color: A.textMid }}>{p.farmer}</span>,
          <Badge label={p.category} color={A.textMid} />,
          <span style={{ color: A.green, fontWeight: 700 }}>₹{p.price}/kg</span>,
          <span style={{ color: p.qty < 50 ? A.gold : A.textMid }}>{p.qty} kg</span>,
          <Badge label={p.status} color={p.status === "active" ? A.green : A.gold} />,
          <div style={{ display: "flex", gap: 6 }}>
            <ActionBtn label={p.status === "active" ? "Suspend" : "Approve"} color={p.status === "active" ? "#fca5a5" : A.green} border={p.status === "active" ? "rgba(239,68,68,0.4)" : `${A.green}60`} onClick={() => toggleStatus(products.indexOf(p))} />
            <ActionBtn label="Remove" color="#fca5a5" border="rgba(239,68,68,0.4)" />
          </div>,
        ])}
      />
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { name: "Ravi Kumar",    email: "ravi@farm.in",     role: "farmer",   city: "Pune",       joined: "Jan 2025", status: "active" },
  { name: "Abdul Khan",    email: "abdul@farm.in",    role: "farmer",   city: "Srinagar",   joined: "Jan 2025", status: "active" },
  { name: "Meena Devi",    email: "meena@farm.in",    role: "farmer",   city: "Anand",      joined: "Feb 2025", status: "active" },
  { name: "Harpal Singh",  email: "harpal@farm.in",   role: "farmer",   city: "Amritsar",   joined: "Feb 2025", status: "active" },
  { name: "Priya Singh",   email: "priya@gmail.com",  role: "customer", city: "Delhi",      joined: "Mar 2025", status: "active" },
  { name: "Rahul Mehta",   email: "rahul@gmail.com",  role: "customer", city: "Mumbai",     joined: "Mar 2025", status: "active" },
  { name: "Anjali Sharma", email: "anjali@gmail.com", role: "customer", city: "Bangalore",  joined: "Mar 2025", status: "active" },
];

export function AdminUsersPage() {
  const [tab, setTab]       = useState("all");
  const [search, setSearch] = useState("");
  const [users, setUsers]   = useState(MOCK_USERS);

  const filtered = users.filter(u => {
    const matchTab  = tab === "all" || u.role === tab;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggleBan = email => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, status: u.status === "active" ? "banned" : "active" } : u));
  };

  const farmers   = users.filter(u => u.role === "farmer").length;
  const customers = users.filter(u => u.role === "customer").length;

  return (
    <AdminLayout title="👥 User Management">
      {/* Mini stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {[["All Users", users.length, A.green], ["Farmers", farmers, A.gold], ["Customers", customers, A.blue]].map(([lbl, val, color]) => (
          <div key={lbl} style={{ background: A.card, borderRadius: 12, padding: "14px 20px", border: `1px solid ${A.border}`, minWidth: 120 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: 12, color: A.textLt, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        {["all", "farmer", "customer"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${tab === t ? A.green : A.border}`, background: tab === t ? `${A.green}22` : "transparent", color: tab === t ? A.green : A.textMid, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
            {t === "all" ? "All Users" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
          style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${A.border}`, background: "#0d1a10", color: A.text, fontSize: 13, outline: "none", fontFamily: "inherit", marginLeft: "auto" }} />
      </div>

      <AdminTable
        headers={["Name", "Email", "Role", "City", "Joined", "Status", "Actions"]}
        rows={filtered.map(u => [
          <span style={{ fontWeight: 700, color: A.text }}>{u.name}</span>,
          <span style={{ color: A.textMid, fontSize: 13 }}>{u.email}</span>,
          <Badge label={u.role === "farmer" ? "🌾 Farmer" : "👤 Customer"} color={u.role === "farmer" ? A.gold : A.blue} />,
          <span style={{ color: A.textMid, fontSize: 13 }}>{u.city}</span>,
          <span style={{ color: A.textLt, fontSize: 12 }}>{u.joined}</span>,
          <Badge label={u.status} color={u.status === "active" ? A.green : A.red} />,
          <div style={{ display: "flex", gap: 6 }}>
            <ActionBtn label="View" />
            <ActionBtn label={u.status === "active" ? "Ban" : "Unban"} color={u.status === "active" ? "#fca5a5" : A.green} border={u.status === "active" ? "rgba(239,68,68,0.4)" : `${A.green}60`} onClick={() => toggleBan(u.email)} />
          </div>,
        ])}
      />
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ORDERS
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: "ORD-A1B2C3D4", customer: "Priya Singh",    total: 890,  items: 3, city: "Delhi",     status: "confirmed", date: "Mar 9, 2025" },
  { id: "ORD-E5F6G7H8", customer: "Rahul Mehta",    total: 1240, items: 5, city: "Mumbai",    status: "delivered", date: "Mar 8, 2025" },
  { id: "ORD-I9J0K1L2", customer: "Anjali Sharma",  total: 440,  items: 2, city: "Bangalore", status: "confirmed", date: "Mar 8, 2025" },
  { id: "ORD-M3N4O5P6", customer: "Vikram Nair",    total: 650,  items: 4, city: "Chennai",   status: "delivered", date: "Mar 7, 2025" },
  { id: "ORD-Q7R8S9T0", customer: "Sunita Rao",     total: 320,  items: 1, city: "Hyderabad", status: "cancelled", date: "Mar 7, 2025" },
];

export function AdminOrdersPage() {
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_ORDERS.filter(o => filter === "all" || o.status === filter);

  const statusColor = s => s === "delivered" ? A.green : s === "confirmed" ? A.blue : A.red;

  return (
    <AdminLayout title="🛒 Orders Management">
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[["All Orders", MOCK_ORDERS.length, A.green], ["Confirmed", MOCK_ORDERS.filter(o=>o.status==="confirmed").length, A.blue], ["Delivered", MOCK_ORDERS.filter(o=>o.status==="delivered").length, A.green], ["Cancelled", MOCK_ORDERS.filter(o=>o.status==="cancelled").length, A.red]].map(([lbl,val,color])=>(
          <div key={lbl} style={{ background: A.card, borderRadius: 14, padding: "18px 20px", border: `1px solid ${A.border}` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: 12, color: A.textLt, marginTop: 3 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {["all", "confirmed", "delivered", "cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${filter === s ? A.green : A.border}`, background: filter === s ? `${A.green}22` : "transparent", color: filter === s ? A.green : A.textMid, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", textTransform: "capitalize" }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <AdminTable
        headers={["Order ID", "Customer", "Items", "Total", "City", "Date", "Status", "Action"]}
        rows={filtered.map(o => [
          <span style={{ fontWeight: 700, color: A.text, fontSize: 13 }}>{o.id}</span>,
          <span style={{ color: A.textMid }}>{o.customer}</span>,
          <span style={{ color: A.textLt }}>{o.items} items</span>,
          <span style={{ color: A.green, fontWeight: 700 }}>₹{o.total}</span>,
          <span style={{ color: A.textMid }}>{o.city}</span>,
          <span style={{ color: A.textLt, fontSize: 12 }}>{o.date}</span>,
          <Badge label={o.status} color={statusColor(o.status)} />,
          <ActionBtn label="View" />,
        ])}
      />
    </AdminLayout>
  );
}

export default AdminLoginPage;
