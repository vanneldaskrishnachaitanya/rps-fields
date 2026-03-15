const mongoose = require("mongoose");

const partnershipSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agentId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status:   { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Prevent duplicate partnership requests
partnershipSchema.index({ farmerId: 1, agentId: 1 }, { unique: true });

module.exports = mongoose.model("Partnership", partnershipSchema);
