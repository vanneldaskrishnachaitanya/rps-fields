import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { AgentNav } from "./AgentDashboard";

const CATEGORIES = ["Vegetables","Fruits","Dairy","Dry Fruits","Grains","Spices","Other"];
const QUICK_IMGS = [
  ["Vegetables","https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80"],
  ["Fruits","https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80"],
  ["Grains","https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"],
  ["Dairy","https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80"],
  ["Dry Fruits","https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80"],
  ["Spices","https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"],
];

export default function AgentAddProductPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();

  const [form, setForm] = useState({ name:"", category:"Vegetables", pricePerKg:"", quantity:"", description:"", farmerId:"", image:"" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [farmers, setFarmers] = useState([]);

  // Load partnered farmers only
  useEffect(() => {
    authFetch("/partnerships/my-farmers")
      .then(d => setFarmers(d.farmers || []))
      .catch(()=>{});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name     = "Required";
    if (!form.pricePerKg || +form.pricePerKg <= 0) errs.pricePerKg = "Valid price required";
    if (!form.quantity   || +form.quantity   <= 0) errs.quantity   = "Valid quantity required";
    if (!form.description.trim()) errs.description = "Required";
    if (!form.farmerId)       errs.farmerId  = "Select a farmer";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true); setApiError("");
    try {
      const d = await authFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name, category: form.category,
          pricePerKg: parseFloat(form.pricePerKg),
          quantity: parseInt(form.quantity),
          description: form.description,
          farmerId: form.farmerId,
          image: form.image || undefined,
        }),
      });
      if (!d.success) throw new Error(d.error);
      navigate("/agent/products");
    } catch (e) { setApiError(e.message); }
    finally { setSaving(false); }
  };

  const inp = (hasErr, extra={}) => ({
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1.5px solid ${hasErr?"#e74c3c":tk.border}`,
    background:hasErr?"#fff0f0":tk.bgInput,
    color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit",
    ...extra,
  });
  const lbl = t => <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.4px" }}>{t}</label>;

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1e3a8a,#3b82f6)", padding:"44px 20px" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 8px" }}>🏢 AGENT DASHBOARD</p>
          <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>➕ Add New Product</h1>
        </div>
      </div>

      <div style={{ maxWidth:780, margin:"0 auto", padding:"30px 20px" }}>
        <AgentNav active="/agent/add-product" />

        {farmers.length === 0 && (
          <div style={{ background:"#fff3cd", border:"1px solid #ffc107", borderRadius:12, padding:"14px 18px", marginBottom:20, color:"#856404" }}>
            ⚠ You need to partner with farmers first before adding products.{" "}
            <span style={{ fontWeight:700, cursor:"pointer", textDecoration:"underline" }} onClick={()=>navigate("/farmer/find-agents")}>Find farmers to partner with →</span>
          </div>
        )}

        <div style={{ background:tk.bgCard, borderRadius:20, padding:36, boxShadow:tk.shadowLg, border:`1px solid ${tk.border}` }}>
          {apiError && <div style={{ background:"#fff0f0", border:"1px solid #e74c3c", borderRadius:10, padding:"10px 14px", marginBottom:20, color:"#c0392b", fontWeight:600 }}>⚠ {apiError}</div>}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
            {/* Farmer select */}
            <div style={{ marginBottom:16, gridColumn:"1/-1" }}>
              {lbl("Select Farmer *")}
              <select style={inp(!!errors.farmerId)} value={form.farmerId} onChange={set("farmerId")}>
                <option value="">— Choose a partnered farmer —</option>
                {farmers.map(f => (
                  <option key={f._id||f.id} value={f._id||f.id}>{f.fullName||f.name} · {f.location||f.city}</option>
                ))}
              </select>
              {errors.farmerId && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.farmerId}</div>}
            </div>

            <div style={{ marginBottom:16 }}>
              {lbl("Product Name *")}
              <input style={inp(!!errors.name)} placeholder="e.g. Fresh Tomatoes" value={form.name} onChange={set("name")} />
              {errors.name && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.name}</div>}
            </div>
            <div style={{ marginBottom:16 }}>
              {lbl("Category *")}
              <select style={inp(false)} value={form.category} onChange={set("category")}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
              {lbl("Price per KG (₹) *")}
              <input type="number" style={inp(!!errors.pricePerKg)} placeholder="e.g. 45" min="1" value={form.pricePerKg} onChange={set("pricePerKg")} />
              {errors.pricePerKg && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.pricePerKg}</div>}
            </div>
            <div style={{ marginBottom:16 }}>
              {lbl("Available Quantity (KG) *")}
              <input type="number" style={inp(!!errors.quantity)} placeholder="e.g. 100" min="1" value={form.quantity} onChange={set("quantity")} />
              {errors.quantity && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.quantity}</div>}
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            {lbl("Product Description *")}
            <textarea style={{ ...inp(!!errors.description), minHeight:100, resize:"vertical" }} placeholder="Freshness, origin, farming method..." value={form.description} onChange={set("description")} />
            {errors.description && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.description}</div>}
          </div>

          <div style={{ marginBottom:24 }}>
            {lbl("Product Image URL (optional)")}
            <input style={inp(false)} placeholder="https://images.unsplash.com/..." value={form.image} onChange={set("image")} />
            {form.image && <img src={form.image} alt="preview" style={{ width:70, height:70, objectFit:"cover", borderRadius:10, marginTop:10, border:`1px solid ${tk.border}` }} onError={e=>e.target.style.display="none"} />}
            <div style={{ marginTop:8 }}>
              <span style={{ fontSize:11, color:tk.textMid, marginRight:8 }}>Quick pick:</span>
              {QUICK_IMGS.map(([lbl2, url]) => (
                <button key={lbl2} onClick={() => setForm(f=>({...f,image:url}))}
                  style={{ marginRight:6, marginTop:4, padding:"3px 10px", borderRadius:6, border:`1px solid ${tk.border}`, background:form.image===url?tk.green6:tk.bgMuted, color:form.image===url?"#fff":tk.textMid, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                  {lbl2}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", gap:12 }}>
            <button onClick={handleSubmit} disabled={saving || farmers.length===0}
              style={{ flex:1, padding:14, background:"linear-gradient(135deg,#3b82f6,#1e40af)", color:"#fff", border:"none", borderRadius:10, cursor:(saving||farmers.length===0)?"not-allowed":"pointer", fontWeight:700, fontSize:15, fontFamily:"inherit", opacity:saving?0.7:1 }}>
              {saving ? "Adding..." : "✅ Add Product to Catalog"}
            </button>
            <button onClick={()=>navigate("/agent/products")}
              style={{ flex:1, padding:14, background:"transparent", border:`1.5px solid ${tk.border}`, color:tk.textMid, borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:15, fontFamily:"inherit" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
