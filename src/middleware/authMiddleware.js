// src/middleware/authMiddleware.js
// Task 2: JWT Verification Middleware
// Task 4: Role-Based Access Control Middleware

const { verifyAccessToken } = require('../config/jwt');

/**
 * TASK 2 — protect middleware
 * Reads the Authorization: Bearer <token> header,
 * verifies the signature, and attaches the decoded payload
 * to req.user for downstream handlers.
 */
function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token provided. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Attach decoded payload (id, email, role) to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Access token expired. Please refresh your token.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Authentication failed.',
    });
  }
}

/**
 * TASK 4 — restrictTo middleware factory
 * Returns a middleware that allows access only to the specified roles.
 * Must be used AFTER protect (requires req.user to be set).
 *
 * Usage: restrictTo('Admin', 'Premium_User')
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Access denied. This resource is restricted to: ${roles.join(', ')}.`,
      });
    }
    next();
  };
}

module.exports = { protect, restrictTo };
