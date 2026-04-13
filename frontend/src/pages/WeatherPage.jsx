import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const WMO_CODES = {
  0:{label:"Clear Sky",emoji:"☀️"},1:{label:"Mainly Clear",emoji:"🌤️"},
  2:{label:"Partly Cloudy",emoji:"⛅"},3:{label:"Overcast",emoji:"☁️"},
  45:{label:"Foggy",emoji:"🌫️"},48:{label:"Icy Fog",emoji:"🌫️"},
  51:{label:"Light Drizzle",emoji:"🌦️"},53:{label:"Drizzle",emoji:"🌦️"},
  55:{label:"Heavy Drizzle",emoji:"🌧️"},61:{label:"Light Rain",emoji:"🌧️"},
  63:{label:"Rain",emoji:"🌧️"},65:{label:"Heavy Rain",emoji:"🌧️"},
  71:{label:"Light Snow",emoji:"🌨️"},73:{label:"Snow",emoji:"❄️"},
  75:{label:"Heavy Snow",emoji:"❄️"},80:{label:"Rain Showers",emoji:"🌦️"},
  81:{label:"Showers",emoji:"🌧️"},82:{label:"Violent Showers",emoji:"⛈️"},
  95:{label:"Thunderstorm",emoji:"⛈️"},96:{label:"Thunderstorm",emoji:"⛈️"},
  99:{label:"Thunderstorm",emoji:"⛈️"},
};
const getWMO = code => WMO_CODES[code] || {label:"Unknown",emoji:"🌡️"};
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const formatTime = iso => { const h = new Date(iso).getHours(); return `${h===0?12:h>12?h-12:h}${h>=12?"pm":"am"}`; };
const shortDay  = iso => DAYS[new Date(iso).getDay()];

const QUICK_CITIES = ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Vijayawada","Chennai","Bangalore","Mumbai","Delhi"];

const WeatherTooltip = ({ active, payload, label, unit="", dark }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background: dark?"rgba(8,18,10,0.92)":"rgba(27,67,50,0.92)", backdropFilter:"blur(12px)", border:"1px solid rgba(82,183,136,0.25)", borderRadius:12, padding:"10px 14px", fontSize:13 }}>
      <div style={{ color:"rgba(255,255,255,0.6)", marginBottom:4, fontSize:11 }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{ color:p.color||"#fff", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>{p.name}: {p.value}{unit}</div>
      ))}
    </div>
  );
};

export default function WeatherPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const [city,    setCity]    = useState("Hyderabad");
  const [input,   setInput]   = useState("Hyderabad");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("hourly");

  const fetchWeather = async cityName => {
    if (!cityName.trim()) return;
    setLoading(true); setError(""); setWeather(null);
    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`).then(r=>r.json());
      if (!geo.results?.length) { setError(`City "${cityName}" not found.`); setLoading(false); return; }
      const { latitude, longitude, name, country } = geo.results[0];
      const wx = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index` +
        `&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max` +
        `&timezone=auto&forecast_days=7`
      ).then(r=>r.json());
      setWeather({...wx, cityName:name, country});
      setCity(name);
    } catch { setError("Failed to fetch weather."); }
    setLoading(false);
  };

  useEffect(() => { fetchWeather("Hyderabad"); }, []); // eslint-disable-line

  const curr = weather?.current;
  const wmo  = curr ? getWMO(curr.weather_code) : null;

  const hourlyData = weather?.hourly ? (() => {
    const now = new Date();
    const times = weather.hourly.time;
    const idx = Math.max(0, times.findIndex(t => new Date(t) >= now));
    return times.slice(idx, idx+24).map((t,i) => ({
      time: formatTime(t),
      temp: weather.hourly.temperature_2m[idx+i],
      rain: weather.hourly.precipitation_probability[idx+i],
      wind: weather.hourly.wind_speed_10m[idx+i],
      emoji: getWMO(weather.hourly.weather_code[idx+i]).emoji,
    }));
  })() : [];

  const dailyData = weather?.daily ? weather.daily.time.map((t,i) => ({
    day:    i===0?"Today":i===1?"Tmrw":shortDay(t),
    max:    Math.round(weather.daily.temperature_2m_max[i]),
    min:    Math.round(weather.daily.temperature_2m_min[i]),
    rain:   weather.daily.precipitation_probability_max[i],
    wind:   Math.round(weather.daily.wind_speed_10m_max[i]),
    emoji:  getWMO(weather.daily.weather_code[i]).emoji,
    label:  getWMO(weather.daily.weather_code[i]).label,
    sunrise:weather.daily.sunrise[i]?.split("T")[1]?.slice(0,5),
    sunset: weather.daily.sunset[i]?.split("T")[1]?.slice(0,5),
  })) : [];

  // Glass card shared style
  const gc = {
    background: dark?"rgba(10,20,12,0.82)":"rgba(255,255,255,0.82)",
    backdropFilter:"blur(20px) saturate(180%)", WebkitBackdropFilter:"blur(20px) saturate(180%)",
    border:`1px solid ${dark?"rgba(82,183,136,0.12)":"rgba(255,255,255,0.9)"}`,
    boxShadow: dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.07)",
    borderRadius:16, padding:"16px 18px",
  };

  const tabBtn = (key, lbl) => (
    <button data-magnetic key={key} onClick={() => setTab(key)} style={{
      padding:"9px 18px", borderRadius:50, cursor:"pointer",
      fontWeight:700, fontSize:13, fontFamily:"'Inter',sans-serif",
      border:`1.5px solid ${tab===key?"rgba(82,183,136,0.6)":tk.border}`,
      background: tab===key ? "rgba(82,183,136,0.28)" : "transparent",
      backdropFilter: tab===key ? "blur(20px) saturate(180%)" : "none",
      WebkitBackdropFilter: tab===key ? "blur(20px) saturate(180%)" : "none",
      color: tab===key ? "#fff" : tk.textMid,
      boxShadow: tab===key ? "inset 0 1px 0 rgba(255,255,255,0.4),0 4px 12px rgba(82,183,136,0.2)" : "none",
      transition:"all 0.2s ease",
    }}>{lbl}</button>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      {/* ── Hero Banner ── */}
      <div style={{ background:"linear-gradient(135deg,#040d06,#0d2b1a,#1b4332,#2d6a4f)", padding:"clamp(26px,3.2vw,38px) var(--page-px,clamp(16px,3.2vw,36px))", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 30% 50%,rgba(82,183,136,0.1),transparent 55%),radial-gradient(circle at 70% 30%,rgba(116,198,157,0.07),transparent 50%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"-20%", right:"5%", width:300, height:300, borderRadius:"50%", background:"rgba(82,183,136,0.04)", pointerEvents:"none" }} />
        <div style={{ textAlign:"center", position:"relative", animation:"fadeUp 0.5s ease both" }}>
          <div style={{ fontSize:44, marginBottom:8, animation:"float 3s ease-in-out infinite" }}>⛅</div>
          <h1 style={{ color:"#fff", fontSize:"clamp(28px,3.8vw,42px)", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4, fontWeight:700 }}>
            Weather Dashboard
          </h1>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13 }}>
            Real-time weather — live data from Open-Meteo
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"var(--content-max,1680px)", margin:"0 auto", padding:"clamp(18px,2.6vw,30px) var(--page-px,clamp(16px,3.2vw,36px)) 64px" }}>

        {/* ── Search bar ── */}
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <div style={{ flex:1, position:"relative" }}>
            <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>📍</span>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&fetchWeather(input)}
              placeholder="Search any city... e.g. Warangal, Karimnagar"
              style={{ width:"100%", padding:"12px 14px 12px 42px", borderRadius:14, border:`1.5px solid ${tk.border}`, background: dark?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.9)", backdropFilter:"blur(12px)", color:tk.text, fontSize:15, outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box", transition:"all 0.2s" }}
              onFocus={e=>{e.target.style.borderColor="#52b788"; e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)";}}
              onBlur={e=>{e.target.style.borderColor=tk.border; e.target.style.boxShadow="none";}}
            />
          </div>
          <button data-magnetic onClick={()=>fetchWeather(input)} disabled={loading} style={{
            padding:"12px 24px", borderRadius:14, cursor:loading?"not-allowed":"pointer",
            fontWeight:700, fontSize:15, fontFamily:"'Inter',sans-serif",
            background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)",
            border:"1px solid rgba(255,255,255,0.30)", color:"#fff",
            boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.5),inset 0 -1px 0 rgba(0,0,0,0.1),0 6px 20px rgba(0,0,0,0.2)",
            transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)", opacity:loading?0.7:1,
          }}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="scale(1.04) translateY(-1px)"; e.currentTarget.style.background="rgba(82,183,136,0.42)";}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.background="rgba(82,183,136,0.28)";}}>
            {loading ? "⏳" : "🔍 Search"}
          </button>
        </div>

        {/* ── Quick city pills ── */}
        <div className="filter-pills" style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {QUICK_CITIES.map(c=>(
            <button data-magnetic key={c} onClick={()=>{setInput(c); fetchWeather(c);}} style={{
              padding:"7px 16px", borderRadius:50, cursor:"pointer",
              fontWeight:600, fontSize:13, fontFamily:"'Inter',sans-serif",
              border:`1px solid ${city===c?"rgba(82,183,136,0.55)":tk.border}`,
              background: city===c?"rgba(82,183,136,0.22)":"transparent",
              color: city===c?tk.green4:tk.textMid,
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{if(city!==c){e.currentTarget.style.borderColor="#52b788"; e.currentTarget.style.color=tk.green4;}}}
              onMouseLeave={e=>{if(city!==c){e.currentTarget.style.borderColor=tk.border; e.currentTarget.style.color=tk.textMid;}}}
            >{c}</button>
          ))}
        </div>

        {error && (
          <div style={{ background:"rgba(220,38,38,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:14, padding:"14px 18px", marginBottom:24, color:"#fca5a5", fontWeight:600, animation:"fadeUp 0.3s ease" }}>
            ⚠ {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:56, marginBottom:14, animation:"float 2s ease-in-out infinite" }}>⛅</div>
            <p style={{ color:tk.textLt, fontSize:15 }}>Loading weather for <strong style={{ color:tk.text }}>{input}</strong>...</p>
          </div>
        )}

        {weather && curr && !loading && (<>

          {/* ── Current weather card ── */}
          <div data-tilt style={{ background:"linear-gradient(135deg,#040d06,#0d2b1a,#1b4332)", borderRadius:16, padding:"14px 14px", marginBottom:12, border:"1px solid rgba(82,183,136,0.15)", boxShadow:"0 8px 28px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.06)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-34%", right:"-7%", width:190, height:190, borderRadius:"50%", background:"rgba(82,183,136,0.05)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-24%", left:"18%", width:130, height:130, borderRadius:"50%", background:"rgba(82,183,136,0.03)", pointerEvents:"none" }} />

            <div className="weather-current" style={{ display:"grid", gridTemplateColumns:"minmax(220px,1.1fr) minmax(520px,1.9fr)", alignItems:"center", gap:14, position:"relative" }}>
              <div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(82,183,136,0.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.25)", borderRadius:20, padding:"4px 12px", fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:"#74c69d", marginBottom:10 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block", animation:"pulse 2s infinite" }} />
                  📍 {weather.cityName}, {weather.country}
                </div>
                <div style={{ fontSize:66, fontWeight:900, color:"#fff", lineHeight:1, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"', letterSpacing:"-2px" }}>
                  {Math.round(curr.temperature_2m)}<span style={{ fontSize:30, fontWeight:500, letterSpacing:0, opacity:0.7 }}>°C</span>
                </div>
                <div style={{ fontSize:18, marginTop:4, color:"rgba(255,255,255,0.88)", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:21 }}>{wmo.emoji}</span> {wmo.label}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:4 }}>Feels like {Math.round(curr.apparent_temperature)}°C</div>
              </div>

              {/* Stat cards in a straight row */}
              <div className="weather-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(96px,1fr))", gap:10, minWidth:0 }}>
                {[
                  ["💧",`${curr.relative_humidity_2m}%`,"Humidity","#60a5fa"],
                  ["💨",`${curr.wind_speed_10m} km/h`,"Wind Speed","#a3e635"],
                  ["🌡️",`${Math.round(curr.apparent_temperature)}°C`,"Feels Like","#fb923c"],
                  ["☀️",`${curr.uv_index}/11`,"UV Index","#fcd34d"],
                ].map(([icon,val,lbl,color])=>(
                  <div key={lbl} style={{ background:"rgba(255,255,255,0.07)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 8px", textAlign:"center", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.1)" }}>
                    <div style={{ fontSize:20, marginBottom:3 }}>{icon}</div>
                    <div style={{ fontSize:16, fontWeight:800, color, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"' }}>{val}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.5px", marginTop:3 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Chart tabs ── */}
          <div className="weather-tab-row filter-pills" style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            {tabBtn("hourly","🌡️ Hourly Temp")}
            {tabBtn("rain","🌧️ Rain Chart")}
            {tabBtn("wind","💨 Wind Chart")}
            {tabBtn("daily","📅 7-Day Forecast")}
          </div>

          {/* ── Hourly Temp ── */}
          {tab==="hourly" && (
            <div style={gc}>
              <h3 style={{ color:tk.text, fontWeight:700, fontSize:16, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:28, height:28, borderRadius:8, background:"rgba(82,183,136,0.2)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🌡️</span>
                Temperature — Next 24 Hours
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={hourlyData} margin={{top:10,right:10,left:-10,bottom:0}}>
                  <defs>
                    <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#52b788" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#52b788" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1a3320":"#e0ebe4"} />
                  <XAxis dataKey="time" tick={{fill:tk.textLt,fontSize:11}} tickLine={false} interval={2} />
                  <YAxis tick={{fill:tk.textLt,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}°`} />
                  <Tooltip content={<WeatherTooltip unit="°C" dark={dark} />} />
                  <Area type="monotone" dataKey="temp" name="Temperature" stroke="#52b788" strokeWidth={2.5} fill="url(#tGrad)" dot={false} activeDot={{r:5,fill:"#52b788"}} />
                </AreaChart>
              </ResponsiveContainer>
              {/* Hourly scroll */}
              <div style={{ overflowX:"auto", marginTop:18 }}>
                <div style={{ display:"flex", gap:9, minWidth:"max-content", paddingBottom:6 }}>
                  {hourlyData.map((h,i)=>(
                    <div key={i} style={{ textAlign:"center", padding:"10px 12px", borderRadius:14, background:i===0?"rgba(82,183,136,0.2)":dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", border:`1px solid ${i===0?"rgba(82,183,136,0.4)":tk.border}`, minWidth:58, transition:"all 0.2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(82,183,136,0.15)"; e.currentTarget.style.borderColor="rgba(82,183,136,0.4)";}}
                      onMouseLeave={e=>{e.currentTarget.style.background=i===0?"rgba(82,183,136,0.2)":dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor=i===0?"rgba(82,183,136,0.4)":tk.border;}}>
                      <div style={{ fontSize:9, color:tk.textLt, marginBottom:5 }}>{i===0?"Now":h.time}</div>
                      <div style={{ fontSize:18, marginBottom:5 }}>{h.emoji}</div>
                      <div style={{ fontSize:14, fontWeight:800, color:tk.text, fontFamily:"'Inter',sans-serif" }}>{Math.round(h.temp)}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Rain ── */}
          {tab==="rain" && (
            <div style={gc}>
              <h3 style={{ color:tk.text, fontWeight:700, fontSize:16, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:28, height:28, borderRadius:8, background:"rgba(59,130,246,0.2)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🌧️</span>
                Rain Probability — Next 24 Hours
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={hourlyData} margin={{top:10,right:10,left:-10,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1a3320":"#e0ebe4"} />
                  <XAxis dataKey="time" tick={{fill:tk.textLt,fontSize:11}} tickLine={false} interval={2} />
                  <YAxis tick={{fill:tk.textLt,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`} domain={[0,100]} />
                  <Tooltip content={<WeatherTooltip unit="%" dark={dark} />} />
                  <Bar dataKey="rain" name="Rain Chance" radius={[6,6,0,0]} fill="rgba(59,130,246,0.75)" />
                </BarChart>
              </ResponsiveContainer>
              <div className="stat-grid" style={{ marginTop:20, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[
                  {label:"Max Rain Chance",value:`${Math.max(...hourlyData.map(h=>h.rain))}%`,color:"#3b82f6"},
                  {label:"Avg Rain Chance",value:`${Math.round(hourlyData.reduce((s,h)=>s+h.rain,0)/hourlyData.length)}%`,color:"#60a5fa"},
                  {label:"Hours > 50%",value:`${hourlyData.filter(h=>h.rain>50).length}h`,color:"#93c5fd"},
                ].map(({label,value,color})=>(
                  <div key={label} style={{ background:dark?"rgba(59,130,246,0.1)":"rgba(59,130,246,0.06)", backdropFilter:"blur(8px)", border:`1px solid rgba(59,130,246,0.2)`, borderRadius:14, padding:"14px 16px" }}>
                    <div style={{ fontSize:24, fontWeight:800, color, fontFamily:"'Inter',sans-serif" }}>{value}</div>
                    <div style={{ fontSize:11, color:tk.textLt, marginTop:4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Wind ── */}
          {tab==="wind" && (
            <div style={gc}>
              <h3 style={{ color:tk.text, fontWeight:700, fontSize:16, marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:28, height:28, borderRadius:8, background:"rgba(245,158,11,0.2)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💨</span>
                Wind Speed — Next 24 Hours
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={hourlyData} margin={{top:10,right:10,left:-10,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1a3320":"#e0ebe4"} />
                  <XAxis dataKey="time" tick={{fill:tk.textLt,fontSize:11}} tickLine={false} interval={2} />
                  <YAxis tick={{fill:tk.textLt,fontSize:11}} tickLine={false} axisLine={false} />
                  <Tooltip content={<WeatherTooltip unit=" km/h" dark={dark} />} />
                  <Line type="monotone" dataKey="wind" name="Wind Speed" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{r:5,fill:"#f59e0b"}} />
                </LineChart>
              </ResponsiveContainer>
              <div className="stat-grid" style={{ marginTop:20, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[
                  {label:"Max Wind",value:`${Math.max(...hourlyData.map(h=>h.wind))} km/h`,color:"#f59e0b"},
                  {label:"Avg Wind",value:`${Math.round(hourlyData.reduce((s,h)=>s+h.wind,0)/hourlyData.length)} km/h`,color:"#fcd34d"},
                  {label:"Current",value:`${curr.wind_speed_10m} km/h`,color:"#fde68a"},
                ].map(({label,value,color})=>(
                  <div key={label} style={{ background:dark?"rgba(245,158,11,0.1)":"rgba(245,158,11,0.06)", backdropFilter:"blur(8px)", border:`1px solid rgba(245,158,11,0.2)`, borderRadius:14, padding:"14px 16px" }}>
                    <div style={{ fontSize:24, fontWeight:800, color, fontFamily:"'Inter',sans-serif" }}>{value}</div>
                    <div style={{ fontSize:11, color:tk.textLt, marginTop:4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 7-Day ── */}
          {tab==="daily" && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={gc}>
                <h3 style={{ color:tk.text, fontWeight:700, fontSize:16, marginBottom:18 }}>🌡️ 7-Day Temperature Range</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={dailyData} margin={{top:10,right:10,left:-10,bottom:0}}>
                    <defs>
                      <linearGradient id="maxG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="minG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark?"#1a3320":"#e0ebe4"} />
                    <XAxis dataKey="day" tick={{fill:tk.textLt,fontSize:12}} tickLine={false} />
                    <YAxis tick={{fill:tk.textLt,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}°`} />
                    <Tooltip content={<WeatherTooltip unit="°C" dark={dark} />} />
                    <Legend wrapperStyle={{color:tk.textMid,fontSize:12,paddingTop:8}} />
                    <Area type="monotone" dataKey="max" name="Max" stroke="#ef4444" strokeWidth={2} fill="url(#maxG)" dot={{fill:"#ef4444",r:4}} />
                    <Area type="monotone" dataKey="min" name="Min" stroke="#60a5fa" strokeWidth={2} fill="url(#minG)" dot={{fill:"#60a5fa",r:4}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Daily cards */}
              <div style={gc}>
                <h3 style={{ color:tk.text, fontWeight:700, fontSize:16, marginBottom:16 }}>📅 Day-by-Day Forecast</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  {dailyData.map((d,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 4px", borderBottom: i<dailyData.length-1?`1px solid ${dark?"rgba(82,183,136,0.08)":"rgba(0,0,0,0.05)"}`:0, flexWrap:"wrap", gap:10, transition:"background 0.15s", borderRadius:10 }}
                      onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(82,183,136,0.05)":"rgba(82,183,136,0.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ fontWeight:700, color:tk.text, minWidth:52, fontSize:15 }}>{d.day}</div>
                      <div style={{ fontSize:26 }}>{d.emoji}</div>
                      <div style={{ color:tk.textMid, fontSize:13, flex:1, minWidth:100 }}>{d.label}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:13 }}>
                        <span style={{ color:"#60a5fa" }}>💧 {d.rain}%</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:13 }}>
                        <span style={{ color:"#a3e635" }}>💨 {d.wind}</span>
                      </div>
                      <div style={{ display:"flex", gap:12 }}>
                        <span style={{ fontWeight:800, color:"#ef4444", fontFamily:"'Inter',sans-serif" }}>↑{d.max}°</span>
                        <span style={{ fontWeight:700, color:"#60a5fa", fontFamily:"'Inter',sans-serif" }}>↓{d.min}°</span>
                      </div>
                      <div style={{ fontSize:11, color:tk.textLt }}>🌅{d.sunrise} 🌇{d.sunset}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:tk.textLt }}>
            Live data · Open-Meteo · Updated: {new Date().toLocaleTimeString("en-IN")}
          </div>
        </>)}
      </div>
    </div>
  );
}
