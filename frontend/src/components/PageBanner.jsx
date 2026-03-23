export default function PageBanner({ title, sub, emoji, gradient = "linear-gradient(135deg,#0d2b1a,#1b4332,#2d6a4f)" }) {
  return (
    <div style={{
      background: gradient,
      padding: "52px 20px 44px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,rgba(82,183,136,0.12),transparent 55%),radial-gradient(circle at 80% 50%,rgba(116,198,157,0.08),transparent 55%)", pointerEvents:"none" }} />
      <div style={{ position:"relative", animation:"fadeUp 0.5s ease both" }}>
        {emoji && <div style={{ fontSize:40, marginBottom:12 }}>{emoji}</div>}
        <h1 style={{ color:"#fff", fontSize:"clamp(26px,4vw,38px)", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8, fontWeight:700 }}>{title}</h1>
        {sub && <p style={{ color:"rgba(255,255,255,0.7)", fontSize:15, maxWidth:500, margin:"0 auto" }}>{sub}</p>}
      </div>
    </div>
  );
}
