const { pool } = require("../config/db");
const { verifyToken } = require("../utils/jwt");

// ── Verify JWT token ──────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token provided." });
  }

  try {
    const decoded = verifyToken(token);

    const [rows] = await pool.query(
      "SELECT id, uuid, name, email, role, is_active FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length || !rows[0].is_active) {
      return res.status(401).json({ success: false, message: "User not found or deactivated." });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid or expired." });
  }
};

// ── Role-based access control ──────────────────────────────────────────────────
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };