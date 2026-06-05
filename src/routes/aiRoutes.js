// src/routes/aiRoutes.js
// Task 4: Role-Based Access Control on AI endpoints

const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { freeModel, premiumModel, purgeCache } = require('../controllers/aiController');

const router = express.Router();

// All AI routes require authentication first
router.use(protect);

// GET  /api/ai/free-model    — All logged-in users
router.get('/free-model', freeModel);

// POST /api/ai/premium-model — Premium_User and Admin only
router.post('/premium-model', restrictTo('Premium_User', 'Admin'), premiumModel);

// DELETE /api/ai/purge-cache — Admin only
router.delete('/purge-cache', restrictTo('Admin'), purgeCache);

module.exports = router;
