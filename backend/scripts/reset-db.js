/**
 * Run this ONCE to wipe the database and re-seed with correct passwords.
 * Usage:  node scripts/reset-db.js
 */
require("dotenv").config();
const mongoose = require("mongoose");

async function reset() {
  console.log("🔄 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection.db;
  const dbName = db.databaseName;

  console.log(`⚠  Dropping database: ${dbName}`);
  await db.dropDatabase();
  console.log(`✅ Database "${dbName}" dropped successfully.`);
  console.log("   Now restart the server with:  npm start");
  console.log("   It will auto-seed fresh demo accounts on startup.");

  await mongoose.disconnect();
  process.exit(0);
}

reset().catch(err => {
  console.error("❌ Reset failed:", err.message);
  process.exit(1);
});
