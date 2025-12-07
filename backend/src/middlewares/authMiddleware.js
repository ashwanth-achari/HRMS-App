// src/middlewares/authMiddleware.js
const { initFirebaseAdmin, admin } = require("../config/firebaseAdmin");
const User = require("../models/User");

initFirebaseAdmin();

/**
 * Auth middleware:
 * - Reads Firebase ID token from Authorization header: "Bearer <token>"
 * - Verifies it with Firebase Admin
 * - Finds or creates a User in MongoDB
 * - Attaches user object to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    // decoded contains uid, email, etc.
    const firebaseUid = decoded.uid;
    const email = decoded.email?.toLowerCase();

    if (!firebaseUid || !email) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find or auto-create user in MongoDB
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Auto-provision basic user record on first login
      user = await User.create({
        firebaseUid,
        email,
        name: decoded.name || "", // if available
        // role defaults to EMPLOYEE
      });
      console.log("👤 Created new User in MongoDB for", email);
    }

    // Attach to req for later use in controllers
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
