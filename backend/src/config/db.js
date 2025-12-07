// src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in .env");
    process.exit(1);
  }

  try {
    // Optional, but avoids strictQuery warnings in newer Mongoose versions
    mongoose.set("strictQuery", true);

    await mongoose.connect(uri, {
    // useNewUrlParser: true,
     // useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
