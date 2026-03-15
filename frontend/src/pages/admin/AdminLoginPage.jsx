import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { API_BASE } from "../../context/AuthContext";

// ── Design tokens ─────────────────────────────────────────────────────────────
const A = {
  bg:"#0a1510", sidebar:"#060f09", card:"#0f1f14",
  border:"#1e3a28", text:"#e0f0e6", textMid:"#7ab890", textLt:"#4a7a5a",
  green:"#52b788", greenDk:"#40916c", gold:"#d4a017",
  blue:"#3b82f6", red:"#ef4444", orange:"#f97316", purple:"#a855f7",
};

// ── Token helpers — stored separately from regular user token ─────────────────
const getAdminToken  = ()       => localStorage.getItem("rps_admin_token") || "";
const setAdminToken  = (t)      => localStorage.setItem("rps_admin_token", t);
const clearAdminToken = ()      => localStorage.removeItem("rps_admin_token");
const isAdminLoggedIn = ()      => !!getAdminToken();

// Fetch wrapper that always sends the admin JWT
const adminFetch = (path, opts = {}) =>
  fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
      ...(opts.headers || {}),
    },
  }).then(r => r.json());

// ── Shared sidebar ────────────────────────────────────────────────────────────
function AdminSidebar() {
  const navigate = useNavigate();
  const links = [
    ["📊", "Dashboard",  "/admin/dashboard"],
    ["👥", "Users",      "/admin/users"],
    ["🌾", "Farmers",    "/admin/farmers"],
    ["🏢", "Agents",     "/admin/agents"],
    ["📦", "Products",   "/admin/products"],
    ["🛒", "Orders",     "/admin/orders"],
  ];

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  return (
    <aside style={{ width:230, flexShrink:0, background:A.sidebar, borderRight:`1px solid ${A.border}`, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"28px 20px 20px", borderBottom:`1px solid ${A.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <span style={{ fontSize:24 }}>🌿</span>
          <span style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:18 }}>RPS Admin</span>
        </div>
        <div style={{ fontSize:10, color:A.textLt, letterSpacing:"2px", textTransform:"uppercase" }}>Control Panel</div>
      </div>

      <nav style={{ flex:1, padding:"14px 10px" }}>
        {links.map(([icon, label, to]) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, marginBottom:3,
            textDecoration:"none",
            background: isActive ? `${A.green}22` : "transparent",
            color: isActive ? A.green : A.textMid,
            fontWeight:700, fontSize:14,
            borderLeft: isActive ? `3px solid ${A.green}` : "3px solid transparent",
          })}>
            <span style={{ fontSize:18, width:24, textAlign:"center" }}>{icon}</span>{label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding:"14px 10px", borderTop:`1px solid ${A.border}`, display:"flex", flexDirection:"column", gap:8 }}>
        <NavLink to="/" style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:10, textDecoration:"none", color:A.textLt, fontSize:13, fontWeight:600 }}>
          ← Back to Site
        </NavLink>
        <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:10, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#fca5a5", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", textAlign:"left", width:"100%" }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

// ── Layout wrapper ────────────────────────────────────────────────────────────
export function AdminLayout({ title, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn()) navigate("/admin/login");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAdminLoggedIn()) return null;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:A.bg, fontFamily:"'Nunito','Segoe UI',sans-serif", color:A.text }}>
      <AdminSidebar />
      <main style={{ flex:1, padding:"36px 40px", overflowY:"auto" }}>
        {title && <h1 style={{ fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", color:A.text, marginBottom:24, marginTop:0 }}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}

// ── Reusable table ────────────────────────────────────────────────────────────
function AdminTable({ headers, rows }) {
  return (
    <div style={{ background:A.card, borderRadius:16, border:`1px solid ${A.border}`, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:`1px solid ${A.border}` }}>
            {headers.map(h => (
              <th key={h} style={{ padding:"13px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:A.textLt, textTransform:"uppercase", letterSpacing:"0.6px", whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ padding:40, textAlign:"center", color:A.textLt }}>No data found</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length-1 ? `1px solid ${A.border}` : "none" }}
              onMouseEnter={e => e.currentTarget.style.background = `${A.green}08`}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {row.map((cell, j) => <td key={j} style={{ padding:"12px 18px", fontSize:14 }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ label, color }) {
  return <span style={{ background:`${color}22`, color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{label}</span>;
}

function StatCard({ icon, label, value, sub, color = A.green }) {
  return (
    <div style={{ background:A.card, borderRadius:16, padding:"22px 24px", border:`1px solid ${A.border}` }}>
      <div style={{ fontSize:30, marginBottom:12 }}>{icon}</div>
      <div style={{ fontSize:34, fontWeight:800, color, marginBottom:4 }}>{value}</div>
      <div style={{ fontWeight:700, color:A.text, fontSize:14, marginBottom:3 }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:A.textLt }}>{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN LOGIN — calls real /api/auth/login and stores JWT as rps_admin_token
// ─────────────────────────────────────────────────────────────────────────────
export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate("/admin/dashboard");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async () => {
    if (!email || !password) { setError("Enter email and password."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) { setError(data.error || "Login failed"); setLoading(false); return; }
      if (data.user?.role !== "admin") { setError("Access denied — admin accounts only."); setLoading(false); return; }

      setAdminToken(data.token);
      navigate("/admin/dashboard");
    } catch (e) {
      setError("Cannot connect to server. Is the backend running?");
      setLoading(false);
    }
  };

  const inp = { width:"100%", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${A.border}`, background:"#0d1a10", color:A.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit" };

  return (
    <div style={{ minHeight:"100vh", background:A.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif", padding:20 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ background:A.card, borderRadius:24, padding:"44px 40px", boxShadow:"0 20px 60px rgba(0,0,0,0.6)", border:`1px solid ${A.border}` }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:`${A.green}18`, border:`2px solid ${A.green}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px" }}>🛡</div>
            <h1 style={{ fontSize:26, fontFamily:"'Playfair Display',Georgia,serif", color:A.text, margin:"0 0 6px" }}>Admin Login</h1>
            <p style={{ color:A.textLt, fontSize:13, margin:0 }}>RPS Fields — Staff Access Only</p>
          </div>

          {error && (
            <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:10, padding:"10px 14px", marginBottom:18, color:"#fca5a5", fontSize:13, fontWeight:600 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:A.textMid, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>Admin Email</label>
            <input type="email" style={inp} placeholder="admin@rpsfields.in" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:A.textMid, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>Password</label>
            <input type="password" style={inp} placeholder="••••••••" value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>

          <button onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:"14px 0", background:loading ? A.greenDk : `linear-gradient(135deg,${A.green},${A.greenDk})`, color:"#fff", border:"none", borderRadius:12, cursor:loading?"not-allowed":"pointer", fontWeight:800, fontSize:15, fontFamily:"inherit", opacity:loading?0.8:1 }}>
            {loading ? "Signing in..." : "Sign in to Admin →"}
          </button>

          <div style={{ marginTop:20, padding:"12px 16px", background:"#0d1a10", borderRadius:10, border:`1px solid ${A.border}` }}>
            <div style={{ fontSize:11, color:A.textLt, fontWeight:700, textTransform:"uppercase", marginBottom:8 }}>Demo credentials</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:12, color:A.textMid }}>
                <div>📧 admin@rpsfields.in</div>
                <div>🔑 admin123</div>
              </div>
              <button onClick={() => { setEmail("admin@rpsfields.in"); setPassword("admin123"); setError(""); }}
                style={{ padding:"6px 14px", background:A.green, color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
                Fill →
              </button>
            </div>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:20 }}>
          <NavLink to="/" style={{ color:A.textLt, fontSize:13, textDecoration:"none", fontWeight:600 }}>← Back to RPS Fields</NavLink>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    adminFetch("/admin/stats").then(d => { if (d.success) setStats(d.stats); }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AdminLayout title="📊 Dashboard Overview">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
        <StatCard icon="👥" label="Total Users"    value={stats?.totalUsers    ?? "…"} sub={`${stats?.farmers ?? 0} farmers · ${stats?.agents ?? 0} agents`} />
        <StatCard icon="📦" label="Total Products" value={stats?.totalProducts ?? "…"} color={A.gold} />
        <StatCard icon="🛒" label="Total Orders"   value={stats?.totalOrders   ?? "…"} color={A.blue} />
        <StatCard icon="💰" label="Total Revenue"  value={stats ? `₹${stats.totalRevenue}` : "…"} color={A.purple} />
      </div>
      <div style={{ background:A.card, borderRadius:16, padding:24, border:`1px solid ${A.border}` }}>
        <h3 style={{ color:A.text, fontSize:16, fontWeight:800, margin:"0 0 14px" }}>Quick Links</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[["/admin/farmers","🌾 Farmer Ratings"],["/admin/products","📦 Products"],["/admin/users","👥 All Users"]].map(([to,lbl])=>(
            <NavLink key={to} to={to} style={{ display:"block", padding:"14px 16px", background:`${A.green}18`, border:`1px solid ${A.green}40`, borderRadius:12, color:A.green, fontWeight:700, fontSize:14, textDecoration:"none", textAlign:"center" }}>{lbl}</NavLink>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────────────────────────────────────
export function AdminUsersPage() {
  const [users,   setUsers]   = useState([]);
  const [tab,     setTab]     = useState("all");
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState({});

  const load = (role) => {
    setLoading(true);
    const url = role && role !== "all" ? `/admin/users?role=${role}` : "/admin/users";
    adminFetch(url).then(d => { if (d.success) setUsers(d.users); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(tab); }, [tab]);

  const setStatus = async (id, status) => {
    setActing(a => ({ ...a, [id]: true }));
    await adminFetch(`/admin/users/${id}/status`, { method:"PUT", body: JSON.stringify({ status }) });
    setUsers(u => u.map(x => (x._id === id || x.id === id) ? { ...x, status } : x));
    setActing(a => { const x = { ...a }; delete x[id]; return x; });
  };

  const roleColor = r => r === "farmer" ? A.gold : r === "agent" ? A.blue : r === "admin" ? A.red : A.green;

  return (
    <AdminLayout title="👥 User Management">
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["all","farmer","agent","customer"].map(r => (
          <button key={r} onClick={() => setTab(r)}
            style={{ padding:"8px 18px", borderRadius:8, border:`1px solid ${tab===r ? A.green : A.border}`, background: tab===r ? `${A.green}22` : "transparent", color: tab===r ? A.green : A.textMid, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", textTransform:"capitalize" }}>
            {r === "all" ? "All Users" : r.charAt(0).toUpperCase() + r.slice(1) + "s"}
          </button>
        ))}
      </div>

      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Name", "Email", "Role", "Location", "Status", "Actions"]}
          rows={users.map(u => {
            const uid = u._id?.toString() || u.id?.toString();
            return [
              <span style={{ fontWeight:700, color:A.text }}>{u.fullName || u.name}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{u.email}</span>,
              <Badge label={u.role} color={roleColor(u.role)} />,
              <span style={{ color:A.textMid, fontSize:13 }}>{u.city || u.location || "—"}</span>,
              <Badge label={u.status || "active"} color={u.status === "banned" ? A.red : u.status === "suspended" ? A.orange : A.green} />,
              <div style={{ display:"flex", gap:6 }}>
                {u.role !== "admin" && u.status !== "suspended" && (
                  <button onClick={() => setStatus(uid, "suspended")} disabled={acting[uid]}
                    style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.orange}`, color:A.orange, borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Suspend</button>
                )}
                {u.role !== "admin" && u.status !== "banned" && (
                  <button onClick={() => setStatus(uid, "banned")} disabled={acting[uid]}
                    style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.red}`, color:"#fca5a5", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Ban</button>
                )}
                {u.status !== "active" && (
                  <button onClick={() => setStatus(uid, "active")} disabled={acting[uid]}
                    style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.green}`, color:A.green, borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Restore</button>
                )}
              </div>,
            ];
          })}
        />
      )}
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN FARMERS — quality monitoring
// ─────────────────────────────────────────────────────────────────────────────
export function AdminFarmersPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState({});

  useEffect(() => {
    adminFetch("/admin/farmers").then(d => { if (d.success) setFarmers(d.farmers); }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = async (id, status) => {
    setActing(a => ({ ...a, [id]: true }));
    await adminFetch(`/admin/users/${id}/status`, { method:"PUT", body: JSON.stringify({ status }) });
    setFarmers(f => f.map(u => (u._id === id || u.id === id) ? { ...u, status } : u));
    setActing(a => { const x = { ...a }; delete x[id]; return x; });
  };

  const qColor = q => q === "Excellent" ? A.green : q === "Average" ? A.gold : q === "Warning" ? A.orange : q === "Poor quality" ? A.red : A.textLt;

  return (
    <AdminLayout title="🌾 Farmer Quality Monitoring">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Farmer", "Location", "Avg Rating", "Quality", "Orders", "Reviews", "Status", "Actions"]}
          rows={farmers.map(f => {
            const fid = f._id?.toString() || f.id?.toString();
            return [
              <span style={{ fontWeight:700, color:A.text }}>{f.fullName || f.name}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{f.city || f.location || "—"}</span>,
              <span style={{ fontWeight:800, color:qColor(f.qualityLabel), fontSize:18 }}>{f.avgRating > 0 ? f.avgRating.toFixed(1) : "—"}</span>,
              <Badge label={f.qualityLabel || "No ratings"} color={qColor(f.qualityLabel)} />,
              <span style={{ color:A.textMid }}>{f.totalOrders}</span>,
              <span style={{ color:A.textMid }}>{f.totalRatings}</span>,
              <Badge label={f.status || "active"} color={f.status === "banned" ? A.red : f.status === "suspended" ? A.orange : A.green} />,
              <div style={{ display:"flex", gap:6 }}>
                {f.status !== "suspended" && <button onClick={() => setStatus(fid, "suspended")} disabled={acting[fid]} style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.orange}`, color:A.orange, borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Suspend</button>}
                {f.status !== "banned"    && <button onClick={() => setStatus(fid, "banned")}    disabled={acting[fid]} style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.red}`,    color:"#fca5a5", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Ban</button>}
                {f.status !== "active"    && <button onClick={() => setStatus(fid, "active")}    disabled={acting[fid]} style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.green}`,  color:A.green,   borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Restore</button>}
              </div>,
            ];
          })}
        />
      )}
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN AGENTS
// ─────────────────────────────────────────────────────────────────────────────
export function AdminAgentsPage() {
  const [agents,  setAgents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState({});

  useEffect(() => {
    adminFetch("/admin/users?role=agent").then(d => { if (d.success) setAgents(d.users); }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = async (id, status) => {
    setActing(a => ({ ...a, [id]: true }));
    await adminFetch(`/admin/users/${id}/status`, { method:"PUT", body: JSON.stringify({ status }) });
    setAgents(u => u.map(x => (x._id === id || x.id === id) ? { ...x, status } : x));
    setActing(a => { const x = { ...a }; delete x[id]; return x; });
  };

  return (
    <AdminLayout title="🏢 Agents Management">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Name", "Email", "Mobile", "Location", "Status", "Actions"]}
          rows={agents.map(a => {
            const aid = a._id?.toString() || a.id?.toString();
            return [
              <span style={{ fontWeight:700, color:A.text }}>{a.fullName || a.name}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{a.email}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{a.mobile || a.phone || "—"}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{a.city || a.location || "—"}</span>,
              <Badge label={a.status || "active"} color={a.status === "banned" ? A.red : a.status === "suspended" ? A.orange : A.green} />,
              <div style={{ display:"flex", gap:6 }}>
                {a.status !== "suspended" && <button onClick={() => setStatus(aid, "suspended")} disabled={acting[aid]} style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.orange}`, color:A.orange, borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Suspend</button>}
                {a.status !== "banned"    && <button onClick={() => setStatus(aid, "banned")}    disabled={acting[aid]} style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.red}`,    color:"#fca5a5", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Ban</button>}
                {a.status !== "active"    && <button onClick={() => setStatus(aid, "active")}    disabled={acting[aid]} style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${A.green}`,  color:A.green,   borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Restore</button>}
              </div>,
            ];
          })}
        />
      )}
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const load = () => {
    setLoading(true);
    adminFetch("/admin/products").then(d => { if (d.success) setProducts(d.products); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (id) => {
    if (!window.confirm("Remove this product?")) return;
    await adminFetch(`/admin/products/${id}`, { method:"DELETE" });
    load();
  };

  return (
    <AdminLayout title="📦 Products Management">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Product", "Farmer", "Agent", "Category", "Price", "Stock", "Rating", "Actions"]}
          rows={products.map(p => [
            <span style={{ fontWeight:700, color:A.text }}>{p.name}</span>,
            <span style={{ color:A.textMid, fontSize:13 }}>{p.farmerId?.fullName || p.farmerId?.name || "—"}</span>,
            <span style={{ color:A.textMid, fontSize:13 }}>{p.agentId?.fullName  || p.agentId?.name  || "—"}</span>,
            <Badge label={p.category} color={A.textMid} />,
            <span style={{ color:A.green, fontWeight:700 }}>₹{p.pricePerKg || p.price}</span>,
            <span style={{ color: (p.quantity || p.qty) < 20 ? A.gold : A.textMid }}>{p.quantity || p.qty} kg</span>,
            <span style={{ color:A.gold }}>{p.avgRating > 0 ? `⭐ ${p.avgRating}` : "—"}</span>,
            <button onClick={() => remove(p._id || p.id)} style={{ padding:"5px 12px", background:"transparent", border:`1px solid ${A.red}`, color:"#fca5a5", borderRadius:7, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Remove</button>,
          ])}
        />
      )}
    </AdminLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ORDERS
// ─────────────────────────────────────────────────────────────────────────────
export function AdminOrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/admin/orders").then(d => { if (d.success) setOrders(d.orders); }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusColor = s => s === "delivered" ? A.green : s === "cancelled" ? A.red : A.blue;

  return (
    <AdminLayout title="🛒 Orders Management">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Order ID", "Customer", "Items", "Total", "City", "Date", "Status"]}
          rows={orders.map(o => [
            <span style={{ fontWeight:700, color:A.text, fontSize:12 }}>{(o._id || o.id)?.toString().slice(-10)}</span>,
            <span style={{ color:A.textMid }}>{o.customerId?.name || o.customerId?.fullName || "—"}</span>,
            <span style={{ color:A.textMid }}>{(o.items || []).length} items</span>,
            <span style={{ color:A.green, fontWeight:700 }}>₹{o.totalPrice || o.total}</span>,
            <span style={{ color:A.textMid }}>{o.city}</span>,
            <span style={{ color:A.textLt, fontSize:12 }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>,
            <Badge label={o.status} color={statusColor(o.status)} />,
          ])}
        />
      )}
    </AdminLayout>
  );
}

export default AdminLoginPage;
