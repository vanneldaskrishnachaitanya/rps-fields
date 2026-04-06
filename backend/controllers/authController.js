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


// ── In-memory OTP store (10 min expiry per email) ──
const otpStore = new Map();

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: "Email required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: "No account found with this email" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000, verified: false });
    console.log(`[ForgotPassword] OTP for ${email}: ${otp}`);
    const isDev = process.env.NODE_ENV !== "production";
    res.json({ success: true, message: "OTP sent to your email", ...(isDev && { devOtp: otp }) });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, error: "Email and OTP required" });
    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ success: false, error: "No OTP requested for this email" });
    if (Date.now() > record.expires) { otpStore.delete(email); return res.status(400).json({ success: false, error: "OTP expired. Request a new one." }); }
    if (record.otp !== otp.trim()) return res.status(400).json({ success: false, error: "Invalid OTP" });
    otpStore.set(email, { ...record, verified: true });
    const resetToken = jwt.sign({ email, purpose: "reset" }, process.env.JWT_SECRET, { expiresIn: "10m" });
    res.json({ success: true, resetToken });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ success: false, error: "All fields required" });
    if (newPassword.length < 6) return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    const record = otpStore.get(email);
    if (!record || !record.verified || record.otp !== otp.trim()) return res.status(400).json({ success: false, error: "Invalid or expired OTP. Please restart." });
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    user.password = newPassword;
    await user.save();
    otpStore.delete(email);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

module.exports = { register, login, getMe, forgotPassword, verifyOtp, resetPassword };
