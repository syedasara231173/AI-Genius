// src/controllers/authController.js
// Task 1: Login endpoint — credential verification + dual-token issuance
// Task 3: Refresh endpoint — silent access token renewal

const bcrypt = require('bcryptjs');
const {
  findUserByEmail,
  storeRefreshToken,
  isRefreshTokenValid,
  deleteRefreshToken,
  findUserById,
} = require('../models/userStore');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');

// Cookie options for the Refresh Token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,       // Not accessible via JavaScript (XSS protection)
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',   // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

/**
 * TASK 1 — POST /api/auth/login
 * 1. Find user by email
 * 2. Compare password with bcrypt
 * 3. Issue Access Token (JSON response) + Refresh Token (httpOnly cookie)
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password.',
      });
    }

    // Find user in mock DB
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials.',
      });
    }

    // Verify password using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials.',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Persist refresh token in server-side store (whitelist)
    storeRefreshToken(user.id, refreshToken);

    // Send Refresh Token as secure httpOnly cookie
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    // Send Access Token in JSON response body
    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * TASK 3 — POST /api/auth/refresh
 * 1. Read Refresh Token from httpOnly cookie
 * 2. Verify against DB whitelist
 * 3. Issue a fresh Access Token
 */
async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No refresh token found. Please log in again.',
      });
    }

    // Verify JWT signature and expiry
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired refresh token. Please log in again.',
      });
    }

    // Validate against server-side whitelist (prevents token reuse after logout)
    if (!isRefreshTokenValid(decoded.id, token)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Refresh token revoked. Please log in again.',
      });
    }

    // Look up the full user record to get current role
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User no longer exists.',
      });
    }

    // Issue a new Access Token
    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      status: 'success',
      message: 'Access token refreshed.',
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Revokes the refresh token from the server whitelist and clears the cookie.
 */
async function logout(req, res, next) {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = verifyRefreshToken(token);
        deleteRefreshToken(decoded.id);
      } catch (_) {
        // Token already invalid — still clear cookie
      }
    }

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });

    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, refresh, logout };
