import { useState } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { useTheme, TK } from "../context/ThemeContext";

function CustomTooltip({ active, payload, label, tk }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: tk.bgCard,
        border: `1px solid ${tk.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: tk.shadow,
      }}
    >
      <p style={{ color: tk.text, fontWeight: 700, marginBottom: 4, fontSize: 13 }}>
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: "2px 0", fontSize: 12 }}>
          {p.name}:{" "}
          <strong>
            {p.value}
            {p.name === "humidity" ? "%" : "°C"}
          </strong>
        </p>
      ))}
    </div>
  );
}

export default function WeatherChart({ weather }) {
  const { dark } = useTheme();
  const tk = TK(dark);
  const [tab, setTab] = useState("hourly");

  const tabs = [
    { id: "hourly",   label: "⏰ Hourly Temperature" },
    { id: "weekly",   label: "📅 7-Day Forecast"     },
    { id: "humidity", label: "💧 Humidity Trend"      },
  ];

  return (
    <div
      style={{
        background: tk.bgCard,
        borderRadius: 20,
        padding: 28,
        boxShadow: tk.shadow,
        border: `1px solid ${tk.border}`,
        marginBottom: 24,
      }}
    >
      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `1.5px solid #52b788`,
              background: tab === id ? "#52b788" : "transparent",
              color: tab === id ? "#fff" : "#52b788",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hourly Temperature — Area Chart */}
      {tab === "hourly" && (
        <>
          <div style={{ color: tk.textMid, fontWeight: 700, marginBottom: 14, fontSize: 14 }}>
            Temperature Throughout the Day (°C)
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weather.hourly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52b788" stopOpacity={dark ? 0.35 : 0.25} />
                  <stop offset="95%" stopColor="#52b788" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={tk.chartGrid} />
              <XAxis dataKey="t" stroke={tk.textLt} tick={{ fill: tk.textLt, fontSize: 12 }} />
              <YAxis stroke={tk.textLt} tick={{ fill: tk.textLt, fontSize: 12 }} domain={["auto", "auto"]} />
              <Tooltip content={(props) => <CustomTooltip {...props} tk={tk} />} />
              <Area
                type="monotone"
                dataKey="temp"
                name="temperature"
                stroke="#52b788"
                strokeWidth={2.5}
                fill="url(#tempGradient)"
                dot={{ fill: "#52b788", r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: "#40916c" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}

      {/* 7-Day Forecast — Bar Chart */}
      {tab === "weekly" && (
        <>
          <div style={{ color: tk.textMid, fontWeight: 700, marginBottom: 14, fontSize: 14 }}>
            7-Day High / Low Temperature (°C)
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weather.weekly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke={tk.chartGrid} />
              <XAxis dataKey="d" stroke={tk.textLt} tick={{ fill: tk.textLt, fontSize: 12 }} />
              <YAxis stroke={tk.textLt} tick={{ fill: tk.textLt, fontSize: 12 }} />
              <Tooltip content={(props) => <CustomTooltip {...props} tk={tk} />} />
              <Legend wrapperStyle={{ color: tk.textMid, fontSize: 13 }} />
              <Bar dataKey="h" name="High" fill="#40916c" radius={[5, 5, 0, 0]} />
              <Bar dataKey="l" name="Low" fill="#74c69d" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Humidity Trend — Line Chart */}
      {tab === "humidity" && (
        <>
          <div style={{ color: tk.textMid, fontWeight: 700, marginBottom: 14, fontSize: 14 }}>
            Humidity % Throughout the Day
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weather.hourly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tk.chartGrid} />
              <XAxis dataKey="t" stroke={tk.textLt} tick={{ fill: tk.textLt, fontSize: 12 }} />
              <YAxis stroke={tk.textLt} tick={{ fill: tk.textLt, fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={(props) => <CustomTooltip {...props} tk={tk} />} />
              <Line
                type="monotone"
                dataKey="hum"
                name="humidity"
                stroke="#d4a017"
                strokeWidth={2.5}
                dot={{ fill: "#d4a017", r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
