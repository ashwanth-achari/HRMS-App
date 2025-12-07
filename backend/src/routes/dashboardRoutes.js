// src/routes/dashboardRoutes.js
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const {
  getAdminDashboard,
  getManagerDashboard,
  getRecruiterDashboard,
  getEmployeeDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();

// Admin dashboard: only MANAGEMENT_ADMIN
router.get(
  "/admin",
  authMiddleware,
  requireRole("MANAGEMENT_ADMIN"),
  getAdminDashboard
);

// Manager dashboard: SENIOR_MANAGER + MANAGEMENT_ADMIN
router.get(
  "/manager",
  authMiddleware,
  requireRole(["SENIOR_MANAGER", "MANAGEMENT_ADMIN"]),
  getManagerDashboard
);

// Recruiter dashboard: HR_RECRUITER + SENIOR_MANAGER + MANAGEMENT_ADMIN
router.get(
  "/recruiter",
  authMiddleware,
  requireRole(["HR_RECRUITER", "SENIOR_MANAGER", "MANAGEMENT_ADMIN"]),
  getRecruiterDashboard
);

// Employee dashboard: any authenticated role can see (no requireRole)
router.get("/employee", authMiddleware, getEmployeeDashboard);

module.exports = router;
