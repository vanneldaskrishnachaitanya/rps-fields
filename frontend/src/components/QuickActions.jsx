import { useNavigate, useLocation } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const CUSTOMER_ACTIONS = [
  { icon:"🛒", label:"Shop Now",       to:"/catalog",            primary:true  },
  { icon:"📦", label:"My Orders",      to:"/orders"                            },
  { icon:"📊", label:"Dashboard",      to:"/customer/dashboard"                },
  { icon:"👤", label:"Profile",        to:"/profile"                           },
  { icon:"📍", label:"Addresses",      to:"/address"                           },
];
const FARMER_ACTIONS = [
  { icon:"📦", label:"Add Product",    to:"/farmer/products",    primary:true  },
  { icon:"🛒", label:"Orders",         to:"/farmer/orders"                     },
  { icon:"🤝", label:"Find Agents",    to:"/farmer/find-agents"                },
  { icon:"💰", label:"Revenue",        to:"/farmer/revenue"                    },
  { icon:"👤", label:"Profile",        to:"/farmer/profile"                    },
];
const AGENT_ACTIONS = [
  { icon:"➕", label:"Add Product",    to:"/agent/add-product",  primary:true  },
  { icon:"📦", label:"Products",       to:"/agent/products"                    },
  { icon:"🛒", label:"Orders",         to:"/agent/orders"                      },
  { icon:"📬", label:"Requests",       to:"/agent/requests"                    },
  { icon:"🌾", label:"Farmers",        to:"/agent/farmers"                     },
];
const GUEST_ACTIONS = [
  { icon:"🛒", label:"Browse Catalog", to:"/catalog",            primary:true  },
  { icon:"🔑", label:"Login",          to:"/login"                             },
  { icon:"📝", label:"Register",       to:"/register"                          },
  { icon:"🌤", label:"Weather",        to:"/weather"                           },
];

export default function QuickActions({ collapsed: defaultCollapsed = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const actions = user?.role === "customer" ? CUSTOMER_ACTIONS
    : user?.role === "farmer"   ? FARMER_ACTIONS
    : user?.role === "agent"    ? AGENT_ACTIONS
    : GUEST_ACTIONS;

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div style={{
      background: dark ? "rgba(8,18,12,0.92)" : "rgba(240,248,242,0.96)",
      backdropFilter: "blur(24px) saturate(200%)",
      WebkitBackdropFilter: "blur(24px) saturate(200%)",
      borderRadius: collapsed ? 50 : 20,
      border: `1px solid ${dark ? "rgba(82,183,136,0.18)" : "rgba(82,183,136,0.25)"}`,
      boxShadow: dark
        ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
        : "0 8px 32px rgba(27,67,50,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
      overflow: "hidden",
      transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      width: collapsed ? 48 : "100%",
    }}>
      {/* Header */}
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{
          padding: collapsed ? "12px" : "14px 18px 10px",
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          cursor: "pointer",
          borderBottom: collapsed ? "none" : `1px solid ${dark ? "rgba(82,183,136,0.1)" : "rgba(82,183,136,0.15)"}`,
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#52b788", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: dark ? "rgba(255,255,255,0.5)" : "#5a8a68", textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: "'Inter',sans-serif" }}>
              Quick Actions
            </span>
          </div>
        )}
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: dark ? "rgba(82,183,136,0.12)" : "rgba(82,183,136,0.1)",
          border: `1px solid ${dark ? "rgba(82,183,136,0.2)" : "rgba(82,183,136,0.25)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, transition: "all 0.2s",
        }}>
          {collapsed ? "⚡" : "✕"}
        </div>
      </div>

      {/* Cart badge when collapsed */}
      {collapsed && user?.role === "customer" && itemCount > 0 && (
        <div style={{ padding: "0 12px 8px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>{itemCount}</div>
        </div>
      )}

      {/* Actions list */}
      {!collapsed && (
        <div style={{ padding: "10px 12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          {actions.map((a) => {
            const active = isActive(a.to);
            const isCartAction = a.to === "/catalog" && user?.role === "customer";
            return (
              <button
                key={a.to}
                onClick={() => navigate(a.to)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", borderRadius: 12,
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                  fontWeight: active ? 800 : 600, fontSize: 13,
                  textAlign: "left", width: "100%",
                  border: `1.5px solid ${active
                    ? (dark ? "rgba(82,183,136,0.5)" : "rgba(82,183,136,0.4)")
                    : (dark ? "rgba(255,255,255,0.07)" : "rgba(27,67,50,0.12)")}`,
                  background: active
                    ? (dark ? "rgba(82,183,136,0.18)" : "rgba(82,183,136,0.12)")
                    : a.primary
                      ? (dark ? "linear-gradient(135deg,rgba(82,183,136,0.28),rgba(45,106,79,0.35))" : "linear-gradient(135deg,rgba(45,106,79,0.18),rgba(82,183,136,0.15))")
                      : "transparent",
                  color: active ? (dark ? "#74c69d" : "#1b4332") : (dark ? "rgba(255,255,255,0.75)" : "#1a3a24"),
                  boxShadow: active ? `0 2px 10px rgba(82,183,136,0.2)` : a.primary ? "0 2px 8px rgba(82,183,136,0.15)" : "none",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = dark ? "rgba(82,183,136,0.1)" : "rgba(82,183,136,0.08)";
                    e.currentTarget.style.borderColor = dark ? "rgba(82,183,136,0.3)" : "rgba(82,183,136,0.3)";
                    e.currentTarget.style.transform = "translateX(3px)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = a.primary
                      ? (dark ? "linear-gradient(135deg,rgba(82,183,136,0.28),rgba(45,106,79,0.35))" : "linear-gradient(135deg,rgba(45,106,79,0.18),rgba(82,183,136,0.15))")
                      : "transparent";
                    e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.07)" : "rgba(27,67,50,0.12)";
                    e.currentTarget.style.transform = "none";
                  }
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
                <span style={{ flex: 1 }}>{a.label}</span>
                {isCartAction && itemCount > 0 && (
                  <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{itemCount}</span>
                )}
                {active && <span style={{ fontSize: 10, color: dark ? "#74c69d" : "#2d6a4f", opacity: 0.6 }}>●</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
