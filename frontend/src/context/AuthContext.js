import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
export const API_BASE = process.env.REACT_APP_API_URL || (window.location.hostname === "localhost" ? "http://localhost:4000/api" : "https://rps-fields-3.onrender.com/api");

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.success) setUser(normalise(d.user)); else setUser(null); })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const res  = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Login failed");
    const u = normalise(data.user);
    setUser(u);
    return u;
  };

  const register = async (fields) => {
    const res  = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Registration failed");
    const u = normalise(data.user);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
  };

  const authFetch = async (path, opts = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
    });

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) setUser(null);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

function normalise(u) {
  if (!u) return u;
  return {
    ...u,
    id:       u._id  || u.id,
    fullName: u.fullName || u.name,
    phone:    u.phone    || u.mobile,
    city:     u.city     || u.location,
    address:  u.address  || u.location,
  };
}
