const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    await dropStaleIndexes(conn);
    await seedDemoData();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

async function dropStaleIndexes(conn) {
  try {
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    if (!collections.find(c => c.name === "users")) return;
    const indexes = await db.collection("users").indexes();
    for (const idx of indexes) {
      if (["firebaseUid", "googleId", "facebookId"].some(s => idx.name.includes(s))) {
        await db.collection("users").dropIndex(idx.name);
        console.log(`🧹 Dropped stale index: ${idx.name}`);
      }
    }
  } catch (err) {
    console.warn("⚠ Index cleanup (non-fatal):", err.message);
  }
}

async function seedDemoData() {
  try {
    const User        = require("../models/User");
    const Product     = require("../models/Product");
    const Partnership = require("../models/Partnership");

    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`ℹ  DB has ${count} users — skipping seed`);
      return;
    }

    console.log("🌱 Seeding demo data...");

    // Admin user — role must be "admin", password hashed by pre-save hook
    await User.create({
      name: "Admin",      fullName: "Admin",      username: "admin",
      email: "admin@rpsfields.in", password: "admin123", role: "admin",
      mobile: "9000000000", phone: "9000000000",
      location: "Mumbai", city: "Mumbai", status: "active",
    });

    const farmer1 = await User.create({
      name: "Ravi Kumar",   fullName: "Ravi Kumar",   username: "ravikumar",
      email: "ravi@farm.in",   password: "farm1234",  role: "farmer",
      mobile: "9876543210",    phone: "9876543210",
      location: "Pune, Maharashtra",  city: "Pune",
      address: "Village Sinhagad, Pune", status: "active",
    });

    const farmer2 = await User.create({
      name: "Abdul Khan",   fullName: "Abdul Khan",   username: "abdulkhan",
      email: "abdul@farm.in",  password: "farm1234",  role: "farmer",
      mobile: "9123456780",    phone: "9123456780",
      location: "Srinagar, Kashmir", city: "Srinagar",
      address: "Srinagar Valley",    status: "active",
    });

    const agent1 = await User.create({
      name: "Priya Sharma", fullName: "Priya Sharma", username: "priyasharma",
      email: "priya@agent.in", password: "agent1234", role: "agent",
      mobile: "9988776655",    phone: "9988776655",
      location: "Mumbai, Maharashtra", city: "Mumbai", status: "active",
    });

    await User.create({
      name: "Test Customer", fullName: "Test Customer", username: "testcustomer",
      email: "customer@test.in", password: "cust1234", role: "customer",
      mobile: "9000000001",      phone: "9000000001",
      location: "Hyderabad, Telangana", city: "Hyderabad", status: "active",
    });

    await Partnership.create({ farmerId: farmer1._id, agentId: agent1._id, status: "accepted" });
    await Partnership.create({ farmerId: farmer2._id, agentId: agent1._id, status: "accepted" });

    const products = [
      { name:"Fresh Tomatoes",    category:"Vegetables", pricePerKg:45,  quantity:120, farmerId:farmer1._id,
        description:"Farm-fresh tomatoes harvested daily. Rich in lycopene and natural sugars.",
        image:"https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400&q=80" },
      { name:"Alphonso Mangoes",  category:"Fruits",     pricePerKg:380, quantity:50,  farmerId:farmer1._id,
        description:"Premium Alphonso mangoes directly from orchards. Naturally ripened, zero chemicals.",
        image:"https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80" },
      { name:"Basmati Rice",      category:"Grains",     pricePerKg:95,  quantity:500, farmerId:farmer1._id,
        description:"Aged basmati rice with long grains and aromatic fragrance.",
        image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80" },
      { name:"Baby Spinach",      category:"Vegetables", pricePerKg:28,  quantity:90,  farmerId:farmer1._id,
        description:"Tender baby spinach leaves rich in iron and vitamins. Pesticide-free.",
        image:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80" },
      { name:"Strawberries",      category:"Fruits",     pricePerKg:180, quantity:40,  farmerId:farmer1._id,
        description:"Plump juicy strawberries from Mahabaleshwar. Naturally sweet.",
        image:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80" },
      { name:"Whole Wheat Flour", category:"Grains",     pricePerKg:42,  quantity:400, farmerId:farmer1._id,
        description:"Stone-ground whole wheat flour from heritage grain varieties.",
        image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80" },
      { name:"Premium Almonds",   category:"Dry Fruits", pricePerKg:720, quantity:80,  farmerId:farmer2._id,
        description:"Hand-picked Kashmiri almonds. Sun-dried and vacuum packed.",
        image:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80" },
      { name:"Kashmiri Walnuts",  category:"Dry Fruits", pricePerKg:850, quantity:60,  farmerId:farmer2._id,
        description:"Fresh walnuts rich in omega-3. Direct from Kashmir orchards.",
        image:"https://images.unsplash.com/photo-1605725639823-9e4f4e3c0591?w=400&q=80" },
      { name:"Organic Milk",      category:"Dairy",      pricePerKg:62,  quantity:200, farmerId:farmer2._id,
        description:"Pure A2 cow milk from grass-fed desi cows. Collected fresh every morning.",
        image:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80" },
    ];

    for (const p of products) {
      await Product.create({ ...p, agentId: agent1._id, price: p.pricePerKg, qty: p.quantity, img: p.image });
    }

    console.log("✅ Seed done:");
    console.log("   🛡 admin@rpsfields.in  / admin123   (Admin)");
    console.log("   🌾 ravi@farm.in        / farm1234   (Farmer)");
    console.log("   🌾 abdul@farm.in       / farm1234   (Farmer)");
    console.log("   🏢 priya@agent.in      / agent1234  (Agent)");
    console.log("   🛒 customer@test.in    / cust1234   (Customer)");

  } catch (err) {
    console.warn("⚠ Seed warning (non-fatal):", err.message);
  }
}

module.exports = connectDB;
