const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // null = global
  type: { type: String, enum: ["product", "order", "delivery", "system"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
