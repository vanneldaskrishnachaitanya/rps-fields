const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    productId:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    farmerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    agentId:    { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    orderId:    { type: mongoose.Schema.Types.ObjectId, ref: "Order",   required: true },
    stars:      { type: Number, required: true, min: 1, max: 5 },
    review:     { type: String, trim: true, default: "" },
  },
  { timestamps: { createdAt: "createdAt" } }
);

// One review per customer per product per order
ratingSchema.index({ productId: 1, customerId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
