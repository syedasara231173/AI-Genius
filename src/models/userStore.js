// src/models/userStore.js
// Mock in-memory database for AI-Genius platform
// In production, replace with MongoDB or PostgreSQL

const bcrypt = require('bcryptjs');

// Pre-hashed passwords (hashed at startup for demo)
// Plain passwords: admin123, premium123, free123
let users = [];

// Whitelist of valid refresh tokens { userId -> refreshToken }
const refreshTokenStore = new Map();

async function seedUsers() {
  users = [
    {
      id: '1',
      email: 'admin@ai-genius.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'Admin',
    },
    {
      id: '2',
      email: 'premium@ai-genius.com',
      password: await bcrypt.hash('premium123', 12),
      role: 'Premium_User',
    },
    {
      id: '3',
      email: 'free@ai-genius.com',
      password: await bcrypt.hash('free123', 12),
      role: 'Free_User',
    },
  ];
}

function findUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}

function storeRefreshToken(userId, token) {
  refreshTokenStore.set(userId, token);
}

function getRefreshToken(userId) {
  return refreshTokenStore.get(userId) || null;
}

function deleteRefreshToken(userId) {
  refreshTokenStore.delete(userId);
}

function isRefreshTokenValid(userId, token) {
  return refreshTokenStore.get(userId) === token;
}

module.exports = {
  seedUsers,
  findUserByEmail,
  findUserById,
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  isRefreshTokenValid,
};
