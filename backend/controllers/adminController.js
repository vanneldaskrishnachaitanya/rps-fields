const User        = require("../models/User");
const Product     = require("../models/Product");
const Order       = require("../models/Order");
const Rating      = require("../models/Rating");
const Partnership = require("../models/Partnership");

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role)   filter.role   = role;
    if (status) filter.status = status;
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/admin/users/:id/status  — suspend / ban / activate
const setUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "suspended", "banned"].includes(status))
      return res.status(400).json({ success: false, error: "Invalid status" });

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    // If banned farmer → remove their products
    if (user.role === "farmer" && status === "banned") {
      await Product.deleteMany({ farmerId: user._id });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/admin/farmers  — farmers with avg rating
const getFarmersWithRatings = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).sort({ createdAt: -1 });

    const result = await Promise.all(
      farmers.map(async (f) => {
        const ratings = await Rating.find({ farmerId: f._id });
        const orders  = await Order.countDocuments({ farmerIds: f._id });
        const avg     = ratings.length
          ? parseFloat((ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1))
          : 0;

        let qualityLabel = "No ratings yet";
        if (avg >= 4.0) qualityLabel = "Excellent";
        else if (avg >= 3.0) qualityLabel = "Average";
        else if (avg >= 2.0) qualityLabel = "Warning";
        else if (avg > 0)    qualityLabel = "Poor quality";

        return {
          ...f.toObject(),
          id: f._id,
          avgRating:    avg,
          totalRatings: ratings.length,
          totalOrders:  orders,
          qualityLabel,
        };
      })
    );
    res.json({ success: true, farmers: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/admin/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmerId", "name fullName")
      .populate("agentId",  "name fullName")
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/admin/products/:id
const removeProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [users, products, orders, ratings] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Rating.countDocuments(),
    ]);
    const farmers    = await User.countDocuments({ role: "farmer" });
    const agents     = await User.countDocuments({ role: "agent" });
    const customers  = await User.countDocuments({ role: "customer" });
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers: users, farmers, agents, customers,
        totalProducts: products,
        totalOrders: orders,
        totalRatings: ratings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getUsers, setUserStatus, deleteUser,
  getFarmersWithRatings,
  getProducts, removeProduct,
  getStats,
};
