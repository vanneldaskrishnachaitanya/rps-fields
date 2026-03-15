const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:        { type: String, required: true },
  pricePerKg:  { type: Number, required: true },
  quantity:    { type: Number, required: true },
  totalPrice:  { type: Number, required: true },
  image:       { type: String },
  farmerId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  agentId:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    customerId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items:           [orderItemSchema],
    totalPrice:      { type: Number, required: true },
    status:          { type: String, enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"], default: "confirmed" },
    deliveryAddress: { type: String, required: true },
    city:            { type: String, required: true },
    phone:           { type: String, required: true },
    // Denormalised for quick dashboard queries
    farmerIds:       [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    agentIds:        [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Order", orderSchema);
