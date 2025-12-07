// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 1) Load environment variables FIRST
dotenv.config();

// 2) Now safely import DB + routes (they can read process.env)
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const adminRoutes = require("./src/routes/adminRoutes");

// 3) Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // change to your frontend URL if needed
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    message: "HRMS backend is running 🚀",
  });
});

// Auth routes (login info from backend)
app.use("/api/auth", authRoutes);

// Dashboard routes (role-based dashboards)
app.use("/api/dashboard", dashboardRoutes);

// Admin routes (user management, protected by MANAGEMENT_ADMIN role)
// ❗ Comment this line if you removed adminRoutes.js
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
