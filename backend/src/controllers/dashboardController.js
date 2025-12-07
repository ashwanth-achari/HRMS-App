// src/controllers/dashboardController.js
const AttendanceRecord = require("../models/AttendanceRecord");
const Payroll = require("../models/Payroll");
// We keep placeholders for other dashboards for now

// ===== Small date helpers =====
const getStartOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getEndOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
};

// ===== 1. ADMIN DASHBOARD (placeholder) =====
const getAdminDashboard = async (req, res) => {
  res.json({
    dashboard: "ADMIN",
    message: "Admin dashboard data placeholder - upcoming feature",
    user: {
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// ===== 2. MANAGER DASHBOARD (placeholder) =====
const getManagerDashboard = async (req, res) => {
  res.json({
    dashboard: "MANAGER",
    message: "Manager dashboard data placeholder - upcoming feature",
    user: {
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// ===== 3. RECRUITER DASHBOARD (placeholder) =====
const getRecruiterDashboard = async (req, res) => {
  res.json({
    dashboard: "RECRUITER",
    message: "Recruiter dashboard data placeholder - upcoming feature",
    user: {
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// ===== 4. EMPLOYEE DASHBOARD (REAL DATA: Attendance + Payroll) =====
/**
 * GET /api/dashboard/employee
 * Uses:
 *  - AttendanceRecord  → My attendance this month
 *  - Payroll           → Last payroll
 */
const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // ----- 1) Attendance this month -----
    const startOfMonth = getStartOfCurrentMonth();
    const endOfMonth = getEndOfCurrentMonth();

    const monthlyAttendance = await AttendanceRecord.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();

    const workingRecords = monthlyAttendance.filter((rec) =>
      ["PRESENT", "ABSENT", "ON_LEAVE"].includes(rec.status)
    );

    const workingDays = workingRecords.length;
    const presentDays = workingRecords.filter((rec) => rec.status === "PRESENT").length;

    const attendancePercentage =
      workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

    const attendanceThisMonth = {
      percentage: attendancePercentage,
      presentDays,
      workingDays,
    };

    // ----- 2) Last payroll -----
    const lastPayrollDoc = await Payroll.findOne({ userId })
      .sort({ year: -1, month: -1 })
      .lean();

    let lastPayroll = null;
    if (lastPayrollDoc) {
      lastPayroll = {
        amount: lastPayrollDoc.amount,
        currency: lastPayrollDoc.currency || "INR",
        month: lastPayrollDoc.month,
        year: lastPayrollDoc.year,
        creditedOn: lastPayrollDoc.creditedOn,
        status: lastPayrollDoc.status,
      };
    }

    return res.json({
      dashboard: "EMPLOYEE",
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
      summaryCards: {
        attendanceThisMonth,
        lastPayroll,
      },
      // Other sections will be added later
      upcomingFeatures: [
        "Leave balance",
        "Performance trend",
        "Recent activity timeline",
      ],
    });
  } catch (err) {
    console.error("Error in getEmployeeDashboard:", err);
    return res.status(500).json({
      message: "Failed to load employee dashboard",
      error: err.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getManagerDashboard,
  getRecruiterDashboard,
  getEmployeeDashboard,
};
