import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";

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

const getWMO = code => WMO_CODES[code] || { label:"Unknown", emoji:"🌡️" };

const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatTime = isoStr => {
  const d = new Date(isoStr);
  const h = d.getHours();
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;
};

const formatDay = isoStr => {
  const d = new Date(isoStr);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const QUICK_CITIES = [
  "Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam",
  "Vijayawada","Chennai","Bangalore","Mumbai","Delhi",
];

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
      // Step 1: Geocode city → coordinates (free, no key needed)
      const geoRes  = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results?.length) {
        setError(`City "${cityName}" not found. Try a different spelling.`);
        setLoading(false); return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Fetch live weather (free, no key needed)
      const wxRes  = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index` +
        `&hourly=temperature_2m,weather_code,precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
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

  const hourly = weather?.hourly ? (() => {
    const now = new Date();
    const times = weather.hourly.time;
    const startIdx = times.findIndex(t => new Date(t) >= now);
    const idx = startIdx === -1 ? 0 : startIdx;
    return times.slice(idx, idx + 24).map((t, i) => ({
      time: t,
      temp: weather.hourly.temperature_2m[idx + i],
      code: weather.hourly.weather_code[idx + i],
      rain: weather.hourly.precipitation_probability[idx + i],
    }));
  })() : [];

  const daily = weather?.daily ? weather.daily.time.map((t, i) => ({
    date:    t,
    max:     weather.daily.temperature_2m_max[i],
    min:     weather.daily.temperature_2m_min[i],
    code:    weather.daily.weather_code[i],
    rain:    weather.daily.precipitation_probability_max[i],
    sunrise: weather.daily.sunrise[i],
    sunset:  weather.daily.sunset[i],
  })) : [];

  const card = {
    background: dark ? "#1a2e1e" : "#1b4332",
    borderRadius: 16, padding: "20px 22px",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f,#40916c)", padding: "50px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 38, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 8 }}>
          🌤️ Weather Dashboard
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
          Real-time weather for any city — powered by Open-Meteo
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px" }}>

        {/* Search */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchWeather(input)}
            placeholder="Search any city... e.g. Hyderabad, Warangal, Mumbai"
            style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: `1.5px solid ${tk.border}`, background: tk.bgInput, color: tk.text, fontSize: 15, outline: "none", fontFamily: "inherit" }}
          />
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

        {/* Error */}
        {error && (
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: "14px 18px", marginBottom: 24, color: "#856404", fontWeight: 600 }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: tk.textLt }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🌤️</div>
            <p style={{ fontSize: 16 }}>Fetching live weather for {input}...</p>
          </div>
        )}

        {/* Current weather */}
        {weather && curr && !loading && (
          <>
            <div style={{ ...card, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
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
                  ["💧", `${curr.relative_humidity_2m}%`,            "Humidity"],
                  ["💨", `${curr.wind_speed_10m} km/h`,              "Wind Speed"],
                  ["🌡️", `${Math.round(curr.apparent_temperature)}°C`, "Feels Like"],
                  ["☀️", `${curr.uv_index}/11`,                       "UV Index"],
                ].map(([icon, val, lbl]) => (
                  <div key={lbl} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{val}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[["hourly","🌡️ Hourly"], ["daily","📅 7-Day Forecast"], ["rain","🌧️ Rain Chance"]].map(([key, lbl]) => (
                <button key={key} onClick={() => setTab(key)}
                  style={{ padding: "9px 20px", borderRadius: 10, border: `1.5px solid ${tab === key ? "#52b788" : tk.border}`, background: tab === key ? "#52b78822" : "transparent", color: tab === key ? "#52b788" : tk.textMid, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Hourly tab */}
            {tab === "hourly" && (
              <div style={{ background: tk.bgCard, borderRadius: 16, border: `1px solid ${tk.border}`, padding: "20px 16px", overflowX: "auto" }}>
                <div style={{ display: "flex", gap: 10, minWidth: "max-content" }}>
                  {hourly.map((h, i) => (
                    <div key={i} style={{ textAlign: "center", padding: "12px 14px", borderRadius: 12, background: i === 0 ? "#52b78822" : "transparent", border: `1px solid ${i === 0 ? "#52b788" : tk.border}`, minWidth: 70 }}>
                      <div style={{ fontSize: 11, color: tk.textLt, marginBottom: 6 }}>{i === 0 ? "Now" : formatTime(h.time)}</div>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{getWMO(h.code).emoji}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: tk.text }}>{Math.round(h.temp)}°</div>
                      <div style={{ fontSize: 10, color: "#3b82f6", marginTop: 4 }}>💧{h.rain}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7-Day tab */}
            {tab === "daily" && (
              <div style={{ background: tk.bgCard, borderRadius: 16, border: `1px solid ${tk.border}`, overflow: "hidden" }}>
                {daily.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderBottom: i < daily.length - 1 ? `1px solid ${tk.border}` : "none", background: i === 0 ? `${tk.green6}11` : "transparent", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ fontWeight: 700, color: tk.text, minWidth: 130 }}>
                      {i === 0 ? "Today" : i === 1 ? "Tomorrow" : formatDay(d.date)}
                    </div>
                    <div style={{ fontSize: 24 }}>{getWMO(d.code).emoji}</div>
                    <div style={{ color: tk.textMid, fontSize: 13 }}>{getWMO(d.code).label}</div>
                    <div style={{ color: "#3b82f6", fontSize: 13 }}>💧 {d.rain}%</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontWeight: 800, color: "#ef4444" }}>↑{Math.round(d.max)}°</span>
                      <span style={{ fontWeight: 600, color: "#60a5fa" }}>↓{Math.round(d.min)}°</span>
                    </div>
                    <div style={{ fontSize: 11, color: tk.textLt }}>
                      🌅{d.sunrise?.split("T")[1]?.slice(0, 5)} 🌇{d.sunset?.split("T")[1]?.slice(0, 5)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rain tab */}
            {tab === "rain" && (
              <div style={{ background: tk.bgCard, borderRadius: 16, border: `1px solid ${tk.border}`, padding: "24px 22px" }}>
                <h3 style={{ color: tk.text, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>
                  💧 Hourly Rain Probability (Next 24h)
                </h3>
                {hourly.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                    <span style={{ color: tk.textLt, fontSize: 12, width: 42, flexShrink: 0 }}>{i === 0 ? "Now" : formatTime(h.time)}</span>
                    <div style={{ flex: 1, background: tk.bgMuted, borderRadius: 6, height: 16, overflow: "hidden" }}>
                      <div style={{ width: `${h.rain}%`, height: "100%", background: h.rain > 70 ? "#3b82f6" : h.rain > 40 ? "#60a5fa" : "#93c5fd", borderRadius: 6, minWidth: h.rain > 0 ? 4 : 0 }} />
                    </div>
                    <span style={{ color: h.rain > 50 ? "#3b82f6" : tk.textMid, fontSize: 13, fontWeight: 700, width: 38, textAlign: "right", flexShrink: 0 }}>{h.rain}%</span>
                  </div>
                ))}
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
