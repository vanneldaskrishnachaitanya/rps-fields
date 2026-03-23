import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

function Banner({ title, sub, emoji }) {
  useTheme();
  return (
    <div style={{ background:"linear-gradient(135deg,#0d2b1a,#1b4332,#2d6a4f)", padding:"56px 20px", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 30% 50%,rgba(82,183,136,0.1),transparent 55%)", pointerEvents:"none" }} />
      <div style={{ position:"relative", animation:"fadeUp 0.5s ease both" }}>
        {emoji && <div style={{ fontSize:44, marginBottom:14 }}>{emoji}</div>}
        <h1 style={{ color:"#fff", fontSize:"clamp(26px,4vw,40px)", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8 }}>{title}</h1>
        {sub && <p style={{ color:"rgba(255,255,255,0.7)", fontSize:15 }}>{sub}</p>}
      </div>
    </div>
  );
}

export function AboutPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <Banner title="About RPS Fields" sub="Bridging the gap between Indian farmers and consumers since 2023" emoji="🌾" />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"60px 20px 100px" }}>
        <div style={{ background:tk.bgCard, borderRadius:24, padding:40, border:`1px solid ${tk.border}`, marginBottom:24, animation:"fadeUp 0.5s ease both" }}>
          <h2 style={{ fontSize:22, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:14 }}>🌱 Our Mission</h2>
          <p style={{ color:tk.textMid, lineHeight:1.9, fontSize:15 }}>
            RPS Fields was created to eliminate the lengthy supply chain between Indian farmers and end consumers. By connecting them directly, we ensure farmers receive fairer prices while consumers get fresher, more nutritious produce at better rates — a genuine win for everyone.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
          {[["🌾","For Farmers",["List unlimited products","Set your own prices","Access thousands of customers","Weekly payment settlements"]],
            ["🛒","For Customers",["Farm-fresh quality guaranteed","Direct pricing, no markup","Know your farmer personally","Seasonal & organic options"]]
          ].map(([icon,title,pts])=>(
            <div key={title} style={{ background:tk.bgCard, borderRadius:20, padding:28, border:`1px solid ${tk.border}`, animation:"fadeUp 0.5s ease 0.1s both" }}>
              <div style={{ width:52, height:52, borderRadius:14, background: dark?"#1c3525":"#e8f5ee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16 }}>{icon}</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:tk.text, marginBottom:14 }}>{title}</h3>
              {pts.map(pt=>(
                <div key={pt} style={{ display:"flex", gap:10, marginBottom:9, fontSize:13, color:tk.textMid }}>
                  <span style={{ color:"#52b788", fontWeight:700, flexShrink:0 }}>✓</span>{pt}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ background:"linear-gradient(135deg,#0d2b1a,#1b4332)", borderRadius:24, padding:40, textAlign:"center", animation:"fadeUp 0.5s ease 0.2s both" }}>
          <h3 style={{ color:"#fff", fontSize:22, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:28 }}>Our Impact</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {[["500+","Farmers"],["12k+","Customers"],["₹2Cr+","Farmer Earnings"],["15+","States"]].map(([n,l])=>(
              <div key={l}>
                <div style={{ fontSize:30, fontWeight:900, color:"#74c69d", fontFamily:"'Playfair Display',Georgia,serif" }}>{n}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const inp = { width:"100%", padding:"12px 16px", borderRadius:12, border:`1.5px solid ${tk.border}`, background:tk.bgInput, color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"'Inter',sans-serif", transition:"all 0.2s" };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <Banner title="Contact Us" sub="We'd love to hear from you" emoji="📬" />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 20px 100px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:40 }}>
          <div style={{ animation:"slideLeft 0.5s ease both" }}>
            <h3 style={{ fontSize:20, fontWeight:800, color:tk.text, marginBottom:24 }}>Get in Touch</h3>
            {[["📧","Email","support@rpsfields.in"],["📞","Phone","+91 98765 43210"],["📍","Address","Hyderabad, Telangana, India"],["🕘","Hours","Mon–Sat, 9am–6pm IST"]].map(([icon,lbl,val])=>(
              <div key={lbl} style={{ display:"flex", gap:16, marginBottom:24, padding:"16px 18px", background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}`, transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#52b788"; e.currentTarget.style.boxShadow=tk.shadow;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=tk.border; e.currentTarget.style.boxShadow="none";}}>
                <div style={{ fontSize:22, flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight:700, color:tk.text, marginBottom:2, fontSize:13 }}>{lbl}</div>
                  <div style={{ color:tk.textMid, fontSize:14 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          {sent ? (
            <div style={{ textAlign:"center", padding:"60px 40px", background:tk.bgCard, borderRadius:24, border:`1px solid ${tk.border}`, animation:"scaleIn 0.4s ease" }}>
              <div style={{ fontSize:64, marginBottom:16, animation:"bounce 0.6s ease" }}>✅</div>
              <h3 style={{ fontSize:24, color:tk.text, marginBottom:8, fontFamily:"'Playfair Display',Georgia,serif" }}>Message Sent!</h3>
              <p style={{ color:tk.textLt, marginBottom:24 }}>We'll get back to you within 24 hours.</p>
              <button onClick={()=>setSent(false)} style={{ background:"linear-gradient(135deg,#52b788,#2d6a4f)", color:"#fff", border:"none", padding:"12px 28px", borderRadius:50, cursor:"pointer", fontWeight:800, fontFamily:"'Inter',sans-serif" }}>Send Another</button>
            </div>
          ) : (
            <div style={{ background:tk.bgCard, borderRadius:24, padding:36, border:`1px solid ${tk.border}`, animation:"slideRight 0.5s ease both" }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:tk.text, marginBottom:24 }}>Send a Message</h3>
              {[["name","Name","text","Your full name"],["email","Email","email","you@email.com"],["subject","Subject","text","How can we help?"]].map(([k,l,t,ph])=>(
                <div key={k} style={{ marginBottom:16 }}>
                  <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</label>
                  <input type={t} style={inp} placeholder={ph} value={form[k]} onChange={set(k)}
                    onFocus={e=>{e.target.style.borderColor="#52b788"; e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)";}}
                    onBlur={e=>{e.target.style.borderColor=tk.border; e.target.style.boxShadow="none";}}
                  />
                </div>
              ))}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Message</label>
                <textarea style={{ ...inp, minHeight:110, resize:"vertical" }} placeholder="Your message..." value={form.message} onChange={set("message")} onFocus={e=>{e.target.style.borderColor="#52b788";}} onBlur={e=>{e.target.style.borderColor=tk.border;}} />
              </div>
              <button onClick={()=>form.name&&form.email&&form.message&&setSent(true)}
                style={{ background:"linear-gradient(135deg,#52b788,#2d6a4f)", color:"#fff", border:"none", width:"100%", padding:14, borderRadius:14, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", boxShadow:"0 6px 20px rgba(82,183,136,0.35)", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.target.style.transform="translateY(-1px)"; e.target.style.boxShadow="0 10px 28px rgba(82,183,136,0.5)";}}
                onMouseLeave={e=>{e.target.style.transform="none"; e.target.style.boxShadow="0 6px 20px rgba(82,183,136,0.35)";}}>
                Send Message →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StaticDoc({ title, emoji, children }) {
  const { dark } = useTheme(); const tk = TK(dark);
  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <Banner title={title} emoji={emoji} />
      <div style={{ maxWidth:780, margin:"0 auto", padding:"56px 20px 100px" }}>
        <div style={{ background:tk.bgCard, borderRadius:24, padding:44, border:`1px solid ${tk.border}`, color:tk.textMid, lineHeight:2, fontSize:15, animation:"fadeUp 0.5s ease both" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  return (
    <StaticDoc title="Privacy Policy" emoji="🔒">
      <p style={{ color:tk.textLt, marginBottom:20, fontSize:13 }}>Last Updated: January 1, 2025</p>
      <p style={{ marginBottom:16 }}>RPS Fields is committed to protecting your personal information. This policy describes what data we collect and how we use it.</p>
      {[["Information We Collect","We collect information you provide when creating an account, making purchases, or contacting us — including name, email, phone, and delivery address. We also collect usage data to improve our platform."],
        ["How We Use It","Your data is used to process orders, personalize your experience, and communicate about your account. We do not sell your personal data to third parties."],
        ["Contact","For privacy concerns, email us at privacy@rpsfields.in"]
      ].map(([h,p])=>(
        <div key={h} style={{ marginBottom:20 }}>
          <h4 style={{ color:"#52b788", marginBottom:8, fontWeight:800, fontSize:15 }}>{h}</h4>
          <p>{p}</p>
        </div>
      ))}
    </StaticDoc>
  );
}

export function TermsPage() {
  return (
    <StaticDoc title="Terms of Service" emoji="📄">
      <p style={{ marginBottom:16 }}>By using RPS Fields, you agree to these terms. Our platform connects farmers and customers for the direct purchase of agricultural products.</p>
      {[["User Responsibilities","Users must provide accurate information, not misuse the platform, and comply with all applicable laws. Farmers are responsible for product quality and accuracy of listings."],
        ["Payments & Refunds","All transactions are handled securely. Refunds are processed within 5–7 business days for eligible claims under our freshness guarantee."],
        ["Contact","Questions? Email legal@rpsfields.in"]
      ].map(([h,p])=>(
        <div key={h} style={{ marginBottom:20 }}>
          <h4 style={{ color:"#52b788", marginBottom:8, fontWeight:800, fontSize:15 }}>{h}</h4>
          <p>{p}</p>
        </div>
      ))}
    </StaticDoc>
  );
}

export function NotFoundPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const navigate = useNavigate();
  return (
    <div style={{ background:tk.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px", minHeight:"100%", animation:"fadeIn 0.5s ease" }}>
      <div style={{ fontSize:88, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🌿</div>
      <h2 style={{ fontSize:32, color:tk.text, marginBottom:10, fontFamily:"'Playfair Display',Georgia,serif" }}>Page Not Found</h2>
      <p style={{ color:tk.textLt, marginBottom:32, fontSize:15 }}>The page you're looking for doesn't exist.</p>
      <button onClick={()=>navigate("/")} style={{ background:"linear-gradient(135deg,#52b788,#2d6a4f)", color:"#fff", border:"none", padding:"14px 32px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", boxShadow:"0 6px 20px rgba(82,183,136,0.35)" }}>
        Back to Home →
      </button>
    </div>
  );
}
