import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme, TK } from "../context/ThemeContext";

export default function TodoPage() {
  const { user, authFetch } = useAuth();
  const { dark } = useTheme();
  const tk = TK(dark);
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if not logged in
      return;
    }
    fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data } = await authFetch("/todos");
      if (data) setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      const { data } = await authFetch("/todos", {
        method: "POST",
        body: JSON.stringify({ text: newText }),
      });
      if (data) setTodos([...todos, data]);
      setNewText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (t) => {
    // Optimistic UI update
    setTodos((prev) => prev.map((item) => (item._id === t._id ? { ...item, completed: !item.completed } : item)));
    try {
      await authFetch(`/todos/${t._id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !t.completed }),
      });
    } catch (err) {
      // Rollback on error
      setTodos((prev) => prev.map((item) => (item._id === t._id ? { ...item, completed: t.completed } : item)));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    setTodos((prev) => prev.filter((item) => item._id !== id));
    try {
      await authFetch(`/todos/${id}`, { method: "DELETE" });
    } catch (err) {
      fetchTodos(); // Refetch on error
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all your tasks to the defaults?")) return;
    setLoading(true);
    try {
      const { data } = await authFetch("/todos/reset", { method: "POST" });
      if (data) setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const percent = todos.length === 0 ? 0 : Math.round((todos.filter((t) => t.completed).length / todos.length) * 100);

  if (loading) {
    return (
      <div style={{ background: tk.bg, minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 40, animation: "float 2s ease-in-out infinite" }}>⏳</div>
      </div>
    );
  }

  return (
    <div style={{ background: tk.bg, minHeight: "100%", animation: "fadeIn 0.4s ease", paddingBottom: 100 }}>
      <div style={{ background: "linear-gradient(135deg,#0d2b1a,#1b4332)", padding: "44px var(--page-px,clamp(16px,4vw,48px))", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%,rgba(82,183,136,0.1),transparent 55%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", position: "relative" }}>
          <h1 style={{ color: "#fff", fontSize: 36, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 4 }}>📋 My Tasks</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px var(--page-px,clamp(16px,4vw,48px))" }}>
        {/* Progress */}
        <div style={{ background: tk.bgCard, borderRadius: 20, padding: 24, marginBottom: 24, border: `1px solid ${tk.border}`, boxShadow: tk.shadowMd }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: tk.text }}>Progress</span>
            <span style={{ fontWeight: 800, color: tk.green5 }}>{percent}%</span>
          </div>
          <div style={{ height: 10, background: dark ? "rgba(255,255,255,0.1)" : "rgba(27,67,50,0.1)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "linear-gradient(90deg, #52b788, #74c69d)", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Filters & Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, background: dark ? "rgba(255,255,255,0.06)" : "rgba(27,67,50,0.05)", padding: 4, borderRadius: 12 }}>
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? (dark ? "rgba(255,255,255,0.15)" : "#fff") : "transparent",
                  color: filter === f ? tk.text : tk.textLt,
                  border: filter === f && !dark ? `1px solid ${tk.border}` : "1px solid transparent",
                  boxShadow: filter === f && !dark ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                  padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",textTransform: "capitalize"
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={handleReset} style={{ background: "transparent", color: "#ef4444", border: `1px solid rgba(239,68,68,0.3)`, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Reset Defaults
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a new task..."
            style={{ flex: 1, padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${tk.border}`, background: tk.bgInput, color: tk.text, outline: "none", fontSize: 15 }}
          />
          <button type="submit" style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "0 24px", borderRadius: 14, fontWeight: 800, cursor: "pointer", fontSize: 24 }}>
            +
          </button>
        </form>

        {/* List */}
        <div>
          {filteredTodos.map((t, i) => (
            <div data-magnetic key={t._id} style={{ display: "flex", alignItems: "center", gap: 14, background: tk.bgCard, padding: "16px 20px", borderRadius: 16, marginBottom: 10, border: `1px solid ${tk.border}`, animation: `fadeUp 0.3s ease ${i * 0.05}s both`, transition: "all 0.2s" }}
                 onMouseEnter={e => e.currentTarget.style.borderColor = tk.green5}
                 onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}
            >
              <div onClick={() => handleToggle(t)} style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${t.completed ? tk.green5 : tk.textLt}`, background: t.completed ? tk.green5 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
                {t.completed && <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>✓</span>}
              </div>
              <div onClick={() => handleToggle(t)} style={{ flex: 1, fontSize: 15, fontWeight: 600, color: t.completed ? tk.textLt : tk.text, textDecoration: t.completed ? "line-through" : "none", cursor: "pointer", transition: "all 0.2s" }}>
                {t.text}
                {t.isDefault && <span style={{ display:"inline-block", marginLeft: 8, fontSize: 10, padding: "2px 6px", background: dark?"rgba(212,160,23,0.15)":"rgba(212,160,23,0.1)", color: "#d4a017", borderRadius: 4, transform: "translateY(-1px)" }}>DEFAULT</span>}
              </div>
              <button onClick={() => handleDelete(t._id)} style={{ width: 32, height: 32, borderRadius: 8, background: dark?"rgba(239,68,68,0.1)":"rgba(239,68,68,0.05)", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background=dark?"rgba(239,68,68,0.2)":"rgba(239,68,68,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background=dark?"rgba(239,68,68,0.1)":"rgba(239,68,68,0.05)"}>
                ✖
              </button>
            </div>
          ))}

          {filteredTodos.length === 0 && (
             <div style={{ textAlign: "center", padding: "40px", color: tk.textLt, fontStyle: "italic" }}>
               No tasks found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
