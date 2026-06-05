// src/middleware/errorHandler.js
// Centralized error handling as required by Technical Constraints

function errorHandler(err, req, res, next) {
  // Default to 500 if no status code was set
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // JWT-specific errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please refresh or log in again.',
      code: 'TOKEN_EXPIRED',
    });
  }

  // Log in development, hide details in production
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', err);
    return res.status(statusCode).json({
      status,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production: generic message for unknown errors
  return res.status(statusCode).json({
    status,
    message: statusCode === 500 ? 'Something went wrong on our end.' : err.message,
  });
}

module.exports = errorHandler;
