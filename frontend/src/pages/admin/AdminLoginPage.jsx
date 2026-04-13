import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { API_BASE } from "../../context/AuthContext";

const A = {
  bg:"#030a05", card:"rgba(10,20,12,0.85)", border:"rgba(82,183,136,0.15)",
  text:"#e0f0e6", textMid:"rgba(116,198,157,0.9)", textLt:"rgba(74,122,90,0.8)",
  green:"#52b788", greenDk:"#40916c", gold:"#c8960c",
  blue:"#3b82f6", red:"#ef4444", orange:"#f97316", purple:"#a855f7",
};

const adminFetch = (path, opts = {}) =>
  fetch(`${API_BASE}${path}`, {
    ...opts,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  }).then((r) => r.json());

// ── Liquid Glass sidebar ──────────────────────────────────────────────────────
function AdminSidebar() {
  const links = [["📊","Dashboard","/admin/dashboard"],["👥","Users","/admin/users"],["🌾","Farmers","/admin/farmers"],["🏢","Agents","/admin/agents"],["📦","Products","/admin/products"],["🛒","Orders","/admin/orders"]];
  return (
    <aside style={{
      width:230, flexShrink:0, minHeight:"100vh",
      background:"rgba(3,10,5,0.92)",
      backdropFilter:"blur(24px) saturate(200%)", WebkitBackdropFilter:"blur(24px) saturate(200%)",
      borderRight:"1px solid rgba(82,183,136,0.12)",
      boxShadow:"4px 0 32px rgba(0,0,0,0.5)",
      display:"flex", flexDirection:"column",
    }}>
      {/* Logo */}
      <div style={{ padding:"26px var(--page-px,clamp(16px,4vw,48px)) 22px", borderBottom:"1px solid rgba(82,183,136,0.1)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)" }}>🌿</div>
          <span style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:18 }}>RPS Admin</span>
        </div>
        <div style={{ fontSize:9, color:A.textLt, letterSpacing:"2.5px", textTransform:"uppercase", marginLeft:44 }}>Control Panel</div>
      </div>

      <nav style={{ flex:1, padding:"12px 10px" }}>
        {links.map(([icon,label,to])=>(
          <NavLink key={to} to={to} style={({isActive})=>({
            display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, marginBottom:3,
            textDecoration:"none", fontFamily:"'Inter',sans-serif",
            background: isActive ? "rgba(82,183,136,0.15)" : "transparent",
            backdropFilter: isActive ? "blur(8px)" : "none",
            color: isActive ? A.green : A.textMid,
            fontWeight:600, fontSize:14,
            borderLeft: isActive ? "2px solid "+A.green : "2px solid transparent",
            boxShadow: isActive ? "inset 0 1px 0 rgba(82,183,136,0.1)" : "none",
            transition:"all 0.18s ease",
          })}>
            <span style={{ fontSize:17, width:22, textAlign:"center" }}>{icon}</span>{label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(82,183,136,0.1)", display:"flex", flexDirection:"column", gap:6 }}>
        <NavLink to="/" style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px", borderRadius:10, textDecoration:"none", color:A.textLt, fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif", transition:"all 0.18s" }}
          onMouseEnter={e=>e.currentTarget.style.color=A.green} onMouseLeave={e=>e.currentTarget.style.color=A.textLt}>
          ← Back to Site
        </NavLink>
        <button data-magnetic onClick={async()=>{ await fetch(`${API_BASE}/auth/logout`, { method:"POST", credentials:"include" }).catch(()=>{}); window.location="/admin/login"; }} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px", borderRadius:10, background:"rgba(239,68,68,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(239,68,68,0.2)", color:"#fca5a5", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"'Inter',sans-serif", width:"100%", textAlign:"left", transition:"all 0.18s" }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    adminFetch("/auth/me")
      .then((data) => {
        if (!alive) return;
        if (!data.success || data.user?.role !== "admin") {
          navigate("/admin/login");
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        if (alive) navigate("/admin/login");
      });
    return () => { alive = false; };
  }, [navigate]);

  if (checking) return null;
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:A.bg, fontFamily:"'Inter','Segoe UI',sans-serif", color:A.text }}>
      <AdminSidebar />
      <main style={{ flex:1, padding:"36px 40px", overflowY:"auto" }}>
        {title && <h1 style={{ fontSize:26, fontFamily:"'Playfair Display',Georgia,serif", color:A.text, marginBottom:28, marginTop:0, animation:"fadeUp 0.4s ease both" }}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}

// ── Glass table ───────────────────────────────────────────────────────────────
function AdminTable({ headers, rows }) {
  return (
    <div style={{ background:"rgba(10,20,12,0.8)", backdropFilter:"blur(20px) saturate(180%)", WebkitBackdropFilter:"blur(20px) saturate(180%)", border:"1px solid rgba(82,183,136,0.12)", borderRadius:18, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:"1px solid rgba(82,183,136,0.1)", background:"rgba(82,183,136,0.06)" }}>
            {headers.map(h=>(
              <th key={h} style={{ padding:"13px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:A.textLt, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Inter',sans-serif" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length===0 ? (
            <tr><td colSpan={headers.length} style={{ padding:"48px", textAlign:"center", color:A.textLt, fontFamily:"'Inter',sans-serif" }}>No data found</td></tr>
          ) : rows.map((row,i)=>(
            <tr key={i} style={{ borderBottom: i<rows.length-1?"1px solid rgba(82,183,136,0.07)":"none", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(82,183,136,0.05)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {row.map((cell,j)=><td key={j} style={{ padding:"12px 18px", fontSize:14, fontFamily:"'Inter',sans-serif" }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ label, color }) {
  return <span style={{ background:`${color}18`, backdropFilter:"blur(8px)", color, border:`1px solid ${color}30`, borderRadius:20, padding:"3px 11px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", fontFamily:"'Inter',sans-serif" }}>{label}</span>;
}

function StatCard({ icon, label, value, sub, color=A.green }) {
  return (
    <div data-tilt style={{ background:"rgba(10,20,12,0.82)", backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)", border:`1px solid ${color}20`, borderRadius:20, padding:"22px 24px", boxShadow:"0 4px 24px rgba(0,0,0,0.4)", transition:"all 0.28s cubic-bezier(0.34,1.56,0.64,1)", position:"relative", overflow:"hidden" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${color}20`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.4)";}}>
      <div style={{ position:"absolute", top:-8, right:-8, width:50, height:50, borderRadius:"50%", background:`${color}10`, pointerEvents:"none" }} />
      <div style={{ fontSize:28, marginBottom:12 }}>{icon}</div>
      <div className="num" style={{ fontSize:32, fontWeight:900, color, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"', marginBottom:4 }}>{value}</div>
      <div style={{ fontWeight:700, color:A.text, fontSize:14, marginBottom:3 }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:A.textLt }}>{sub}</div>}
    </div>
  );
}

// ── Admin Login Page ──────────────────────────────────────────────────────────
export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    adminFetch("/auth/me")
      .then((data) => {
        if (data.success && data.user?.role === "admin") navigate("/admin/dashboard");
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) { setError("Enter email and password."); return; }
    setLoading(true); setError("");
    try {
      const data = await adminFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (!data.success) { setError(data.error || "Login failed"); setLoading(false); return; }
      if (data.user?.role !== "admin") { setError("Access denied — admin only."); setLoading(false); return; }
      navigate("/admin/dashboard");
    } catch (e) { setError("Cannot connect to server."); setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#030a05,#0d2b1a,#030a05)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif", padding:20, position:"relative", overflow:"hidden" }}>
      {/* Background orbs */}
      <div style={{ position:"absolute", top:"10%", left:"15%", width:300, height:300, borderRadius:"50%", background:"rgba(82,183,136,0.06)", filter:"blur(40px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"10%", right:"15%", width:250, height:250, borderRadius:"50%", background:"rgba(40,100,70,0.08)", filter:"blur(40px)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:420, animation:"scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ background:"linear-gradient(165deg, rgba(8,18,10,0.96), rgba(6,14,9,0.98))", backdropFilter:"blur(18px) saturate(160%)", WebkitBackdropFilter:"blur(18px) saturate(160%)", borderRadius:24, padding:"44px 40px", border:"1px solid rgba(82,183,136,0.24)", boxShadow:"0 26px 70px rgba(0,0,0,0.72), 0 0 0 1px rgba(82,183,136,0.08), inset 0 1px 0 rgba(255,255,255,0.10)", marginBottom:16 }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ width:68, height:68, borderRadius:18, background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 18px", boxShadow:"0 10px 30px rgba(82,183,136,0.4)", animation:"anim-glow 2s ease-in-out infinite" }}>🛡</div>
            <h1 style={{ fontSize:26, fontFamily:"'Playfair Display',Georgia,serif", color:"#fff", margin:"0 0 6px" }}>Admin Login</h1>
            <p style={{ color:"rgba(184,228,205,0.78)", fontSize:13, margin:0 }}>RPS Fields — Staff Access Only</p>
          </div>

          {error && (
            <div style={{ background:"rgba(239,68,68,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, padding:"11px 16px", marginBottom:20, color:"#fca5a5", fontSize:13, fontWeight:600, animation:"fadeUp 0.3s ease" }}>⚠ {error}</div>
          )}

          {[["Admin Email","email","email","admin@rpsfields.in",email,setEmail],["Password","password","password","••••••••",password,setPassword]].map(([lbl,name,type,ph,val,setVal])=>(
            <div key={name} style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:A.textMid, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>{lbl}</label>
              <input type={type} style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:"1.5px solid rgba(82,183,136,0.30)", background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)", color:"#f2fff7", fontSize:14, fontFamily:"'Inter',sans-serif", outline:"none", boxSizing:"border-box", transition:"all 0.2s" }}
                placeholder={ph} value={val} onChange={e=>{setVal(e.target.value); setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                onFocus={e=>{e.target.style.borderColor="#6bd6a4"; e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.24)"; e.target.style.background="rgba(255,255,255,0.10)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(82,183,136,0.30)"; e.target.style.boxShadow="none"; e.target.style.background="rgba(255,255,255,0.08)";}}
              />
            </div>
          ))}

          <button data-magnetic onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:"14px", background:loading?"linear-gradient(135deg,rgba(69,150,114,0.80),rgba(41,102,74,0.82))":"linear-gradient(135deg,rgba(93,198,150,0.96),rgba(47,131,94,0.98))", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.30)", border:"1px solid rgba(194,255,226,0.44)", borderRadius:14, cursor:loading?"not-allowed":"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", boxShadow:loading?"0 8px 20px rgba(28,120,86,0.24)":"inset 0 1.5px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 10px 30px rgba(28,120,86,0.50)", transition:"all 0.25s", opacity:loading?0.78:1, marginTop:8 }}
            onMouseEnter={e=>{ if(!loading){e.target.style.transform="translateY(-1px)"; e.target.style.boxShadow="inset 0 1.5px 0 rgba(255,255,255,0.68), inset 0 -1px 0 rgba(0,0,0,0.18), 0 14px 34px rgba(28,120,86,0.58)";}}}
            onMouseLeave={e=>{e.target.style.transform="none"; e.target.style.boxShadow=loading?"0 8px 20px rgba(28,120,86,0.24)":"inset 0 1.5px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 10px 30px rgba(28,120,86,0.50)";}}>
            {loading?"Signing in...":"Sign in to Admin →"}
          </button>

          {/* Demo creds */}
          <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(255,255,255,0.05)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.18)", borderRadius:14 }}>
            <div style={{ fontSize:10, color:A.textLt, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>Demo credentials</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:12, color:A.textMid }}>
                <div>📧 admin@rpsfields.in</div>
                <div>🔑 admin123</div>
              </div>
              <button data-magnetic onClick={()=>{ setEmail("admin@rpsfields.in"); setPassword("admin123"); setError(""); }}
                style={{ padding:"7px 14px", background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.12), 0 8px 28px rgba(0,0,0,0.22), 0 3px 10px rgba(82,183,136,0.3)", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                Fill →
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign:"center" }}>
          <NavLink to="/" style={{ color:A.textLt, fontSize:13, textDecoration:"none", fontWeight:600, fontFamily:"'Inter',sans-serif", transition:"color 0.2s" }}
            onMouseEnter={e=>e.target.style.color=A.green} onMouseLeave={e=>e.target.style.color=A.textLt}>
            ← Back to RPS Fields
          </NavLink>
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(()=>{ adminFetch("/admin/stats").then(d=>{ if(d.success) setStats(d.stats); }).catch(()=>{}); }, []);
  return (
    <AdminLayout title="📊 Dashboard Overview">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
        <StatCard icon="👥" label="Total Users"    value={stats?.totalUsers    ??"…"} sub={`${stats?.farmers??0} farmers · ${stats?.agents??0} agents`} />
        <StatCard icon="📦" label="Total Products" value={stats?.totalProducts??"…"} color={A.gold} />
        <StatCard icon="🛒" label="Total Orders"   value={stats?.totalOrders  ??"…"} color={A.blue} />
        <StatCard icon="💰" label="Total Revenue"  value={stats?`₹${stats.totalRevenue.toLocaleString("en-IN")}`:"…"} color={A.purple} />
      </div>
      <div style={{ background:"rgba(10,20,12,0.82)", backdropFilter:"blur(20px) saturate(180%)", WebkitBackdropFilter:"blur(20px) saturate(180%)", borderRadius:20, padding:24, border:"1px solid rgba(82,183,136,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.4)" }}>
        <h3 style={{ color:A.text, fontSize:16, fontWeight:700, margin:"0 0 16px", fontFamily:"'Inter',sans-serif" }}>Quick Links</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[["/admin/farmers","🌾 Farmer Ratings"],["/admin/products","📦 Products"],["/admin/users","👥 All Users"]].map(([to,lbl])=>(
            <NavLink key={to} to={to} style={{ display:"block", padding:"14px 16px", background:"rgba(82,183,136,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.2)", borderRadius:14, color:A.green, fontWeight:700, fontSize:14, textDecoration:"none", textAlign:"center", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.target.style.background="rgba(82,183,136,0.2)"; e.target.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.target.style.background="rgba(82,183,136,0.1)"; e.target.style.transform="none";}}>{lbl}</NavLink>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

// ── Admin Users ───────────────────────────────────────────────────────────────
export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [tab,   setTab]   = useState("all");
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState({});

  const load = (role) => {
    setLoading(true);
    const url = role&&role!=="all"?`/admin/users?role=${role}`:"/admin/users";
    adminFetch(url).then(d=>{ if(d.success) setUsers(d.users); }).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(tab); }, [tab]); // eslint-disable-line

  const setStatus = async (id, status) => {
    setActing(a=>({...a,[id]:true}));
    await adminFetch(`/admin/users/${id}/status`,{method:"PUT",body:JSON.stringify({status})});
    setUsers(u=>u.map(x=>(x._id===id||x.id===id)?{...x,status}:x));
    setActing(a=>{ const x={...a}; delete x[id]; return x; });
  };

  const roleColor = r=>r==="farmer"?A.gold:r==="agent"?A.blue:r==="admin"?A.red:A.green;

  return (
    <AdminLayout title="👥 User Management">
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap", padding:6, borderRadius:14, background:"rgba(82,183,136,0.06)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.1)", width:"fit-content" }}>
        {["all","farmer","agent","customer"].map(r=>(
          <button data-magnetic key={r} onClick={()=>setTab(r)} style={{ padding:"7px 16px", borderRadius:10, border:"none", background: tab===r?"rgba(82,183,136,0.28)":"transparent", color: tab===r?"#fff":A.textMid, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'Inter',sans-serif", boxShadow: tab===r?"0 3px 10px rgba(82,183,136,0.3)":"none", transition:"all 0.2s", textTransform:"capitalize" }}>
            {r==="all"?"All Users":r.charAt(0).toUpperCase()+r.slice(1)+"s"}
          </button>
        ))}
      </div>

      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Name","Email","Role","Location","Status","Actions"]}
          rows={users.map(u=>{
            const uid = u._id?.toString()||u.id?.toString();
            return [
              <span style={{ fontWeight:700, color:A.text }}>{u.fullName||u.name}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{u.email}</span>,
              <Badge label={u.role} color={roleColor(u.role)} />,
              <span style={{ color:A.textMid, fontSize:13 }}>{u.city||u.location||"—"}</span>,
              <Badge label={u.status||"active"} color={u.status==="banned"?A.red:u.status==="suspended"?A.orange:A.green} />,
              <div style={{ display:"flex", gap:5 }}>
                {u.role!=="admin"&&u.status!=="suspended"&&<button data-magnetic onClick={()=>setStatus(uid,"suspended")} disabled={acting[uid]} style={{ padding:"4px 10px", background:"rgba(249,115,22,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(249,115,22,0.3)", color:A.orange, borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700, transition:"all 0.2s" }}>Suspend</button>}
                {u.role!=="admin"&&u.status!=="banned"&&<button data-magnetic onClick={()=>setStatus(uid,"banned")} disabled={acting[uid]} style={{ padding:"4px 10px", background:"rgba(239,68,68,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700, transition:"all 0.2s" }}>Ban</button>}
                {u.status!=="active"&&<button data-magnetic onClick={()=>setStatus(uid,"active")} disabled={acting[uid]} style={{ padding:"4px 10px", background:"rgba(82,183,136,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.3)", color:A.green, borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700, transition:"all 0.2s" }}>Restore</button>}
              </div>,
            ];
          })}
        />
      )}
    </AdminLayout>
  );
}

// ── Admin Farmers ─────────────────────────────────────────────────────────────
export function AdminFarmersPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState({});

  useEffect(()=>{ adminFetch("/admin/farmers").then(d=>{ if(d.success) setFarmers(d.farmers); }).finally(()=>setLoading(false)); }, []);

  const setStatus = async (id, status) => {
    setActing(a=>({...a,[id]:true}));
    await adminFetch(`/admin/users/${id}/status`,{method:"PUT",body:JSON.stringify({status})});
    setFarmers(f=>f.map(u=>(u._id===id||u.id===id)?{...u,status}:u));
    setActing(a=>{ const x={...a}; delete x[id]; return x; });
  };

  const qColor = q=>q==="Excellent"?A.green:q==="Average"?A.gold:q==="Warning"?A.orange:q==="Poor quality"?A.red:A.textLt;

  return (
    <AdminLayout title="🌾 Farmer Quality Monitoring">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Farmer","Location","Avg Rating","Quality","Orders","Reviews","Status","Actions"]}
          rows={farmers.map(f=>{
            const fid = f._id?.toString()||f.id?.toString();
            return [
              <span style={{ fontWeight:700, color:A.text }}>{f.fullName||f.name}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{f.city||f.location||"—"}</span>,
              <span style={{ fontWeight:900, color:qColor(f.qualityLabel), fontSize:18, fontFamily:"'Inter',sans-serif" }}>{f.avgRating>0?f.avgRating.toFixed(1):"—"}</span>,
              <Badge label={f.qualityLabel||"No ratings"} color={qColor(f.qualityLabel)} />,
              <span style={{ color:A.textMid }}>{f.totalOrders}</span>,
              <span style={{ color:A.textMid }}>{f.totalRatings}</span>,
              <Badge label={f.status||"active"} color={f.status==="banned"?A.red:f.status==="suspended"?A.orange:A.green} />,
              <div style={{ display:"flex", gap:5 }}>
                {f.status!=="suspended"&&<button data-magnetic onClick={()=>setStatus(fid,"suspended")} disabled={acting[fid]} style={{ padding:"4px 10px", background:"rgba(249,115,22,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(249,115,22,0.3)", color:A.orange, borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700 }}>Suspend</button>}
                {f.status!=="banned"&&<button data-magnetic onClick={()=>setStatus(fid,"banned")} disabled={acting[fid]} style={{ padding:"4px 10px", background:"rgba(239,68,68,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700 }}>Ban</button>}
                {f.status!=="active"&&<button data-magnetic onClick={()=>setStatus(fid,"active")} disabled={acting[fid]} style={{ padding:"4px 10px", background:"rgba(82,183,136,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.3)", color:A.green, borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700 }}>Restore</button>}
              </div>,
            ];
          })}
        />
      )}
    </AdminLayout>
  );
}

// ── Admin Agents ──────────────────────────────────────────────────────────────
export function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState({});

  useEffect(()=>{ adminFetch("/admin/users?role=agent").then(d=>{ if(d.success) setAgents(d.users); }).finally(()=>setLoading(false)); }, []);

  const setStatus = async (id, status) => {
    setActing(a=>({...a,[id]:true}));
    await adminFetch(`/admin/users/${id}/status`,{method:"PUT",body:JSON.stringify({status})});
    setAgents(u=>u.map(x=>(x._id===id||x.id===id)?{...x,status}:x));
    setActing(a=>{ const x={...a}; delete x[id]; return x; });
  };

  return (
    <AdminLayout title="🏢 Agents Management">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Name","Email","Mobile","Location","Status","Actions"]}
          rows={agents.map(a=>{
            const aid = a._id?.toString()||a.id?.toString();
            return [
              <span style={{ fontWeight:700, color:A.text }}>{a.fullName||a.name}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{a.email}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{a.mobile||a.phone||"—"}</span>,
              <span style={{ color:A.textMid, fontSize:13 }}>{a.city||a.location||"—"}</span>,
              <Badge label={a.status||"active"} color={a.status==="banned"?A.red:a.status==="suspended"?A.orange:A.green} />,
              <div style={{ display:"flex", gap:5 }}>
                {a.status!=="suspended"&&<button data-magnetic onClick={()=>setStatus(aid,"suspended")} disabled={acting[aid]} style={{ padding:"4px 10px", background:"rgba(249,115,22,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(249,115,22,0.3)", color:A.orange, borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700 }}>Suspend</button>}
                {a.status!=="banned"&&<button data-magnetic onClick={()=>setStatus(aid,"banned")} disabled={acting[aid]} style={{ padding:"4px 10px", background:"rgba(239,68,68,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700 }}>Ban</button>}
                {a.status!=="active"&&<button data-magnetic onClick={()=>setStatus(aid,"active")} disabled={acting[aid]} style={{ padding:"4px 10px", background:"rgba(82,183,136,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.3)", color:A.green, borderRadius:20, cursor:"pointer", fontSize:11, fontFamily:"'Inter',sans-serif", fontWeight:700 }}>Restore</button>}
              </div>,
            ];
          })}
        />
      )}
    </AdminLayout>
  );
}

// ── Admin Products ────────────────────────────────────────────────────────────
export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = () => { setLoading(true); adminFetch("/admin/products").then(d=>{ if(d.success) setProducts(d.products); }).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Remove this product?")) return;
    await adminFetch(`/admin/products/${id}`,{method:"DELETE"});
    load();
  };

  return (
    <AdminLayout title="📦 Products Management">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Product","Farmer","Agent","Category","Price","Stock","Rating","Actions"]}
          rows={products.map(p=>[
            <span style={{ fontWeight:700, color:A.text }}>{p.name}</span>,
            <span style={{ color:A.textMid, fontSize:13 }}>{p.farmerId?.fullName||p.farmerId?.name||"—"}</span>,
            <span style={{ color:A.textMid, fontSize:13 }}>{p.agentId?.fullName||p.agentId?.name||"—"}</span>,
            <Badge label={p.category} color={A.textMid} />,
            <span style={{ color:A.green, fontWeight:700, fontFamily:"'Inter',sans-serif" }}>₹{p.pricePerKg||p.price}</span>,
            <span style={{ color:(p.quantity||p.qty)<20?A.gold:A.textMid, fontFamily:"'Inter',sans-serif" }}>{p.quantity||p.qty} kg</span>,
            <span style={{ color:A.gold, fontFamily:"'Inter',sans-serif" }}>{p.avgRating>0?`⭐ ${p.avgRating}`:"—"}</span>,
            <button data-magnetic onClick={()=>remove(p._id||p.id)} style={{ padding:"4px 12px", background:"rgba(239,68,68,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", borderRadius:20, cursor:"pointer", fontSize:12, fontFamily:"'Inter',sans-serif", fontWeight:700, transition:"all 0.2s" }}>Remove</button>,
          ])}
        />
      )}
    </AdminLayout>
  );
}

// ── Admin Orders ──────────────────────────────────────────────────────────────
export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ adminFetch("/admin/orders").then(d=>{ if(d.success) setOrders(d.orders); }).finally(()=>setLoading(false)); }, []);

  const statusColor = s=>s==="delivered"?A.green:s==="cancelled"?A.red:A.blue;

  return (
    <AdminLayout title="🛒 Orders Management">
      {loading ? <div style={{ textAlign:"center", padding:60, color:A.textLt }}>Loading...</div> : (
        <AdminTable
          headers={["Order ID","Customer","Items","Total","City","Date","Status"]}
          rows={orders.map(o=>[
            <span style={{ fontWeight:700, color:A.text, fontSize:12, fontFamily:"monospace" }}>{(o._id||o.id)?.toString().slice(-10)}</span>,
            <span style={{ color:A.textMid }}>{o.customerId?.name||o.customerId?.fullName||"—"}</span>,
            <span style={{ color:A.textMid }}>{(o.items||[]).length} items</span>,
            <span style={{ color:A.green, fontWeight:700, fontFamily:"'Inter',sans-serif" }}>₹{o.totalPrice||o.total}</span>,
            <span style={{ color:A.textMid }}>{o.city}</span>,
            <span style={{ color:A.textLt, fontSize:12 }}>{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>,
            <Badge label={o.status} color={statusColor(o.status)} />,
          ])}
        />
      )}
    </AdminLayout>
  );
}

export default AdminLoginPage;
