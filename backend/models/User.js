const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false means password is NEVER returned unless you explicitly ask for it
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ["customer", "farmer", "agent", "admin"], default: "customer" },
    mobile:   { type: String, trim: true },
    location: { type: String, trim: true },
    fullName: { type: String, trim: true },
    username: { type: String, trim: true },
    phone:    { type: String, trim: true },
    address:  { type: String, trim: true },
    city:     { type: String, trim: true },
    status:   { type: String, enum: ["active", "suspended", "banned"], default: "active" },
    savedProductIds: {
      type: [String],
      default: [],
    },
    comparedProductIds: {
      type: [String],
      default: [],
    },
    recentlyViewedProducts: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          img: { type: String, default: "" },
          price: { type: Number, default: 0 },
          unit: { type: String, default: "kg" },
          category: { type: String, default: "" },
          farmerLocation: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Hash plain-text password before saving — only when password field is changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare a plain-text password against the stored hash
userSchema.methods.matchPassword = async function (plainText) {
  return bcrypt.compare(plainText, this.password);
};

module.exports = mongoose.model("User", userSchema);
