import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const WMO_CODES = {
  0:  { label:"Clear Sky",       emoji:"☀️" },
  1:  { label:"Mainly Clear",    emoji:"🌤️" },
  2:  { label:"Partly Cloudy",   emoji:"⛅" },
  3:  { label:"Overcast",        emoji:"☁️" },
  45: { label:"Foggy",           emoji:"🌫️" },
  48: { label:"Icy Fog",         emoji:"🌫️" },
  51: { label:"Light Drizzle",   emoji:"🌦️" },
  53: { label:"Drizzle",         emoji:"🌦️" },
  55: { label:"Heavy Drizzle",   emoji:"🌧️" },
  61: { label:"Light Rain",      emoji:"🌧️" },
  63: { label:"Rain",            emoji:"🌧️" },
  65: { label:"Heavy Rain",      emoji:"🌧️" },
  71: { label:"Light Snow",      emoji:"🌨️" },
  73: { label:"Snow",            emoji:"❄️" },
  75: { label:"Heavy Snow",      emoji:"❄️" },
  80: { label:"Rain Showers",    emoji:"🌦️" },
  81: { label:"Showers",         emoji:"🌧️" },
  82: { label:"Violent Showers", emoji:"⛈️" },
  95: { label:"Thunderstorm",    emoji:"⛈️" },
  96: { label:"Thunderstorm",    emoji:"⛈️" },
  99: { label:"Thunderstorm",    emoji:"⛈️" },
};

const getWMO  = code => WMO_CODES[code] || { label:"Unknown", emoji:"🌡️" };
const DAYS    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const formatTime = isoStr => {
  const d = new Date(isoStr);
  const h = d.getHours();
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;
};

const shortDay = isoStr => {
  const d = new Date(isoStr);
  return DAYS[d.getDay()];
};

const QUICK_CITIES = [
  "Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam",
  "Vijayawada","Chennai","Bangalore","Mumbai","Delhi",
];

const CustomTooltip = ({ active, payload, label, unit = "", dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: dark ? "#0d1f13" : "#1b4332", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
      <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#fff", fontWeight: 700 }}>
          {p.name}: {p.value}{unit}
        </div>
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
      const geoRes  = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length) {
        setError(`City "${cityName}" not found. Try a different spelling.`);
        setLoading(false); return;
      }
      const { latitude, longitude, name, country } = geoData.results[0];
      const wxRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index` +
        `&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max` +
        `&timezone=auto&forecast_days=7`
      );
      const wxData = await wxRes.json();
      setWeather({ ...wxData, cityName: name, country });
      setCity(name);
    } catch {
      setError("Failed to fetch weather. Check your internet connection.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchWeather("Hyderabad"); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const curr = weather?.current;
  const wmo  = curr ? getWMO(curr.weather_code) : null;

  const hourlyData = weather?.hourly ? (() => {
    const now = new Date();
    const times = weather.hourly.time;
    const startIdx = times.findIndex(t => new Date(t) >= now);
    const idx = startIdx === -1 ? 0 : startIdx;
    return times.slice(idx, idx + 24).map((t, i) => ({
      time: formatTime(t),
      temp: weather.hourly.temperature_2m[idx + i],
      rain: weather.hourly.precipitation_probability[idx + i],
      wind: weather.hourly.wind_speed_10m[idx + i],
      emoji: getWMO(weather.hourly.weather_code[idx + i]).emoji,
    }));
  })() : [];

  const dailyData = weather?.daily ? weather.daily.time.map((t, i) => ({
    day:     i === 0 ? "Today" : i === 1 ? "Tmrw" : shortDay(t),
    max:     Math.round(weather.daily.temperature_2m_max[i]),
    min:     Math.round(weather.daily.temperature_2m_min[i]),
    rain:    weather.daily.precipitation_probability_max[i],
    wind:    Math.round(weather.daily.wind_speed_10m_max[i]),
    emoji:   getWMO(weather.daily.weather_code[i]).emoji,
    label:   getWMO(weather.daily.weather_code[i]).label,
    sunrise: weather.daily.sunrise[i]?.split("T")[1]?.slice(0, 5),
    sunset:  weather.daily.sunset[i]?.split("T")[1]?.slice(0, 5),
  })) : [];

  const card = { background: tk.bgCard, borderRadius: 16, border: `1px solid ${tk.border}`, padding: "24px 22px" };
  const currentCard = { background: dark ? "#1a2e1e" : "#1b4332", borderRadius: 16, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.1)" };

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      <div style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f,#40916c)", padding: "50px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 38, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 8 }}>
          🌤️ Weather Dashboard
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
          Real-time weather with live charts — powered by Open-Meteo
        </p>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 20px" }}>

        {/* Search */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchWeather(input)}
            placeholder="Search any city... e.g. Hyderabad, Warangal, Mumbai"
            style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: `1.5px solid ${tk.border}`, background: tk.bgInput, color: tk.text, fontSize: 15, outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => fetchWeather(input)} disabled={loading}
            style={{ padding: "12px 28px", background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, fontFamily: "inherit" }}>
            {loading ? "..." : "Search"}
          </button>
        </div>

        {/* Quick cities */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {QUICK_CITIES.map(c => (
            <button key={c} onClick={() => { setInput(c); fetchWeather(c); }}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${city === c ? "#52b788" : tk.border}`, background: city === c ? "#52b78822" : "transparent", color: city === c ? "#52b788" : tk.textMid, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
              {c}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: "14px 18px", marginBottom: 24, color: "#856404", fontWeight: 600 }}>⚠ {error}</div>}

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: tk.textLt }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🌤️</div>
            <p style={{ fontSize: 16 }}>Fetching live weather for {input}...</p>
          </div>
        )}

        {weather && curr && !loading && (
          <>
            {/* Current weather */}
            <div style={{ ...currentCard, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>
                  📍 {weather.cityName}, {weather.country}
                </div>
                <div style={{ fontSize: 72, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  {Math.round(curr.temperature_2m)}°C
                </div>
                <div style={{ fontSize: 22, marginTop: 6, color: "rgba(255,255,255,0.85)" }}>
                  {wmo.emoji} {wmo.label}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
                  Feels like {Math.round(curr.apparent_temperature)}°C
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 260 }}>
                {[
                  ["💧", `${curr.relative_humidity_2m}%`,              "Humidity"],
                  ["💨", `${curr.wind_speed_10m} km/h`,                "Wind Speed"],
                  ["🌡️", `${Math.round(curr.apparent_temperature)}°C`, "Feels Like"],
                  ["☀️", `${curr.uv_index}/11`,                        "UV Index"],
                ].map(([icon, val, lbl]) => (
                  <div key={lbl} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{val}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                ["hourly", "🌡️ Hourly Temp"],
                ["rain",   "🌧️ Rain Chart"],
                ["wind",   "💨 Wind Chart"],
                ["daily",  "📅 7-Day Forecast"],
              ].map(([key, lbl]) => (
                <button key={key} onClick={() => setTab(key)}
                  style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${tab === key ? "#52b788" : tk.border}`, background: tab === key ? "#52b78822" : "transparent", color: tab === key ? "#52b788" : tk.textMid, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* ── TAB 1: Hourly Temperature — Area Chart ── */}
            {tab === "hourly" && (
              <div style={card}>
                <h3 style={{ color: tk.text, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🌡️ Temperature Over Next 24 Hours</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={hourlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#52b788" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#52b788" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e3a28" : "#e0ebe4"} />
                    <XAxis dataKey="time" tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} interval={2} />
                    <YAxis tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}°`} />
                    <Tooltip content={<CustomTooltip unit="°C" dark={dark} />} />
                    <Area type="monotone" dataKey="temp" name="Temperature"
                      stroke="#52b788" strokeWidth={2.5} fill="url(#tempGrad)"
                      dot={false} activeDot={{ r: 5, fill: "#52b788" }} />
                  </AreaChart>
                </ResponsiveContainer>
                {/* Hourly scroll cards */}
                <div style={{ overflowX: "auto", marginTop: 16 }}>
                  <div style={{ display: "flex", gap: 10, minWidth: "max-content", paddingBottom: 4 }}>
                    {hourlyData.map((h, i) => (
                      <div key={i} style={{ textAlign: "center", padding: "10px 12px", borderRadius: 10, background: i === 0 ? "#52b78822" : tk.bgMuted, border: `1px solid ${i === 0 ? "#52b788" : tk.border}`, minWidth: 64 }}>
                        <div style={{ fontSize: 10, color: tk.textLt, marginBottom: 4 }}>{i === 0 ? "Now" : h.time}</div>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{h.emoji}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: tk.text }}>{Math.round(h.temp)}°</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: Rain Probability — Bar Chart ── */}
            {tab === "rain" && (
              <div style={card}>
                <h3 style={{ color: tk.text, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🌧️ Rain Probability Over Next 24 Hours</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={hourlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e3a28" : "#e0ebe4"} />
                    <XAxis dataKey="time" tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} interval={2} />
                    <YAxis tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip unit="%" dark={dark} />} />
                    <Bar dataKey="rain" name="Rain Chance" radius={[4, 4, 0, 0]} fill="#3b82f6"
                      background={{ fill: dark ? "#1e3a28" : "#f0f7ff", radius: [4, 4, 0, 0] }} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
                  {[
                    { label: "Max Rain Chance", value: `${Math.max(...hourlyData.map(h => h.rain))}%`,  color: "#3b82f6" },
                    { label: "Avg Rain Chance", value: `${Math.round(hourlyData.reduce((s, h) => s + h.rain, 0) / hourlyData.length)}%`, color: "#60a5fa" },
                    { label: "Hours > 50%",     value: `${hourlyData.filter(h => h.rain > 50).length}h`, color: "#93c5fd" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: tk.bgMuted, borderRadius: 10, padding: "12px 16px", border: `1px solid ${tk.border}` }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                      <div style={{ fontSize: 11, color: tk.textLt, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: Wind Speed — Line Chart ── */}
            {tab === "wind" && (
              <div style={card}>
                <h3 style={{ color: tk.text, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>💨 Wind Speed Over Next 24 Hours</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={hourlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e3a28" : "#e0ebe4"} />
                    <XAxis dataKey="time" tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} interval={2} />
                    <YAxis tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip unit=" km/h" dark={dark} />} />
                    <Line type="monotone" dataKey="wind" name="Wind Speed"
                      stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#f59e0b" }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
                  {[
                    { label: "Max Wind", value: `${Math.max(...hourlyData.map(h => h.wind))} km/h`, color: "#f59e0b" },
                    { label: "Avg Wind", value: `${Math.round(hourlyData.reduce((s, h) => s + h.wind, 0) / hourlyData.length)} km/h`, color: "#fcd34d" },
                    { label: "Current",  value: `${curr.wind_speed_10m} km/h`, color: "#fde68a" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: tk.bgMuted, borderRadius: 10, padding: "12px 16px", border: `1px solid ${tk.border}` }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                      <div style={{ fontSize: 11, color: tk.textLt, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 4: 7-Day — Area + Bar + Cards ── */}
            {tab === "daily" && (
              <div>
                {/* Temp range area chart */}
                <div style={{ ...card, marginBottom: 20 }}>
                  <h3 style={{ color: tk.text, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🌡️ 7-Day Temperature Range (°C)</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={dailyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e3a28" : "#e0ebe4"} />
                      <XAxis dataKey="day" tick={{ fill: tk.textLt, fontSize: 12 }} tickLine={false} />
                      <YAxis tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}°`} />
                      <Tooltip content={<CustomTooltip unit="°C" dark={dark} />} />
                      <Legend wrapperStyle={{ color: tk.textMid, fontSize: 12, paddingTop: 8 }} />
                      <Area type="monotone" dataKey="max" name="Max Temp" stroke="#ef4444" strokeWidth={2} fill="url(#maxGrad)" dot={{ fill: "#ef4444", r: 4 }} />
                      <Area type="monotone" dataKey="min" name="Min Temp" stroke="#60a5fa" strokeWidth={2} fill="url(#minGrad)" dot={{ fill: "#60a5fa", r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 7-day rain bar chart */}
                <div style={{ ...card, marginBottom: 20 }}>
                  <h3 style={{ color: tk.text, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🌧️ 7-Day Rain Probability (%)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e3a28" : "#e0ebe4"} />
                      <XAxis dataKey="day" tick={{ fill: tk.textLt, fontSize: 12 }} tickLine={false} />
                      <YAxis tick={{ fill: tk.textLt, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip unit="%" dark={dark} />} />
                      <Bar dataKey="rain" name="Rain Chance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Daily summary cards */}
                <div style={card}>
                  <h3 style={{ color: tk.text, fontWeight: 800, fontSize: 16, marginBottom: 16 }}>📅 Daily Summary</h3>
                  {dailyData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < dailyData.length - 1 ? `1px solid ${tk.border}` : "none", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ fontWeight: 700, color: tk.text, minWidth: 80 }}>{d.day}</div>
                      <div style={{ fontSize: 22 }}>{d.emoji}</div>
                      <div style={{ color: tk.textMid, fontSize: 13, minWidth: 120 }}>{d.label}</div>
                      <div style={{ color: "#3b82f6", fontSize: 13 }}>💧 {d.rain}%</div>
                      <div style={{ color: "#f59e0b", fontSize: 13 }}>💨 {d.wind} km/h</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ fontWeight: 800, color: "#ef4444" }}>↑{d.max}°</span>
                        <span style={{ fontWeight: 600, color: "#60a5fa" }}>↓{d.min}°</span>
                      </div>
                      <div style={{ fontSize: 11, color: tk.textLt }}>🌅{d.sunrise} 🌇{d.sunset}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: tk.textLt }}>
              Live data from Open-Meteo · Updated: {new Date().toLocaleTimeString("en-IN")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
