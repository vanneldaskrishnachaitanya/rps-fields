const jwt = require("jsonwebtoken");
const User = require("../models/User");

const readToken = (req) => {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();

  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.match(/(?:^|;\s*)rps_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);

  return null;
};

// Verify JWT and attach user to req.user
const protect = async (req, res, next) => {
  const token = readToken(req);

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorised — no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }
    if (req.user.status === "banned") {
      return res.status(403).json({ success: false, error: "Your account has been banned" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Token invalid or expired" });
  }
};

// Role-based guard — call after protect
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: `Access denied. Required role: ${roles.join(" or ")}`,
    });
  }
  next();
};

module.exports = { protect, requireRole };
