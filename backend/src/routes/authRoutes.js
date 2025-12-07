// src/routes/authRoutes.js
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getMe } = require("../controllers/authController");

const router = express.Router();

// All routes here require authentication
router.get("/me", authMiddleware, getMe);

module.exports = router;
