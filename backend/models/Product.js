const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true, trim: true },
    pricePerKg:  { type: Number, required: true, min: 0 },
    unit:        { type: String, default: "kg", enum: ["kg", "litre", "piece", "dozen", "gram", "pack"] },
    quantity:    { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    farmerId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agentId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image:       { type: String, default: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80" },
    avgRating:   { type: Number, default: 0 },
    totalRatings:{ type: Number, default: 0 },
    price:       { type: Number },
    qty:         { type: Number },
    img:         { type: String },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

productSchema.pre("save", function (next) {
  this.price = this.pricePerKg;
  this.qty   = this.quantity;
  this.img   = this.image;
  next();
});

module.exports = mongoose.model("Product", productSchema);
