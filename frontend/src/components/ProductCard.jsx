import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const tk = TK(dark);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Support both API shape (farmerName/farmerLocation) and legacy shape (farmer/location)
  const farmerName = product.farmerName || product.farmer || "Farmer";
  const farmerLoc  = product.farmerLocation || product.location || "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background:tk.bgCard, borderRadius:16, overflow:"hidden", border:`1px solid ${tk.border}`, boxShadow:hovered?tk.shadowLg:tk.shadow, transform:hovered?"translateY(-5px)":"none", transition:"all 0.25s ease" }}>
      {/* Image */}
      <div style={{ position:"relative", height:200, overflow:"hidden", background:tk.bgMuted }}>
        {!imgError
          ? <img src={product.img} alt={product.name} onError={() => setImgError(true)}
              style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s", transform:hovered?"scale(1.08)":"scale(1)" }} />
          : <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:56 }}>🌿</div>
        }
        <div style={{ position:"absolute", top:10, right:10, background:"rgba(27,67,50,0.85)", backdropFilter:"blur(4px)", color:"#74c69d", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
          {product.category}
        </div>
        {product.qty < 10 && product.qty > 0 && (
          <div style={{ position:"absolute", top:10, left:10, background:"rgba(231,76,60,0.9)", color:"#fff", borderRadius:12, padding:"3px 8px", fontSize:10, fontWeight:700 }}>
            LOW STOCK
          </div>
        )}
        {product.qty === 0 && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontWeight:800, fontSize:14, background:"rgba(0,0,0,0.7)", padding:"6px 14px", borderRadius:8 }}>OUT OF STOCK</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:16 }}>
        <div style={{ fontWeight:800, fontSize:15, color:tk.text, marginBottom:3 }}>{product.name}</div>
        <div style={{ fontSize:12, color:tk.textLt, marginBottom:10 }}>
          🧑‍🌾 {farmerName}{farmerLoc ? ` · 📍 ${farmerLoc}` : ""}
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:tk.green7, marginBottom:12 }}>
          ₹{product.price}<span style={{ fontSize:12, fontWeight:400, color:tk.textLt }}>/kg</span>
        </div>
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          disabled={product.qty === 0}
          style={{ width:"100%", padding:"10px", background: product.qty === 0 ? tk.bgMuted : `linear-gradient(135deg,${tk.green6},${tk.green7})`, color: product.qty === 0 ? tk.textLt : "#fff", border:"none", borderRadius:10, cursor: product.qty === 0 ? "not-allowed" : "pointer", fontWeight:700, fontSize:14, fontFamily:"inherit", transition:"opacity 0.2s" }}>
          {product.qty === 0 ? "Out of Stock" : "View Details →"}
        </button>
      </div>
    </div>
  );
}
