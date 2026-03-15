const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const {
      name, fullName, email, password, confirmPassword,
      role, mobile, phone, location, city, address, username,
    } = req.body;

    const resolvedName     = name || fullName;
    const resolvedMobile   = mobile || phone;
    const resolvedLocation = location || city;

    if (!resolvedName)                        return res.status(400).json({ success: false, error: "Name is required" });
    if (!email)                               return res.status(400).json({ success: false, error: "Email is required" });
    if (!password || password.length < 6)     return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    if (confirmPassword && password !== confirmPassword)
      return res.status(400).json({ success: false, error: "Passwords do not match" });

    const allowedRoles  = ["customer", "farmer", "agent"];
    const resolvedRole  = allowedRoles.includes(role) ? role : "customer";

    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, error: "Email already registered" });

    // password is plain text here — pre("save") hook hashes it once
    const user  = await User.create({
      name:     resolvedName,
      fullName: resolvedName,
      username: username || resolvedName.toLowerCase().replace(/\s+/g, "_"),
      email,
      password,          // plain text — hook hashes it
      role:     resolvedRole,
      mobile:   resolvedMobile,
      phone:    resolvedMobile,
      location: resolvedLocation,
      city:     resolvedLocation,
      address,
    });

    const token   = signToken(user._id);
    // user object from create() does NOT include password (select:false)
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: "Email and password required" });

    // +password explicitly fetches the field because it has select:false
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ success: false, error: "Invalid email or password" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(401).json({ success: false, error: "Invalid email or password" });

    if (user.status === "banned")
      return res.status(403).json({ success: false, error: "Your account has been banned" });

    const token    = signToken(user._id);
    // Fetch a clean copy without password to send back
    const safeUser = await User.findById(user._id);
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
