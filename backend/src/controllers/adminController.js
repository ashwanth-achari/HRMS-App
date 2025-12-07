// src/controllers/adminController.js
const { initFirebaseAdmin, admin } = require("../config/firebaseAdmin");
const User = require("../models/User");

initFirebaseAdmin();

// Allowed roles in the system
const ALLOWED_ROLES = [
  "MANAGEMENT_ADMIN",
  "SENIOR_MANAGER",
  "HR_RECRUITER",
  "EMPLOYEE",
];

/**
 * POST /api/admin/users
 * Creates a new user in Firebase Auth + MongoDB with a given role.
 * Only accessible by MANAGEMENT_ADMIN (enforced via route + requireRole).
 *
 * Expected body:
 * {
 *   "email": "newuser@company.com",
 *   "password": "Temp@1234",
 *   "name": "New User",
 *   "role": "EMPLOYEE",                 // optional, default EMPLOYEE
 *   "department": "Engineering",        // optional
 *   "managerId": "65f..."               // optional (ObjectId string)
 * }
 */
const createUser = async (req, res) => {
  try {
    const { email, password, name, role, department, managerId } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const finalRole = role || "EMPLOYEE";

    if (!ALLOWED_ROLES.includes(finalRole)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    // Check if Mongo user already exists with this email
    const existingMongoUser = await User.findOne({ email: normalizedEmail });
    if (existingMongoUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists in database" });
    }

    // Check if Firebase user already exists with this email
    let firebaseUser;
    try {
      // Try to get user by email
      firebaseUser = await admin.auth().getUserByEmail(normalizedEmail);
      // If found, return conflict
      return res.status(409).json({
        message: "User with this email already exists in Firebase Auth",
      });
    } catch (err) {
      // If error is "user not found", we can create
      if (err.code !== "auth/user-not-found") {
        console.error("Error checking Firebase user:", err);
        return res
          .status(500)
          .json({ message: "Error checking Firebase user", error: err.code });
      }
    }

    // Create user in Firebase Auth
    const createdFirebaseUser = await admin.auth().createUser({
      email: normalizedEmail,
      password,
      displayName: name || "",
      emailVerified: false,
      disabled: false,
    });

    // Create user in MongoDB with role + link to Firebase uid
    const mongoUser = await User.create({
      firebaseUid: createdFirebaseUser.uid,
      email: normalizedEmail,
      name: name || "",
      role: finalRole,
      department: department || null,
      managerId: managerId || null,
      status: "ACTIVE",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: mongoUser._id,
        firebaseUid: mongoUser.firebaseUid,
        email: mongoUser.email,
        name: mongoUser.name,
        role: mongoUser.role,
        department: mongoUser.department,
        managerId: mongoUser.managerId,
        status: mongoUser.status,
      },
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    return res.status(500).json({
      message: "Internal server error while creating user",
      error: err.message,
    });
  }
};

module.exports = {
  createUser,
};
