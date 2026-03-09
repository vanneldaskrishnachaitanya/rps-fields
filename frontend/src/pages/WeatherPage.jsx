import { useState } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import WeatherChart from "../components/WeatherChart";
import { WEATHER_DB, DEFAULT_WEATHER } from "../data/weather";

export default function WeatherPage() {
  const { dark } = useTheme();
  const tk = TK(dark);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const handleSearch = () => {
    const key = city.trim().toLowerCase();
    setWeather(WEATHER_DB[key] || DEFAULT_WEATHER);
  };

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      {/* Header banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#1b4332,#40916c)",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: 38,
            fontFamily: "'Playfair Display',Georgia,serif",
            marginBottom: 8,
          }}
        >
          🌤 Weather Dashboard
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
          Real-time weather insights for farmers and buyers
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {/* Search bar */}
        <div style={{ maxWidth: 480, margin: "0 auto 40px", display: "flex", gap: 10 }}>
          <input
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 10,
              border: `1.5px solid ${tk.border}`,
              background: tk.bgInput,
              color: tk.text,
              fontSize: 15,
              outline: "none",
              fontFamily: "inherit",
            }}
            placeholder="Enter city: Mumbai, Delhi, Pune, Srinagar..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            style={{
              background: "linear-gradient(135deg,#52b788,#40916c)",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            Search
          </button>
        </div>

        {/* Empty state */}
        {!weather && (
          <div style={{ textAlign: "center", padding: "30px 20px" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🌍</div>
            <p style={{ color: tk.textLt, fontSize: 15 }}>
              Try: Mumbai, Delhi, Bangalore, Pune, Kolkata, Chennai, Hyderabad, Srinagar
            </p>
          </div>
        )}

        {weather && (
          <>
            {/* Current weather card */}
            <div
              style={{
                background: "linear-gradient(135deg,#1b4332,#2d6a4f)",
                borderRadius: 20,
                padding: "32px 36px",
                marginBottom: 28,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                boxShadow: tk.shadowLg,
              }}
            >
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 13,
                    marginBottom: 6,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  📍 {city.trim() || "Your City"}
                </div>
                <div style={{ fontSize: 76, lineHeight: 1 }}>{weather.icon}</div>
                <div style={{ fontSize: 58, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                  {weather.temp}°<span style={{ fontSize: 30 }}>C</span>
                </div>
                <div style={{ fontSize: 18, color: "#74c69d", marginTop: 6, fontWeight: 600 }}>
                  {weather.condition}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignContent: "center" }}>
                {[
                  ["💧", "Humidity", `${weather.humidity}%`],
                  ["💨", "Wind", `${weather.wind} km/h`],
                  ["☀️", "UV Index", `${weather.uv}/10`],
                  ["🌡", "Feels Like", `${weather.temp - 2}°C`],
                ].map(([icon, label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      padding: "14px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{value}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <WeatherChart weather={weather} />

            {/* Farming tips */}
            <div
              style={{
                background: tk.bgCard,
                borderRadius: 16,
                padding: 24,
                border: `1px solid ${tk.border}`,
                boxShadow: tk.shadow,
              }}
            >
              <div style={{ fontWeight: 800, color: tk.text, marginBottom: 14, fontSize: 15 }}>
                🌾 Farming Tips for Today's Conditions
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
                {[
                  weather.temp > 30
                    ? ["🍅", "High temps — harvest tomatoes and peppers early to avoid heat stress."]
                    : ["🥬", "Cool temps — perfect growing conditions for leafy greens and brassicas."],
                  weather.humidity > 70
                    ? ["⚠️", "High humidity — watch for fungal disease; ensure good airflow in crops."]
                    : ["💧", "Low humidity — consider increasing irrigation for root vegetables."],
                  ["🌱", "Check soil moisture 2 inches deep before watering to avoid overwatering."],
                  weather.uv > 7
                    ? ["☀️", "High UV today — use shade nets for tender seedlings and nursery plants."]
                    : ["🌿", "Great light conditions — good day for transplanting and field work."],
                ].map(([icon, tip], i) => (
                  <div
                    key={i}
                    style={{
                      background: tk.bgMuted,
                      borderRadius: 10,
                      padding: 14,
                      border: `1px solid ${tk.border}`,
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 12, color: tk.textMid, lineHeight: 1.55 }}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
