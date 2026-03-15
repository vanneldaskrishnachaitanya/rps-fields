import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { AgentNav } from "./AgentDashboard";

// ── Shared banner header ──────────────────────────────────────────────────────
function AgentHeader({ title, sub }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#1e3a8a,#3b82f6)", padding:"44px 20px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 8px" }}>🏢 AGENT DASHBOARD</p>
        <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>{title}</h1>
        {sub && <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:"4px 0 0" }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Manage Products ───────────────────────────────────────────────────────────
export function AgentProductsPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    authFetch(`/products?agentId=${user?.id||user?._id}`)
      .then(d => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, [authFetch, user]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const d = await authFetch(`/products/${id}`, { method:"DELETE" });
    if (d.success) { setMsg("Deleted."); setTimeout(()=>setMsg(""),3000); load(); }
    else setMsg(d.error);
  };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <AgentHeader title="📦 My Products" sub={`${products.length} product${products.length!==1?"s":""} listed`} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 20px" }}>
        <AgentNav active="/agent/products" />
        {msg && <div style={{ background:"#d4edda", border:"1px solid #28a745", borderRadius:10, padding:"10px 16px", marginBottom:18, color:"#155724", fontWeight:700 }}>{msg}</div>}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
          <Link to="/agent/add-product" style={{ background:"linear-gradient(135deg,#3b82f6,#1e40af)", color:"#fff", padding:"11px 22px", borderRadius:10, fontWeight:700, fontSize:14, textDecoration:"none" }}>+ Add Product</Link>
        </div>
        {loading ? <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>Loading...</div>
        : products.length===0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:52, marginBottom:12 }}>📦</div>
            <h3 style={{ color:tk.text }}>No products yet</h3>
            <Link to="/agent/add-product" style={{ display:"inline-block", marginTop:14, background:"#3b82f6", color:"#fff", padding:"11px 22px", borderRadius:10, fontWeight:700, textDecoration:"none" }}>Add First Product</Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:18 }}>
            {products.map(p => (
              <div key={p._id||p.id} style={{ background:tk.bgCard, borderRadius:16, overflow:"hidden", border:`1px solid ${tk.border}`, boxShadow:tk.shadow }}>
                <div style={{ height:140, overflow:"hidden", background:tk.bgMuted, position:"relative" }}>
                  <img src={p.image||p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
                  <div style={{ position:"absolute", top:8, right:8, background:"rgba(27,67,50,0.85)", color:"#74c69d", borderRadius:12, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{p.category}</div>
                </div>
                <div style={{ padding:16 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:tk.text, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:tk.textMid, marginBottom:2 }}>🌾 {p.farmerName||p.farmerId?.fullName||p.farmerId?.name}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, fontSize:13 }}>
                    <span style={{ fontWeight:800, color:tk.green7, fontSize:17 }}>₹{p.pricePerKg||p.price}/kg</span>
                    <span style={{ color:tk.textMid }}>📦 {p.quantity||p.qty} kg</span>
                  </div>
                  {p.avgRating > 0 && <div style={{ fontSize:12, color:tk.gold, marginBottom:10 }}>{"⭐".repeat(Math.round(p.avgRating))} {p.avgRating} ({p.totalRatings})</div>}
                  <div style={{ display:"flex", gap:8 }}>
                    <Link to={`/agent/edit-product/${p._id||p.id}`} style={{ flex:1, padding:"9px", background:"transparent", border:`1.5px solid #3b82f6`, color:"#3b82f6", borderRadius:8, fontWeight:700, fontSize:13, textDecoration:"none", textAlign:"center" }}>✏️ Edit</Link>
                    <button onClick={() => handleDelete(p._id||p.id, p.name)} style={{ flex:1, padding:"9px", background:"transparent", border:"1.5px solid #ef4444", color:"#ef4444", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Agent Orders ──────────────────────────────────────────────────────────────
export function AgentOrdersPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/orders/agent/orders")
      .then(d => setOrders(d.orders||[]))
      .finally(()=>setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <AgentHeader title="🛒 Orders" sub={`${orders.length} order${orders.length!==1?"s":""}`} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 20px" }}>
        <AgentNav active="/agent/orders" />
        {loading ? <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>Loading...</div>
        : orders.length===0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🛒</div>
            <p style={{ color:tk.textLt }}>No orders yet.</p>
          </div>
        ) : orders.map(ord => (
          <div key={ord._id||ord.id} style={{ background:tk.bgCard, borderRadius:14, padding:22, marginBottom:14, boxShadow:tk.shadow, border:`1px solid ${tk.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:tk.text }}>{ord._id||ord.id}</div>
                <div style={{ fontSize:12, color:tk.textLt }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{ background:"#d4edda", color:"#155724", borderRadius:16, padding:"3px 12px", fontWeight:700, fontSize:12 }}>✓ {ord.status}</span>
                <div style={{ fontSize:20, fontWeight:800, color:"#3b82f6", marginTop:3 }}>₹{ord.totalPrice||ord.total}</div>
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
              {(ord.items||[]).map((item,i) => (
                <div key={i} style={{ background:tk.bgMuted, borderRadius:8, padding:"7px 12px", fontSize:13, color:tk.textMid, border:`1px solid ${tk.border}` }}>
                  {item.name} × {item.quantity||item.qty}kg — <strong>₹{item.totalPrice||(item.pricePerKg||item.price)*(item.quantity||item.qty)}</strong>
                </div>
              ))}
            </div>
            <div style={{ fontSize:12, color:tk.textLt }}>📦 {ord.deliveryAddress||ord.address}, {ord.city} · 📞 {ord.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Partnered Farmers ─────────────────────────────────────────────────────────
export function AgentFarmersPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/partnerships/my-farmers")
      .then(d => setFarmers(d.farmers||[]))
      .finally(()=>setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <AgentHeader title="🌾 Partnered Farmers" sub={`${farmers.length} farmer${farmers.length!==1?"s":""} partnered`} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 20px" }}>
        <AgentNav active="/agent/farmers" />
        {loading ? <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>Loading...</div>
        : farmers.length===0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🌾</div>
            <p style={{ color:tk.textLt, marginBottom:16 }}>No partnered farmers yet. Farmers will send you connect requests.</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
            {farmers.map(f => (
              <div key={f._id||f.id} style={{ background:tk.bgCard, borderRadius:16, padding:24, border:`1px solid ${tk.border}`, boxShadow:tk.shadow }}>
                <div style={{ fontSize:44, textAlign:"center", marginBottom:12 }}>🌾</div>
                <div style={{ fontWeight:800, fontSize:16, color:tk.text, textAlign:"center", marginBottom:4 }}>{f.fullName||f.name}</div>
                <div style={{ fontSize:12, color:tk.textMid, textAlign:"center", marginBottom:14 }}>ID: {(f._id||f.id)?.toString().slice(-8)}</div>
                {[["📞",f.mobile||f.phone],["📧",f.email],["📍",f.location||f.city]].map(([icon,val])=>val&&(
                  <div key={icon} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:tk.textMid }}>
                    <span>{icon}</span><span>{val}</span>
                  </div>
                ))}
                <button onClick={()=>navigate("/agent/add-product")}
                  style={{ marginTop:14, width:"100%", padding:"10px", background:"linear-gradient(135deg,#3b82f6,#1e40af)", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
                  + Add Product for This Farmer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Partnership Requests ──────────────────────────────────────────────────────
export function AgentRequestsPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [responding, setResponding] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    authFetch("/partnerships/pending")
      .then(d => setRequests(d.requests||[]))
      .finally(()=>setLoading(false));
  }, [authFetch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [load]);

  const respond = async (id, status) => {
    setResponding(r => ({...r,[id]:status}));
    await authFetch(`/partnerships/${id}/respond`, { method:"PUT", body:JSON.stringify({status}) });
    load();
    setResponding(r => { const x={...r}; delete x[id]; return x; });
  };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <AgentHeader title="📬 Partnership Requests" sub={`${requests.length} pending request${requests.length!==1?"s":""}`} />
      <div style={{ maxWidth:780, margin:"0 auto", padding:"30px 20px" }}>
        <AgentNav active="/agent/requests" />
        {loading ? <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>Loading...</div>
        : requests.length===0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:52, marginBottom:12 }}>📬</div>
            <p style={{ color:tk.textLt }}>No pending requests. Farmers will connect with you soon.</p>
          </div>
        ) : requests.map(req => {
          const farmer = req.farmerId || {};
          const busy   = responding[req._id];
          return (
            <div key={req._id} style={{ background:tk.bgCard, borderRadius:14, padding:24, marginBottom:14, border:`1px solid ${tk.border}`, boxShadow:tk.shadow }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16 }}>
                <div style={{ width:50, height:50, borderRadius:"50%", background:"rgba(52,211,153,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>🌾</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:16, color:tk.text }}>{farmer.fullName||farmer.name}</div>
                  <div style={{ fontSize:12, color:tk.textMid, marginTop:2 }}>ID: {(farmer._id||farmer.id)?.toString().slice(-8)}</div>
                </div>
                <span style={{ background:"rgba(251,191,36,0.2)", color:"#d97706", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700 }}>PENDING</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
                {[["📞",farmer.mobile||farmer.phone],["📧",farmer.email],["📍",farmer.location||farmer.city],["📅",new Date(req.createdAt).toLocaleDateString("en-IN")]].map(([icon,val])=>val&&(
                  <div key={icon} style={{ background:tk.bgMuted, borderRadius:8, padding:"8px 12px", fontSize:13, color:tk.textMid, border:`1px solid ${tk.border}` }}>
                    {icon} {val}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={()=>respond(req._id,"accepted")} disabled={!!busy}
                  style={{ flex:1, padding:"12px", background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", border:"none", borderRadius:10, cursor:busy?"not-allowed":"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit", opacity:busy?0.7:1 }}>
                  {busy==="accepted" ? "Accepting..." : "✓ Accept Partnership"}
                </button>
                <button onClick={()=>respond(req._id,"rejected")} disabled={!!busy}
                  style={{ flex:1, padding:"12px", background:"transparent", border:"1.5px solid #ef4444", color:"#ef4444", borderRadius:10, cursor:busy?"not-allowed":"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit" }}>
                  {busy==="rejected" ? "Rejecting..." : "✕ Reject"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Edit Product (agent) ──────────────────────────────────────────────────────
export function AgentEditProductPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const { id } = useParams();
  const [form, setForm] = useState({ name:"", category:"Vegetables", pricePerKg:"", quantity:"", description:"", image:"" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    authFetch(`/products/${id}`).then(d => {
      if (d.success) {
        const p = d.product;
        setForm({ name:p.name, category:p.category, pricePerKg:String(p.pricePerKg||p.price), quantity:String(p.quantity||p.qty), description:p.description, image:p.image||p.img||"" });
      }
    }).finally(()=>setLoading(false));
  }, [id]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setApiError("");
    try {
      const d = await authFetch(`/products/${id}`, { method:"PUT", body:JSON.stringify({ name:form.name, category:form.category, pricePerKg:parseFloat(form.pricePerKg), quantity:parseInt(form.quantity), description:form.description, image:form.image }) });
      if (!d.success) throw new Error(d.error);
      navigate("/agent/products");
    } catch(e) { setApiError(e.message); }
    finally { setSaving(false); }
  };

  const inp = (extra={}) => ({ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${tk.border}`, background:tk.bgInput, color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit", ...extra });
  const lbl = t => <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase" }}>{t}</label>;

  if (loading) return <div style={{ background:tk.bg, minHeight:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ textAlign:"center", color:tk.textLt }}><div style={{ fontSize:48, marginBottom:12 }}>🌿</div><p>Loading...</p></div></div>;

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <AgentHeader title="✏️ Edit Product" />
      <div style={{ maxWidth:760, margin:"0 auto", padding:"30px 20px" }}>
        <AgentNav active="/agent/products" />
        <div style={{ background:tk.bgCard, borderRadius:20, padding:36, boxShadow:tk.shadowLg, border:`2px solid #3b82f640` }}>
          {apiError && <div style={{ background:"#fff0f0", border:"1px solid #e74c3c", borderRadius:10, padding:"10px 14px", marginBottom:20, color:"#c0392b", fontWeight:600 }}>⚠ {apiError}</div>}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
            <div style={{ marginBottom:16 }}>{lbl("Product Name")}<input style={inp()} value={form.name} onChange={set("name")} /></div>
            <div style={{ marginBottom:16 }}>{lbl("Category")}<select style={inp()} value={form.category} onChange={set("category")}>{["Vegetables","Fruits","Dairy","Dry Fruits","Grains","Spices","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{ marginBottom:16 }}>{lbl("Price per KG (₹)")}<input type="number" style={inp()} value={form.pricePerKg} onChange={set("pricePerKg")} /></div>
            <div style={{ marginBottom:16 }}>{lbl("Quantity (KG)")}<input type="number" style={inp()} value={form.quantity} onChange={set("quantity")} /></div>
          </div>
          <div style={{ marginBottom:16 }}>{lbl("Description")}<textarea style={{ ...inp(), minHeight:100, resize:"vertical" }} value={form.description} onChange={set("description")} /></div>
          <div style={{ marginBottom:24 }}>
            {lbl("Image URL")}
            <input style={inp()} value={form.image} onChange={set("image")} />
            {form.image && <img src={form.image} alt="" style={{ width:70, height:70, objectFit:"cover", borderRadius:10, marginTop:10, border:`1px solid ${tk.border}` }} onError={e=>e.target.style.display="none"} />}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex:1, padding:14, background:"linear-gradient(135deg,#3b82f6,#1e40af)", color:"#fff", border:"none", borderRadius:10, cursor:saving?"not-allowed":"pointer", fontWeight:700, fontSize:15, fontFamily:"inherit", opacity:saving?0.7:1 }}>
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
            <button onClick={()=>navigate("/agent/products")} style={{ flex:1, padding:14, background:"transparent", border:`1.5px solid ${tk.border}`, color:tk.textMid, borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:15, fontFamily:"inherit" }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
