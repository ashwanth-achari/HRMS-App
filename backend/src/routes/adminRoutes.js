// src/routes/adminRoutes.js
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const { createUser } = require("../controllers/adminController");

const router = express.Router();

// Admin-only route: create new user
router.post(
  "/users",
  authMiddleware,
  requireRole("MANAGEMENT_ADMIN"),
  createUser
);

module.exports = router;
