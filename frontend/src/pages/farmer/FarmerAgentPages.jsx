// FarmerAgentPages.jsx — Liquid Glass redesign
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export function FarmerNav() {
  const { dark } = useTheme(); const tk = TK(dark);
  const links = [
    ["📊","Dashboard","/farmer/dashboard"],
    ["📦","Products","/farmer/products"],
    ["🛒","Orders","/farmer/orders"],
    ["🤝","Find Agents","/farmer/find-agents"],
    ["🤝","My Agents","/farmer/my-agents"],
    ["💰","Revenue","/farmer/revenue"],
  ];
  return (
    <div style={{
      display:"flex", gap:6, marginBottom:28, flexWrap:"wrap",
      padding:8, borderRadius:16,
      background: dark ? "rgba(12,22,15,0.7)" : "rgba(240,247,242,0.8)",
      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
      border:`1px solid ${dark?"rgba(82,183,136,0.12)":"rgba(255,255,255,0.9)"}`,
      boxShadow: dark?"0 4px 20px rgba(0,0,0,0.3)":"0 4px 20px rgba(0,0,0,0.06)",
    }}>
      {links.map(([icon,lbl,to])=>(
        <NavLink key={to} to={to} style={({isActive})=>({
          padding:"8px 14px", borderRadius:10, textDecoration:"none",
          fontWeight:600, fontSize:13, fontFamily:"'Inter',sans-serif",
          background: isActive ? "linear-gradient(135deg,#40916c,#2d6a4f)" : "transparent",
          color: isActive ? "#fff" : tk.textMid,
          boxShadow: isActive ? "0 3px 12px rgba(64,145,108,0.3)" : "none",
          border: "none",
          transition:"all 0.2s",
        })}>{icon} {lbl}</NavLink>
      ))}
    </div>
  );
}

function GlassBanner({ title, sub, gradient = "linear-gradient(135deg,#040d06,#0d2b1a,#1b4332)" }) {
  return (
    <div style={{ background:gradient, padding:"52px 20px 44px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 25% 50%,rgba(82,183,136,0.12),transparent 55%),radial-gradient(circle at 75% 30%,rgba(116,198,157,0.08),transparent 50%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"-30%", right:"-10%", width:300, height:300, borderRadius:"50%", background:"rgba(82,183,136,0.05)", pointerEvents:"none" }} />
      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", animation:"fadeUp 0.5s ease both" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(82,183,136,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.25)", borderRadius:20, padding:"4px 14px", marginBottom:14 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ color:"#74c69d", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>🌾 Farmer Dashboard</span>
        </div>
        <h1 style={{ color:"#fff", fontSize:"clamp(24px,4vw,34px)", fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 6px", fontWeight:700 }}>{title}</h1>
        {sub && <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:0 }}>{sub}</p>}
      </div>
    </div>
  );
}

function GlassCard({ dark, tk, children, style = {} }) {
  return (
    <div style={{
      background: dark ? "rgba(12,22,15,0.82)" : "rgba(255,255,255,0.82)",
      backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
      border:`1px solid ${dark?"rgba(82,183,136,0.12)":"rgba(255,255,255,0.9)"}`,
      boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.45)" : "0 4px 24px rgba(0,0,0,0.08)",
      borderRadius:20,
      ...style,
    }}>{children}</div>
  );
}

export function FindAgentsPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [agents, setAgents]       = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [connecting, setConnecting] = useState({});
  const [status, setStatus]       = useState({});

  useEffect(() => {
    authFetch(`/partnerships/agents${search?`?search=${encodeURIComponent(search)}`:""}`)
      .then(d => setAgents(d.agents||[]))
      .finally(()=>setLoading(false));
  }, [search]); // eslint-disable-line

  const handleConnect = async (agentId) => {
    setConnecting(c=>({...c,[agentId]:true}));
    const d = await authFetch("/partnerships/request",{method:"POST",body:JSON.stringify({agentId})});
    setConnecting(c=>({...c,[agentId]:false}));
    setStatus(s=>({...s,[agentId]:d.success?"sent":(d.error||"error")}));
  };

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      <GlassBanner title="🤝 Find Agents" sub="Connect with verified agents to list your produce" />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px 100px" }}>
        <FarmerNav />

        {/* Glass search */}
        <div style={{ position:"relative", marginBottom:28 }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search agents by name or location..."
            style={{ width:"100%", padding:"13px 16px 13px 46px", borderRadius:14, border:`1px solid ${dark?"rgba(82,183,136,0.15)":"rgba(0,0,0,0.08)"}`, background: dark?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.8)", backdropFilter:"blur(12px)", color:tk.text, fontSize:15, fontFamily:"'Inter',sans-serif", outline:"none", boxSizing:"border-box", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}
            onFocus={e=>{e.target.style.borderColor="#52b788"; e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)";}}
            onBlur={e=>{e.target.style.borderColor=dark?"rgba(82,183,136,0.15)":"rgba(0,0,0,0.08)"; e.target.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)";}}
          />
        </div>

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
            {[1,2,3,4,5,6].map(i=><div key={i} style={{ height:200, borderRadius:20, background: dark?"rgba(12,22,15,0.5)":"rgba(255,255,255,0.4)", backdropFilter:"blur(8px)", animation:"shimmer 1.5s ease infinite" }} />)}
          </div>
        ) : agents.length===0 ? (
          <GlassCard dark={dark} tk={tk} style={{ padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>🔍</div>
            <h3 style={{ color:tk.text, fontSize:20, marginBottom:8, fontFamily:"'Playfair Display',Georgia,serif" }}>No agents found</h3>
            <p style={{ color:tk.textLt }}>{search?`No results for "${search}"`:"No agents available right now."}</p>
          </GlassCard>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
            {agents.map((a,i) => {
              const aid = a._id?.toString()||a.id?.toString();
              const st  = status[aid];
              return (
                <div key={aid} style={{
                  background: dark?"rgba(12,22,15,0.78)":"rgba(255,255,255,0.78)",
                  backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
                  border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.9)"}`,
                  boxShadow: dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.08)",
                  borderRadius:20, padding:22,
                  transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  animation:`fadeUp 0.5s ease ${i*0.06}s both`,
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow=dark?"0 12px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.3)":"0 12px 36px rgba(0,0,0,0.14), 0 0 0 1px rgba(59,130,246,0.2)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.08)";}}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#3b82f6,#1e40af)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 14px rgba(59,130,246,0.3)", flexShrink:0 }}>🏢</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:tk.text }}>{a.fullName||a.name}</div>
                      <div style={{ fontSize:11, color:tk.textLt, marginTop:2 }}>Agent · {(aid?.slice(-8)).toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:18 }}>
                    {[[" 📞",a.mobile||a.phone],["📧",a.email],["📍",a.location||a.city]].map(([icon,val])=>val&&(
                      <div key={icon} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:tk.textMid, background: dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", borderRadius:8, padding:"6px 10px" }}>
                        <span>{icon}</span><span>{val}</span>
                      </div>
                    ))}
                  </div>
                  <button disabled={!!connecting[aid]||st==="sent"} onClick={()=>handleConnect(aid)} style={{
                    width:"100%", padding:"11px", borderRadius:50, cursor:(connecting[aid]||st==="sent")?"not-allowed":"pointer",
                    fontWeight:700, fontSize:14, fontFamily:"'Inter',sans-serif",
                    ...(st==="sent"
                      ? { background:"rgba(16,185,129,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(16,185,129,0.3)", color:"#10b981" }
                      : { background:"linear-gradient(135deg,#3b82f6,#1e40af)", border:"none", color:"#fff", boxShadow:"0 4px 14px rgba(59,130,246,0.35)" }),
                    transition:"all 0.22s",
                    opacity:connecting[aid]?0.7:1,
                  }}
                    onMouseEnter={e=>{if(!connecting[aid]&&st!=="sent") e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";}}
                  >
                    {connecting[aid]?"Sending...":st==="sent"?"✓ Request Sent":typeof st==="string"&&st?`⚠ ${st}`:"🤝 Connect"}
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

export function PartneredAgentsPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/partnerships/my-agents").then(d=>setAgents(d.agents||[])).finally(()=>setLoading(false));
  }, []); // eslint-disable-line

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      <GlassBanner title="🤝 My Partnered Agents" sub={`${agents.length} active partner${agents.length!==1?"s":""}`} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px 100px" }}>
        <FarmerNav />
        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
            {[1,2,3].map(i=><div key={i} style={{ height:180, borderRadius:20, background: dark?"rgba(12,22,15,0.5)":"rgba(255,255,255,0.4)", backdropFilter:"blur(8px)", animation:"shimmer 1.5s ease infinite" }} />)}
          </div>
        ) : agents.length===0 ? (
          <GlassCard dark={dark} tk={tk} style={{ padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>🤝</div>
            <h3 style={{ color:tk.text, fontSize:20, marginBottom:8, fontFamily:"'Playfair Display',Georgia,serif" }}>No partners yet</h3>
            <p style={{ color:tk.textLt, marginBottom:24 }}>Find agents to partner with and start selling.</p>
          </GlassCard>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
            {agents.map((a,i) => (
              <div key={a._id||a.id} style={{
                background: dark?"rgba(12,22,15,0.78)":"rgba(255,255,255,0.78)",
                backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
                border:`1px solid ${dark?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.9)"}`,
                boxShadow: dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.08)",
                borderRadius:20, padding:24, textAlign:"center",
                animation:`fadeUp 0.5s ease ${i*0.07}s both`,
                transition:"all 0.28s ease",
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=dark?"0 12px 36px rgba(0,0,0,0.5)":"0 12px 36px rgba(0,0,0,0.12)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.08)";}}
              >
                <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,#3b82f6,#1e40af)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 12px", boxShadow:"0 6px 18px rgba(59,130,246,0.3)" }}>🏢</div>
                <div style={{ fontWeight:700, fontSize:16, color:tk.text, marginBottom:4 }}>{a.fullName||a.name}</div>
                <div style={{ fontSize:11, color:tk.textLt, marginBottom:14 }}>Agent Partner</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[[" 📞",a.mobile||a.phone],["📧",a.email],["📍",a.location||a.city]].map(([icon,val])=>val&&(
                    <div key={icon} style={{ fontSize:12, color:tk.textMid, background: dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", borderRadius:8, padding:"6px 10px" }}>{icon} {val}</div>
                  ))}
                </div>
                <div style={{ marginTop:16, padding:"8px 14px", background:"rgba(16,185,129,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:50, color:"#10b981", fontSize:12, fontWeight:700 }}>
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
