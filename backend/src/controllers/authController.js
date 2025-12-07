// src/controllers/authController.js

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile & role
 * Requires authMiddleware to have run before.
 */
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = req.user;

  res.json({
    id: user._id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    name: user.name,
    role: user.role,
    department: user.department,
    managerId: user.managerId,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

module.exports = {
  getMe,
};
