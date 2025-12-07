// src/middlewares/roleMiddleware.js

/**
 * requireRole:
 * - Accepts one role OR an array of roles.
 * - Checks req.user.role (set by authMiddleware).
 * - If role not allowed → 403 Forbidden.
 *
 * Usage:
 *   router.get("/admin", authMiddleware, requireRole("MANAGEMENT_ADMIN"), handler);
 *   router.get("/manager", authMiddleware, requireRole(["MANAGEMENT_ADMIN", "SENIOR_MANAGER"]), handler);
 */
const requireRole = (allowedRoles) => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userRole = req.user.role;

    if (!userRole || !rolesArray.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
};

module.exports = requireRole;
