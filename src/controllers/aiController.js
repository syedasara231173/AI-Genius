// src/controllers/aiController.js
// Task 4: Mock AI endpoints to demonstrate RBAC

/**
 * GET /api/ai/free-model
 * Accessible by ALL logged-in users (Free_User, Premium_User, Admin)
 */
function freeModel(req, res) {
  return res.status(200).json({
    status: 'success',
    message: '🤖 Free AI Model Response',
    data: {
      model: 'ai-genius-lite-v1',
      output: 'Hello! I am the free text model. Limited to 100 tokens per request.',
      user: req.user.email,
      role: req.user.role,
    },
  });
}

/**
 * POST /api/ai/premium-model
 * Accessible only by Premium_User and Admin
 */
function premiumModel(req, res) {
  return res.status(200).json({
    status: 'success',
    message: '🚀 Premium AI Model Response',
    data: {
      model: 'ai-genius-pro-v3',
      output: 'I am the premium text + image generation model. No token limits!',
      prompt: req.body.prompt || '(no prompt provided)',
      user: req.user.email,
      role: req.user.role,
    },
  });
}

/**
 * DELETE /api/ai/purge-cache
 * Accessible ONLY by Admin
 */
function purgeCache(req, res) {
  return res.status(200).json({
    status: 'success',
    message: '🗑️ AI Model Cache Purged',
    data: {
      action: 'cache_purged',
      models: ['ai-genius-lite-v1', 'ai-genius-pro-v3', 'ai-genius-image-v2'],
      purgedBy: req.user.email,
      timestamp: new Date().toISOString(),
    },
  });
}

module.exports = { freeModel, premiumModel, purgeCache };
