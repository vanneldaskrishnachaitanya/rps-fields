import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

function FarmerNav({ active }) {
  const { dark } = useTheme(); const tk = TK(dark);
  const links = [
    ["📊 Dashboard",         "/farmer/dashboard"],
    ["📦 My Products",       "/farmer/products"],
    ["🛒 Orders",            "/farmer/orders"],
    ["🤝 Find Agents",       "/farmer/find-agents"],
    ["🤝 My Agents",         "/farmer/my-agents"],
    ["💰 Revenue",           "/farmer/revenue"],
  ];
  return (
    <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
      {links.map(([lbl, to]) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          padding:"9px 16px", borderRadius:8, textDecoration:"none",
          border:`1.5px solid ${isActive?"#40916c":"rgba(64,145,108,0.3)"}`,
          background:isActive?"#40916c":"transparent",
          color:isActive?"#fff":tk.textMid,
          fontWeight:700, fontSize:13,
        })}>{lbl}</NavLink>
      ))}
    </div>
  );
}
export { FarmerNav };

// ── Find Agents Page ──────────────────────────────────────────────────────────
export function FindAgentsPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch, user } = useAuth();
  const [agents, setAgents]       = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [connecting, setConnecting] = useState({});
  const [status, setStatus]       = useState({});

  useEffect(() => {
    authFetch(`/partnerships/agents${search ? `?search=${encodeURIComponent(search)}` : ""}`)
      .then(d => setAgents(d.agents||[]))
      .finally(()=>setLoading(false));
  }, [search]);

  const handleConnect = async (agentId) => {
    setConnecting(c => ({...c,[agentId]:true}));
    const d = await authFetch("/partnerships/request", { method:"POST", body:JSON.stringify({agentId}) });
    setConnecting(c => ({...c,[agentId]:false}));
    setStatus(s => ({...s,[agentId]: d.success ? "sent" : (d.error || "error")}));
  };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"44px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 8px" }}>🌾 FARMER DASHBOARD</p>
          <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 16px" }}>🤝 Find Agents</h1>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search agents by name or location..."
            style={{ width:"100%", maxWidth:480, padding:"12px 16px", borderRadius:12, border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:14, outline:"none", fontFamily:"inherit" }} />
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 20px" }}>
        <FarmerNav active="/farmer/find-agents" />
        {loading ? <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>Loading agents...</div>
        : agents.length===0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
            <p style={{ color:tk.textLt }}>No agents found{search ? ` for "${search}"` : ""}.</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
            {agents.map(a => {
              const aid = a._id?.toString()||a.id?.toString();
              const st  = status[aid];
              return (
                <div key={aid} style={{ background:tk.bgCard, borderRadius:16, padding:24, border:`1px solid ${tk.border}`, boxShadow:tk.shadow }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                    <div style={{ width:50, height:50, borderRadius:"50%", background:"rgba(59,130,246,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🏢</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:15, color:tk.text }}>{a.fullName||a.name}</div>
                      <div style={{ fontSize:12, color:tk.textMid }}>ID: {aid?.slice(-8)}</div>
                    </div>
                  </div>
                  {[["📞",a.mobile||a.phone],["📧",a.email],["📍",a.location||a.city]].map(([icon,val])=>val&&(
                    <div key={icon} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:tk.textMid }}>
                      <span>{icon}</span><span>{val}</span>
                    </div>
                  ))}
                  <button
                    disabled={!!connecting[aid] || st==="sent"}
                    onClick={() => handleConnect(aid)}
                    style={{ marginTop:14, width:"100%", padding:"10px", background:st==="sent" ? "#d4edda" : "linear-gradient(135deg,#3b82f6,#1e40af)", color:st==="sent" ? "#155724" : "#fff", border:"none", borderRadius:10, cursor:(connecting[aid]||st==="sent")?"not-allowed":"pointer", fontWeight:700, fontFamily:"inherit", opacity:connecting[aid]?0.7:1 }}>
                    {connecting[aid] ? "Sending..." : st==="sent" ? "✓ Request Sent" : typeof st==="string" && st ? `⚠ ${st}` : "🤝 Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Partnered Agents Page ─────────────────────────────────────────────────────
export function PartneredAgentsPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/partnerships/my-agents")
      .then(d => setAgents(d.agents||[]))
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"44px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 8px" }}>🌾 FARMER DASHBOARD</p>
          <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>🤝 My Partnered Agents</h1>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 20px" }}>
        <FarmerNav active="/farmer/my-agents" />
        {loading ? <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>Loading...</div>
        : agents.length===0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🤝</div>
            <p style={{ color:tk.textLt, marginBottom:16 }}>No partnered agents yet.</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
            {agents.map(a => (
              <div key={a._id||a.id} style={{ background:tk.bgCard, borderRadius:16, padding:24, border:`1.5px solid #3b82f640`, boxShadow:tk.shadow }}>
                <div style={{ fontSize:44, textAlign:"center", marginBottom:10 }}>🏢</div>
                <div style={{ fontWeight:800, fontSize:16, color:tk.text, textAlign:"center", marginBottom:4 }}>{a.fullName||a.name}</div>
                <div style={{ fontSize:12, color:tk.textMid, textAlign:"center", marginBottom:14 }}>ID: {(a._id||a.id)?.toString().slice(-8)}</div>
                {[["📞",a.mobile||a.phone],["📧",a.email],["📍",a.location||a.city]].map(([icon,val])=>val&&(
                  <div key={icon} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:tk.textMid }}>
                    <span style={{ background:"rgba(59,130,246,0.12)", borderRadius:6, padding:"3px 8px" }}>{icon} {val}</span>
                  </div>
                ))}
                <div style={{ marginTop:14, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:10, padding:"8px 12px", textAlign:"center", color:"#3b82f6", fontSize:12, fontWeight:700 }}>
                  ✓ Active Partner
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
