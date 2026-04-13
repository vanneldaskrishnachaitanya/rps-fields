import { useParams, useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  { key:"processing",       icon:"📋", label:"Order Confirmed",   desc:"Your order has been confirmed and is being prepared" },
  { key:"picked_up",        icon:"📦", label:"Picked Up",          desc:"Order picked up by delivery agent" },
  { key:"out_for_delivery", icon:"🚚", label:"Out for Delivery",   desc:"On the way to your doorstep!" },
  { key:"delivered",        icon:"✅", label:"Delivered",           desc:"Order delivered successfully" },
];

const STATUS_ORDER = { processing:0, picked_up:1, out_for_delivery:2, delivered:3 };

export default function TrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { authFetch } = useAuth();
  const tk = TK(dark);

  const [tracking,   setTracking]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dots,       setDots]       = useState("");
  const intervalRef = useRef(null);

  // Animated dots for "live" feel
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 600);
    return () => clearInterval(t);
  }, []);

  const fetchTracking = useCallback(async (isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true); else setLoading(true);
      const data = await authFetch(`/orders/${orderId}/track`);
      if (data.success) {
        setTracking(data.tracking);
        setLastUpdate(new Date());
      } else throw new Error(data.error || "Failed to fetch tracking");
    } catch (err) {
      setError(err.message);
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  }, [authFetch, orderId]);

  useEffect(() => {
    fetchTracking();
    // Poll every 8 seconds for real-time updates
    intervalRef.current = setInterval(() => fetchTracking(true), 8000);
    return () => clearInterval(intervalRef.current);
  }, [fetchTracking]);

  const fmt = (v) => {
    if (!v) return null;
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
  };

  if (loading) return (
    <div style={{ background:tk.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, color:tk.textMid }}>
      <div style={{ fontSize:48, animation:"float 2s ease-in-out infinite" }}>🚚</div>
      <p style={{ fontFamily:"'Inter',sans-serif", fontSize:15 }}>Loading tracking{dots}</p>
    </div>
  );

  if (error) return (
    <div style={{ background:tk.bg, minHeight:"100vh", padding:"40px var(--page-px,clamp(16px,4vw,48px))" }}>
      <div style={{ maxWidth:600, margin:"0 auto", padding:24, background:tk.bgCard, borderRadius:20, border:"2px solid rgba(239,68,68,0.4)" }}>
        <div style={{ color:"#ef4444", fontSize:16, fontWeight:700, marginBottom:10 }}>⚠️ Error</div>
        <p style={{ color:tk.textMid, marginBottom:20 }}>{error}</p>
        <button onClick={()=>navigate("/orders")} style={{ padding:"10px 22px", background:"linear-gradient(135deg,#2d6a4f,#52b788)", border:"none", borderRadius:10, cursor:"pointer", color:"#fff", fontFamily:"'Inter',sans-serif", fontWeight:700 }}>← Back to Orders</button>
      </div>
    </div>
  );

  if (!tracking) return null;

  const { deliveryStatus, deliveryOTP, otpVerified, estimatedDeliveryTime, actualDeliveryTime, timeline, progressPercentage } = tracking;
  const isDelivered = deliveryStatus === "delivered";
  const isOutForDelivery = deliveryStatus === "out_for_delivery" || deliveryStatus === "picked_up";

  const progressColor = isDelivered ? "#10b981" : isOutForDelivery ? "#3b82f6" : "#f59e0b";

  return (
    <div style={{ background:tk.bg, minHeight:"100vh", padding:"18px var(--page-px,clamp(16px,4vw,48px)) 40px" }}>
      <div style={{ maxWidth:"var(--content-max,1320px)", margin:"0 auto" }}>

        {/* Back */}
        <button onClick={()=>navigate("/orders")} style={{ marginBottom:12, padding:"8px 16px", background:dark?"rgba(59,130,246,0.12)":"rgba(37,99,235,0.1)", border:"1px solid rgba(59,130,246,0.35)", color:"#3b82f6", borderRadius:12, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700, display:"inline-flex", alignItems:"center", gap:8, fontSize:13 }}>
          ← Back to Orders
        </button>

        {/* Header */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
            <h1 style={{ fontSize:26, fontWeight:800, color:tk.text, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>Live Order Tracking</h1>
            {/* Live indicator */}
            <div style={{ display:"flex", alignItems:"center", gap:5, background:dark?"rgba(16,185,129,0.12)":"rgba(5,150,105,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:20, padding:"3px 10px" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 1.5s infinite" }} />
              <span style={{ fontSize:10, color:"#10b981", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>LIVE{refreshing ? dots : ""}</span>
            </div>
          </div>
          <p style={{ color:tk.textLt, fontSize:13, fontFamily:"'Inter',sans-serif" }}>
            Order #{orderId?.slice(-8).toUpperCase()}
            {lastUpdate && <span style={{ marginLeft:12, color:tk.textLt }}>· Updated {lastUpdate.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>}
          </p>
        </div>

        {/* Delivered banner */}
        {isDelivered && (
          <div className="anim-fade-up" style={{ background:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.08))", border:"2px solid rgba(16,185,129,0.4)", borderRadius:20, padding:"16px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ fontSize:44 }}>🎉</div>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:"#10b981", marginBottom:4, fontFamily:"'Inter',sans-serif" }}>Order Delivered!</div>
              <div style={{ color:tk.textMid, fontSize:13 }}>
                {actualDeliveryTime ? `Delivered on ${fmt(actualDeliveryTime)}` : "Thank you for your order!"}
              </div>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))", gap:12, marginBottom:12 }}>
        {/* Progress card */}
        <div style={{ background:tk.bgCard, borderRadius:20, padding:18, border:`1px solid ${tk.border}`, boxShadow:tk.shadow }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:12, color:tk.textLt, marginBottom:4, fontFamily:"'Inter',sans-serif" }}>Delivery Progress</div>
              <div style={{ fontSize:28, fontWeight:900, color:progressColor, fontFamily:"'Inter',sans-serif" }}>{Math.min(100,Math.round(progressPercentage || 0))}%</div>
            </div>
            <div style={{ background:`${progressColor}18`, border:`1px solid ${progressColor}44`, borderRadius:10, padding:"6px 14px", display:"inline-flex", alignItems:"center", gap:6 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:progressColor, display:"inline-block", animation: isDelivered ? "none" : "pulse 2s infinite" }} />
              <span style={{ fontSize:12, fontWeight:700, color:progressColor, textTransform:"capitalize", fontFamily:"'Inter',sans-serif" }}>
                {deliveryStatus?.replace(/_/g," ")}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ width:"100%", height:10, background:tk.bgMuted, borderRadius:5, overflow:"hidden", marginBottom:14 }}>
            <div style={{ width:`${Math.min(100, progressPercentage||0)}%`, height:"100%", background:`linear-gradient(90deg,${progressColor},${progressColor}bb)`, borderRadius:5, transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:`0 0 8px ${progressColor}66` }} />
          </div>

          {/* Est delivery */}
          <div style={{ display:"grid", gridTemplateColumns:actualDeliveryTime?"1fr 1fr":"1fr", gap:12 }}>
            <div>
              <div style={{ fontSize:11, color:tk.textLt, marginBottom:4, fontFamily:"'Inter',sans-serif" }}>ESTIMATED DELIVERY</div>
              <div style={{ fontSize:14, fontWeight:700, color:tk.text, fontFamily:"'Inter',sans-serif" }}>{fmt(estimatedDeliveryTime) || "Within 24 hours"}</div>
            </div>
            {actualDeliveryTime && (
              <div>
                <div style={{ fontSize:11, color:tk.textLt, marginBottom:4, fontFamily:"'Inter',sans-serif" }}>DELIVERED AT</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#10b981", fontFamily:"'Inter',sans-serif" }}>{fmt(actualDeliveryTime)}</div>
              </div>
            )}
          </div>
        </div>

        {/* 4-step visual tracker */}
        <div style={{ background:tk.bgCard, borderRadius:20, padding:"16px 16px", border:`1px solid ${tk.border}` }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:tk.text, marginBottom:14, fontFamily:"'Inter',sans-serif" }}>Delivery Status</h2>
          <div style={{ display:"flex", alignItems:"flex-start", gap:0, overflowX:"auto", paddingBottom:8 }}>
            {STEPS.map((step, idx) => {
              const done = STATUS_ORDER[deliveryStatus] >= idx;
              const active = STATUS_ORDER[deliveryStatus] === idx;
              return (
                <div key={step.key} style={{ display:"flex", alignItems:"flex-start", flex:1, minWidth:80 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                    {/* Circle */}
                    <div style={{
                      width:40, height:40, borderRadius:"50%",
                      background: done ? (isDelivered && idx===3 ? "#10b981" : "#52b788") : tk.bgMuted,
                      border: active ? `3px solid ${progressColor}` : done ? "none" : `2px solid ${tk.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, flexShrink:0, zIndex:1,
                      boxShadow: active ? `0 0 16px ${progressColor}66` : done ? "0 4px 12px rgba(82,183,136,0.3)" : "none",
                      transition:"all 0.4s ease",
                      animation: active && !isDelivered ? "pulse 2s infinite" : "none",
                    }}>
                      {done ? (idx===3?"🎉":step.icon) : <span style={{ color:tk.textLt, fontSize:14, fontWeight:700 }}>{idx+1}</span>}
                    </div>

                    {/* Label */}
                    <div style={{ textAlign:"center", marginTop:8, padding:"0 4px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color: done ? tk.text : tk.textLt, fontFamily:"'Inter',sans-serif", lineHeight:1.3 }}>{step.label}</div>
                      {/* Time from timeline */}
                      {timeline?.[idx]?.time && (
                        <div style={{ fontSize:9, color:tk.textLt, marginTop:3, fontFamily:"'Inter',sans-serif" }}>{fmt(timeline[idx].time)}</div>
                      )}
                    </div>
                  </div>

                  {/* Connector line */}
                  {idx < STEPS.length - 1 && (
                    <div style={{
                      height:3, flex:1, marginTop:18,
                      background: STATUS_ORDER[deliveryStatus] > idx
                        ? "linear-gradient(90deg,#52b788,#74c69d)"
                        : tk.bgMuted,
                      borderRadius:2, transition:"background 0.4s ease",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </div>

        {/* OTP Card — shown when out for delivery and not yet verified */}
        {(isOutForDelivery) && !otpVerified && deliveryOTP && (
          <div className="anim-fade-up" style={{ background: dark?"rgba(245,158,11,0.08)":"rgba(245,158,11,0.06)", border:"2px solid rgba(245,158,11,0.5)", borderRadius:20, padding:"16px 18px", marginBottom:12, boxShadow:"0 4px 24px rgba(245,158,11,0.15)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:22 }}>🔐</span>
              <div style={{ fontSize:16, fontWeight:800, color:"#f59e0b", fontFamily:"'Inter',sans-serif" }}>Delivery OTP</div>
            </div>
            <p style={{ color:tk.textMid, marginBottom:12, fontSize:13, lineHeight:1.5, fontFamily:"'Inter',sans-serif" }}>
              Your delivery is on the way! Share this OTP <strong>only with the delivery agent</strong> when they arrive at your door. Delivery will be confirmed after OTP verification.
            </p>
            <div style={{ background:dark?"rgba(0,0,0,0.3)":"rgba(255,255,255,0.8)", borderRadius:16, padding:"14px 16px", textAlign:"center", border:`1px solid rgba(245,158,11,0.3)` }}>
              <div style={{ fontSize:11, color:tk.textLt, marginBottom:10, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Your One-Time Password</div>
              <div style={{ fontSize:36, fontWeight:900, color:"#f59e0b", letterSpacing:8, fontFamily:"'JetBrains Mono','Courier New',monospace" }}>
                {deliveryOTP}
              </div>
              <div style={{ fontSize:11, color:tk.textLt, marginTop:12, fontFamily:"'Inter',sans-serif" }}>🔒 Do not share with anyone other than the delivery agent</div>
            </div>
          </div>
        )}

        {/* OTP verified badge */}
        {otpVerified && (
          <div style={{ background:dark?"rgba(16,185,129,0.08)":"rgba(5,150,105,0.06)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:14, padding:"12px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>✅</span>
            <span style={{ color:"#10b981", fontWeight:700, fontSize:13, fontFamily:"'Inter',sans-serif" }}>OTP verified — delivery confirmed!</span>
          </div>
        )}

        {/* Timeline detail */}
        <div style={{ background:tk.bgCard, borderRadius:20, padding:18, border:`1px solid ${tk.border}` }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:tk.text, marginBottom:14, fontFamily:"'Inter',sans-serif" }}>📋 Detailed Timeline</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {(timeline||[]).map((item, idx) => (
              <div key={idx} style={{ display:"flex", gap:12, paddingBottom: idx < (timeline.length-1) ? 16 : 0, position:"relative" }}>
                {idx < timeline.length - 1 && (
                  <div style={{ position:"absolute", left:19, top:40, width:2, height:"calc(100% - 16px)", background: item.status==="completed" ? "linear-gradient(to bottom,#52b788,#74c69d44)" : tk.bgMuted }} />
                )}
                  <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0, zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                  background: item.status==="completed" ? "#52b788" : item.status==="active" ? progressColor : tk.bgMuted,
                  boxShadow: item.status==="completed" ? "0 4px 12px rgba(82,183,136,0.35)" : "none",
                }}>
                  {item.status==="completed" ? "✓" : item.status==="active" ? "⟳" : <span style={{ color:tk.textLt, fontSize:12 }}>{idx+1}</span>}
                </div>
                <div style={{ flex:1, paddingTop:4 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:tk.text, marginBottom:2, fontFamily:"'Inter',sans-serif" }}>{item.name}</div>
                  {item.time && fmt(item.time) && (
                    <div style={{ fontSize:12, color:tk.textLt, fontFamily:"'Inter',sans-serif" }}>{fmt(item.time)}</div>
                  )}
                  <div style={{ fontSize:11, fontWeight:600, marginTop:3, textTransform:"capitalize", fontFamily:"'Inter',sans-serif",
                    color: item.status==="completed" ? "#52b788" : item.status==="active" ? progressColor : tk.textLt,
                  }}>{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual refresh */}
        <div style={{ textAlign:"center", marginTop:14 }}>
          <button onClick={()=>fetchTracking(true)} disabled={refreshing} style={{ padding:"10px 24px", background:dark?"rgba(59,130,246,0.1)":"rgba(37,99,235,0.08)", border:"1px solid rgba(59,130,246,0.4)", color:"#3b82f6", borderRadius:12, cursor:refreshing?"not-allowed":"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:13, opacity:refreshing?0.7:1 }}>
            {refreshing ? `🔄 Refreshing${dots}` : "🔄 Refresh Now"}
          </button>
          <div style={{ fontSize:11, color:tk.textLt, marginTop:8, fontFamily:"'Inter',sans-serif" }}>Auto-refreshes every 8 seconds</div>
        </div>
      </div>
    </div>
  );
}
