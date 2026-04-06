import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Vegetables","Fruits","Dairy","Dry Fruits","Grains","Spices"];

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [form, setForm] = useState({ name:"", category:"Vegetables", unit:"kg", price:"", qty:"", description:"", img:"" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    authFetch(`/products/${id}`)
      .then(d => {
        if (d.success) {
          const p = d.product;
          setForm({ name:p.name, category:p.category, price:String(p.price), qty:String(p.qty), description:p.description, img:p.img||"" });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.price || +form.price <= 0) errs.price = "Valid price required";
    if (!form.qty || +form.qty <= 0) errs.qty = "Valid quantity required";
    if (!form.description.trim()) errs.description = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true); setApiError("");
    try {
      const d = await authFetch(`/products/${id}`, { method:"PUT", body:JSON.stringify({ ...form, unit:form.unit||"kg", price:parseFloat(form.price), qty:parseInt(form.qty) }) });
      if (!d.success) throw new Error(d.error);
      navigate("/farmer/products");
    } catch(e) { setApiError(e.message); }
    finally { setSaving(false); }
  };

  const inp = (hasErr, extra={}) => ({ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${hasErr?"#e74c3c":tk.border}`, background:hasErr?"#fff0f0":tk.bgInput, color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"'Inter',sans-serif", ...extra });
  const lbl = t => <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase" }}>{t}</label>;

  if (loading) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:tk.textLt }}><div style={{ fontSize:48, marginBottom:12 }}>🌿</div><p>Loading product...</p></div>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#2d6a4f)", padding:"44px 20px" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <Link to="/farmer/products" style={{ color:"#74c69d", fontSize:13, fontWeight:700, textDecoration:"none", marginBottom:12, display:"inline-block" }}>← Back to Products</Link>
          <h1 style={{ color:"#fff", fontSize:30, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>✏️ Edit Product</h1>
        </div>
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"36px 20px" }}>
        <div style={{ background:tk.bgCard, borderRadius:20, padding:36, boxShadow:tk.shadowLg, border:`2px solid ${tk.green6}` }}>

          {apiError && <div style={{ background:"#fff0f0", border:"1px solid #e74c3c", borderRadius:10, padding:"10px 14px", marginBottom:20, color:"#c0392b", fontWeight:600 }}>⚠ {apiError}</div>}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
            <div style={{ marginBottom:16 }}>
              {lbl("Product Name *")}
              <input style={inp(!!errors.name)} value={form.name} onChange={set("name")} />
              {errors.name && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.name}</div>}
            </div>
            <div style={{ marginBottom:16 }}>
              {lbl("Category *")}
              <select style={inp(false)} value={form.category} onChange={set("category")}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
              {lbl("Unit of Measurement *")}
              <select style={inp(false)} value={form.unit||"kg"} onChange={set("unit")}>
                {[["kg","🏋 kg — for produce sold by weight"],["litre","🥛 litre — for milk, oil, juice"],["piece","🥥 piece — per individual item"],["dozen","📦 dozen — 12 items"],["gram","⚖ gram — for spices (per 100g)"],["pack","📦 pack — sealed packs"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <div style={{ fontSize:11, color:tk.textLt, marginTop:4, fontStyle:"italic" }}>Tip: Use "litre" for milk/oil, "piece" for coconuts, "gram" for spices</div>
            </div>
            <div style={{ marginBottom:16 }}>
              {lbl(`Price per ${form.unit||"kg"} (₹) *`)}
              <input type="number" style={inp(!!errors.price)} min="1" value={form.price} onChange={set("price")} />
              {errors.price && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.price}</div>}
            </div>
            <div style={{ marginBottom:16 }}>
              {lbl(`Available Quantity (${form.unit||"kg"}) *`)}
              <input type="number" style={inp(!!errors.qty)} min="0" value={form.qty} onChange={set("qty")} />
              {errors.qty && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.qty}</div>}
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            {lbl("Description *")}
            <textarea style={{ ...inp(!!errors.description), minHeight:100, resize:"vertical" }} value={form.description} onChange={set("description")} />
            {errors.description && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.description}</div>}
          </div>
          <div style={{ marginBottom:24 }}>
            {lbl("Product Image URL")}
            <input style={inp(false)} value={form.img} onChange={set("img")} placeholder="https://..." />
            {form.img && <img src={form.img} alt="preview" style={{ width:72, height:72, objectFit:"cover", borderRadius:10, marginTop:10, border:`1px solid ${tk.border}` }} onError={e=>e.target.style.display="none"} />}
          </div>

          <div style={{ display:"flex", gap:12 }}>
            <button data-magnetic onClick={handleSave} disabled={saving} style={{ flex:1, padding:14, background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", borderRadius:10, cursor:saving?"not-allowed":"pointer", fontWeight:700, fontSize:15, fontFamily:"'Inter',sans-serif", opacity:saving?0.7:1 }}>
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
            <Link to="/farmer/products" style={{ flex:1, padding:14, background:"transparent", border:`1.5px solid ${tk.border}`, color:tk.textMid, borderRadius:10, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
