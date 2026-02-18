const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT for the given user.
 * @param {number} id   - user's numeric DB id
 * @param {string} role - user role: 'user' | 'ngo' | 'admin'
 * @returns {string} signed JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {{ id: number, role: string, iat: number, exp: number }}
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };