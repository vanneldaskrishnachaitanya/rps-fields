import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Vegetables", "Fruits", "Dairy", "Dry Fruits", "Grains"];

const EMPTY_FORM = {
  name: "", category: "Vegetables", price: "", qty: "", description: "", img: "",
};

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null); // product id being edited
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Guard: non-farmers get redirected
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "farmer") { navigate("/"); return; }
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const d = await authFetch(`/products?farmerId=${user.id}`);
      if (d.success) setProducts(d.products);
    } catch (e) { setApiError(e.message); }
    finally { setLoading(false); }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const d = await authFetch("/farmer/orders");
      if (d.success) setOrders(d.orders);
    } catch (e) { setApiError(e.message); }
    finally { setLoading(false); }
  };

  const switchTab = (t) => {
    setTab(t);
    if (t === "orders") loadOrders();
    if (t === "products") loadProducts();
  };

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name required";
    if (!form.category) errs.category = "Category required";
    if (!form.price || isNaN(form.price) || +form.price <= 0) errs.price = "Enter a valid price";
    if (!form.qty || isNaN(form.qty) || +form.qty <= 0) errs.qty = "Enter a valid quantity";
    if (!form.description.trim()) errs.description = "Description required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true); setApiError("");
    try {
      const body = { ...form, price: parseFloat(form.price), qty: parseInt(form.qty) };
      let d;
      if (editing) {
        d = await authFetch(`/products/${editing}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        d = await authFetch("/products", { method: "POST", body: JSON.stringify(body) });
      }
      if (!d.success) throw new Error(d.error);
      setSuccessMsg(editing ? "Product updated!" : "Product added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setForm(EMPTY_FORM); setEditing(null); setShowForm(false);
      loadProducts();
    } catch (e) { setApiError(e.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: String(p.price), qty: String(p.qty), description: p.description, img: p.img || "" });
    setEditing(p.id);
    setShowForm(true);
    setFormErrors({});
    setApiError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      const d = await authFetch(`/products/${id}`, { method: "DELETE" });
      if (!d.success) throw new Error(d.error);
      setSuccessMsg("Product deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
      loadProducts();
    } catch (e) { setApiError(e.message); }
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM); setEditing(null);
    setShowForm(false); setFormErrors({}); setApiError("");
  };

  // Styled input
  const inp = (hasErr, extra = {}) => ({
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${hasErr ? "#e74c3c" : tk.border}`,
    background: hasErr ? "#fff0f0" : tk.bgInput,
    color: tk.text, fontSize: 14, boxSizing: "border-box",
    outline: "none", fontFamily: "inherit", ...extra,
  });

  const label = (text) => (
    <label style={{ display: "block", fontWeight: 700, fontSize: 11, color: tk.textMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" }}>{text}</label>
  );

  if (!user) return null;

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f)", padding: "44px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ color: "#74c69d", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>🌾 Farmer Dashboard</div>
              <h1 style={{ color: "#fff", fontSize: 32, fontFamily: "'Playfair Display',Georgia,serif", margin: 0 }}>Welcome, {user.fullName}</h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginTop: 4 }}>📍 {user.city} · {user.email}</p>
            </div>
            <button
              onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); setFormErrors({}); setApiError(""); switchTab("products"); }}
              style={{ background: "linear-gradient(135deg,#d4a017,#c49010)", color: "#1b4332", border: "none", padding: "12px 22px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "inherit", boxShadow: "0 4px 14px rgba(212,160,23,0.4)" }}>
              + Add New Product
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
            {[
              ["📦", products.length, "Total Products"],
              ["🛒", orders.length, "Orders Received"],
              ["💰", `₹${products.reduce((s, p) => s + p.price, 0)}`, "Avg Price Sum"],
              ["📊", products.reduce((s, p) => s + p.qty, 0) + " kg", "Stock Available"],
            ].map(([icon, val, lbl]) => (
              <div key={lbl} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 4 }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        {/* Success / Error alerts */}
        {successMsg && (
          <div style={{ background: "#d4edda", border: "1px solid #28a745", borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#155724", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            ✅ {successMsg}
          </div>
        )}
        {apiError && (
          <div style={{ background: "#fff0f0", border: "1px solid #e74c3c", borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#c0392b", fontWeight: 600 }}>
            ⚠ {apiError}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[["products", "📦 My Products"], ["orders", "🛒 Orders Received"]].map(([id, lbl]) => (
            <button key={id} onClick={() => switchTab(id)}
              style={{ padding: "10px 22px", borderRadius: 10, border: `2px solid ${tab === id ? tk.green7 : tk.border}`, background: tab === id ? tk.green7 : "transparent", color: tab === id ? "#fff" : tk.textMid, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all 0.2s" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── ADD / EDIT FORM ── */}
        {showForm && tab === "products" && (
          <div style={{ background: tk.bgCard, borderRadius: 20, padding: 32, marginBottom: 28, boxShadow: tk.shadowLg, border: `2px solid ${tk.green6}` }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: tk.text, marginBottom: 20 }}>
              {editing ? "✏️ Edit Product" : "➕ Add New Product"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <div style={{ marginBottom: 16 }}>
                {label("Product Name *")}
                <input style={inp(!!formErrors.name)} placeholder="e.g. Fresh Tomatoes" value={form.name} onChange={setF("name")} />
                {formErrors.name && <div style={{ color: "#e74c3c", fontSize: 11, marginTop: 3 }}>⚠ {formErrors.name}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                {label("Category *")}
                <select style={inp(!!formErrors.category)} value={form.category} onChange={setF("category")}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                {label("Price per kg (₹) *")}
                <input type="number" style={inp(!!formErrors.price)} placeholder="e.g. 45" value={form.price} onChange={setF("price")} min="1" />
                {formErrors.price && <div style={{ color: "#e74c3c", fontSize: 11, marginTop: 3 }}>⚠ {formErrors.price}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                {label("Available Quantity (kg) *")}
                <input type="number" style={inp(!!formErrors.qty)} placeholder="e.g. 100" value={form.qty} onChange={setF("qty")} min="1" />
                {formErrors.qty && <div style={{ color: "#e74c3c", fontSize: 11, marginTop: 3 }}>⚠ {formErrors.qty}</div>}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              {label("Description *")}
              <textarea style={{ ...inp(!!formErrors.description), minHeight: 90, resize: "vertical" }} placeholder="Describe your product — freshness, origin, farming method..." value={form.description} onChange={setF("description")} />
              {formErrors.description && <div style={{ color: "#e74c3c", fontSize: 11, marginTop: 3 }}>⚠ {formErrors.description}</div>}
            </div>

            <div style={{ marginBottom: 20 }}>
              {label("Product Image URL (optional)")}
              <input style={inp(false)} placeholder="https://images.unsplash.com/..." value={form.img} onChange={setF("img")} />
              {form.img && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={form.img} alt="preview" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: `1px solid ${tk.border}` }} onError={e => e.target.style.display = "none"} />
                  <span style={{ fontSize: 12, color: tk.textLt }}>Image preview</span>
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, color: tk.textMid, marginBottom: 6 }}>Or pick a quick Unsplash image:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    ["Vegetables", "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80"],
                    ["Fruits", "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80"],
                    ["Grains", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"],
                    ["Dairy", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80"],
                    ["Dry Fruits", "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80"],
                  ].map(([lbl, url]) => (
                    <button key={lbl} onClick={() => setForm(f => ({ ...f, img: url }))}
                      style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${tk.border}`, background: form.img === url ? tk.green6 : tk.bgMuted, color: form.img === url ? "#fff" : tk.textMid, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleSave} disabled={saving}
                style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : (editing ? "💾 Update Product" : "✅ Add Product")}
              </button>
              <button onClick={cancelForm}
                style={{ background: "transparent", border: `1.5px solid ${tk.border}`, color: tk.textMid, padding: "12px 22px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          loading ? (
            <div style={{ textAlign: "center", padding: 60, color: tk.textLt }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
              <p>Loading your products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, background: tk.bgCard, borderRadius: 16, border: `1px solid ${tk.border}` }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>🌾</div>
              <h3 style={{ color: tk.text, marginBottom: 8 }}>No products yet</h3>
              <p style={{ color: tk.textLt, marginBottom: 24 }}>Add your first product to start selling.</p>
              <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM); }}
                style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
                + Add First Product
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {products.map(p => (
                <div key={p.id} style={{ background: tk.bgCard, borderRadius: 16, overflow: "hidden", border: `1px solid ${tk.border}`, boxShadow: tk.shadow }}>
                  <div style={{ height: 160, overflow: "hidden", background: tk.bgMuted, position: "relative" }}>
                    <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                    <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(27,67,50,0.85)", color: "#74c69d", borderRadius: 16, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{p.category}</div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: tk.text, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: tk.textLt, marginBottom: 10, lineHeight: 1.5 }}>{p.description.slice(0, 80)}...</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: tk.green7 }}>₹{p.price}<span style={{ fontSize: 12, fontWeight: 400, color: tk.textLt }}>/kg</span></span>
                      <span style={{ fontSize: 13, color: p.qty < 20 ? "#e74c3c" : tk.textMid, fontWeight: 700 }}>📦 {p.qty} kg left</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleEdit(p)}
                        style={{ flex: 1, padding: "9px", background: "transparent", border: `1.5px solid ${tk.green7}`, color: tk.green7, borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        style={{ flex: 1, padding: "9px", background: "transparent", border: "1.5px solid #e74c3c", color: "#e74c3c", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          loading ? (
            <div style={{ textAlign: "center", padding: 60, color: tk.textLt }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div><p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, background: tk.bgCard, borderRadius: 16, border: `1px solid ${tk.border}` }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>🛒</div>
              <h3 style={{ color: tk.text, marginBottom: 8 }}>No orders yet</h3>
              <p style={{ color: tk.textLt }}>Orders will appear here when customers buy your products.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map(ord => (
                <div key={ord.id} style={{ background: tk.bgCard, borderRadius: 14, padding: 22, boxShadow: tk.shadow, border: `1px solid ${tk.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: tk.text }}>{ord.id}</div>
                      <div style={{ fontSize: 12, color: tk.textLt, marginTop: 2 }}>{new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ background: "#d4edda", color: "#155724", borderRadius: 20, padding: "4px 14px", fontWeight: 700, fontSize: 12 }}>✓ {ord.status}</span>
                      <div style={{ fontSize: 20, fontWeight: 800, color: tk.green7, marginTop: 4 }}>₹{ord.total}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {ord.items.map((item, i) => (
                      <div key={i} style={{ background: tk.bgMuted, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: tk.textMid, border: `1px solid ${tk.border}` }}>
                        {item.name} × {item.qty} kg — <strong>₹{item.price * item.qty}</strong>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: tk.textLt }}>
                    📦 Delivering to: {ord.city} · 📞 {ord.phone}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
