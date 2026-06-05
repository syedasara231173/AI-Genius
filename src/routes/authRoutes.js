// src/routes/authRoutes.js
const express = require('express');
const { login, refresh, logout } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/login   — Task 1
router.post('/login', login);

// POST /api/auth/refresh — Task 3
router.post('/refresh', refresh);

// POST /api/auth/logout  — Bonus: token revocation
router.post('/logout', logout);

module.exports = router;
