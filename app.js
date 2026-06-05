// app.js — Main Express application setup
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const { seedUsers } = require('./src/models/userStore');
const authRoutes = require('./src/routes/authRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(express.json());          // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());          // Parse cookies (needed to read refreshToken)

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Root health-check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '🧠 AI-Genius API is running.',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
      },
      ai: {
        freeModel: 'GET /api/ai/free-model',
        premiumModel: 'POST /api/ai/premium-model',
        purgeCache: 'DELETE /api/ai/purge-cache',
      },
    },
    testAccounts: {
      admin: { email: 'admin@ai-genius.com', password: 'admin123' },
      premium: { email: 'premium@ai-genius.com', password: 'premium123' },
      free: { email: 'free@ai-genius.com', password: 'free123' },
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.all('/{*path}', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Centralized Error Handler (Task: Technical Constraints) ─────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

seedUsers().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║        🧠 AI-Genius API Server Running           ║
║  Port    : ${PORT}                                  ║
║  Mode    : ${process.env.NODE_ENV || 'development'}                        ║
╠══════════════════════════════════════════════════╣
║  Test Accounts:                                  ║
║  admin@ai-genius.com    / admin123               ║
║  premium@ai-genius.com  / premium123             ║
║  free@ai-genius.com     / free123                ║
╚══════════════════════════════════════════════════╝
    `);
  });
}).catch(console.error);

module.exports = app;
