require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const connectDB = require("./config/db");

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
// Allow ALL origins — fixes CORS blocking from Vercel
app.use(cors({
  origin: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true,
}));
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/products",     require("./routes/productRoutes"));
app.use("/api/orders",       require("./routes/orderRoutes"));
app.use("/api/partnerships", require("./routes/partnershipRoutes"));
app.use("/api/ratings",      require("./routes/ratingRoutes"));
app.use("/api/admin",        require("./routes/adminRoutes"));
app.use("/api/todos",        require("./routes/todoRoutes"));

// Backward-compat aliases that old frontend used
app.use("/api/farmer/orders", (req, res, next) => {
  req.url = "/farmer/orders";
  require("./routes/orderRoutes")(req, res, next);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "🌿 RPS Fields API running", time: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, error: err.message || "Internal server error" });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🌿 RPS Fields API running at http://localhost:${PORT}`);
  console.log(`   MongoDB: ${process.env.MONGO_URI ? "connected" : "⚠ MONGO_URI not set"}\n`);
  console.log("   Endpoints:");
  console.log("   POST  /api/auth/register");
  console.log("   POST  /api/auth/login");
  console.log("   GET   /api/products");
  console.log("   POST  /api/products     (agent only)");
  console.log("   POST  /api/orders       (customer)");
  console.log("   POST  /api/partnerships/request  (farmer→agent)");
  console.log("   PUT   /api/partnerships/:id/respond  (agent)");
  console.log("   POST  /api/ratings");
  console.log("   GET   /api/admin/stats");

  // ── Keep-alive ping every 14 min (prevents Render free tier from sleeping) ─
  setInterval(() => {
    fetch("https://rps-fields-3.onrender.com/api/health")
      .then(() => console.log("🟢 Keep-alive ping OK"))
      .catch(() => console.log("⚠ Keep-alive ping failed"));
  }, 14 * 60 * 1000);
});
