// src/config/jwt.js
// JWT token generation and verification utilities

const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived Access Token.
 * Payload includes: id, email, role (NO passwords or sensitive data).
 */
function generateAccessToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
}

/**
 * Generate a long-lived Refresh Token.
 * Stored server-side and sent via httpOnly cookie.
 */
function generateRefreshToken(user) {
  const payload = { id: user.id };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

/**
 * Verify an Access Token.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 */
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Verify a Refresh Token.
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
