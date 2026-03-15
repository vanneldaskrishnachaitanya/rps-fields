const Rating  = require("../models/Rating");
const Order   = require("../models/Order");
const Product = require("../models/Product");

// POST /api/ratings  (customer rates a product they purchased)
const createRating = async (req, res) => {
  try {
    const { productId, orderId, stars, review } = req.body;

    if (!productId) return res.status(400).json({ success: false, error: "Product ID required" });
    if (!orderId)   return res.status(400).json({ success: false, error: "Order ID required" });
    if (!stars || stars < 1 || stars > 5)
      return res.status(400).json({ success: false, error: "Stars must be between 1 and 5" });

    // Verify the customer actually bought this product in this order
    const order = await Order.findOne({
      _id: orderId,
      customerId: req.user._id,
      "items.productId": productId,
    });
    if (!order) {
      return res.status(403).json({ success: false, error: "You can only rate products you have purchased" });
    }

    // Get farmerId and agentId from the order item
    const item = order.items.find(i => i.productId.toString() === productId);

    const rating = await Rating.create({
      productId,
      customerId: req.user._id,
      farmerId:   item.farmerId,
      agentId:    item.agentId,
      orderId,
      stars: parseInt(stars),
      review: review || "",
    });

    // Update product average rating
    await recalcProductRating(productId);

    res.status(201).json({ success: true, rating });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: "You have already rated this product for this order" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/ratings/product/:productId
const getProductRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ productId: req.params.productId })
      .populate("customerId", "name fullName")
      .sort({ createdAt: -1 });

    const avg = ratings.length
      ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      ratings,
      avgRating: parseFloat(avg),
      totalRatings: ratings.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/ratings/farmer/:farmerId — avg rating for a farmer
const getFarmerRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ farmerId: req.params.farmerId });
    const avg = ratings.length
      ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1)
      : 0;
    res.json({ success: true, avgRating: parseFloat(avg), totalRatings: ratings.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/ratings/eligible/:orderId — products in order that customer hasn't rated yet
const getEligibleRatings = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      customerId: req.user._id,
    });
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    const alreadyRated = await Rating.find({
      orderId: req.params.orderId,
      customerId: req.user._id,
    }).select("productId");

    const ratedIds = alreadyRated.map(r => r.productId.toString());
    const eligible = order.items.filter(i => !ratedIds.includes(i.productId.toString()));

    res.json({ success: true, eligible });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Helper — recalculate and save product avgRating
async function recalcProductRating(productId) {
  const ratings = await Rating.find({ productId });
  if (!ratings.length) return;
  const avg = ratings.reduce((s, r) => s + r.stars, 0) / ratings.length;
  await Product.findByIdAndUpdate(productId, {
    avgRating:    parseFloat(avg.toFixed(1)),
    totalRatings: ratings.length,
  });
}

module.exports = { createRating, getProductRatings, getFarmerRating, getEligibleRatings };
