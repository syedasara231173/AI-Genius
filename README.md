# AI-Genius — JWT Auth & RBAC Backend

**Assignment 03 | MA 216 – Web Engineering and AI | Air University**

---

## Project Overview

Secure, stateless authentication and authorization subsystem for the **AI-Genius** SaaS platform. Implements JWT-based login with dual tokens, silent refresh, and Role-Based Access Control (RBAC).

---

## Architecture

```
ai-genius/
├── app.js                          # Express entry point
├── .env                            # Secret keys (DO NOT commit)
├── .env.example                    # Template (safe to commit)
├── AI-Genius-Postman-Collection.json
└── src/
    ├── models/
    │   └── userStore.js            # Mock in-memory DB + refresh token whitelist
    ├── config/
    │   └── jwt.js                  # Token generation & verification utilities
    ├── controllers/
    │   ├── authController.js       # Login, Refresh, Logout logic
    │   └── aiController.js         # Mock AI endpoints
    ├── middleware/
    │   ├── authMiddleware.js       # protect + restrictTo middleware
    │   └── errorHandler.js        # Centralized error handler
    └── routes/
        ├── authRoutes.js
        └── aiRoutes.js
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your secrets

# 3. Start the server
npm start
```

---

## API Endpoints

### Authentication

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login; returns accessToken in body, refreshToken in httpOnly cookie |
| POST | `/api/auth/refresh` | Issue new accessToken using refreshToken cookie |
| POST | `/api/auth/logout` | Revoke refresh token & clear cookie |

### AI Endpoints (RBAC)

| Method | Route | Roles Allowed |
|--------|-------|---------------|
| GET | `/api/ai/free-model` | Free_User, Premium_User, Admin |
| POST | `/api/ai/premium-model` | Premium_User, Admin |
| DELETE | `/api/ai/purge-cache` | Admin only |

---

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@ai-genius.com | admin123 | Admin |
| premium@ai-genius.com | premium123 | Premium_User |
| free@ai-genius.com | free123 | Free_User |

---

## Task Implementation Map

| Task | Requirement | File |
|------|-------------|------|
| Task 1 | Database setup + Login endpoint | `src/models/userStore.js`, `src/controllers/authController.js` |
| Task 2 | JWT payload design + `protect` middleware | `src/config/jwt.js`, `src/middleware/authMiddleware.js` |
| Task 3 | Refresh token endpoint | `src/controllers/authController.js` → `refresh()` |
| Task 4 | `restrictTo()` RBAC factory + 3 AI endpoints | `src/middleware/authMiddleware.js`, `src/routes/aiRoutes.js` |

---

## Security Features

- ✅ Passwords hashed with **bcrypt** (salt rounds: 12)
- ✅ Access Token: 15 min, sent in JSON body
- ✅ Refresh Token: 7 days, `httpOnly` + `secure` + `sameSite=strict` cookie
- ✅ Server-side refresh token **whitelist** (prevents reuse after logout)
- ✅ All secrets in **`.env`** via `dotenv`
- ✅ **Centralized error handler** with correct 401/403 HTTP codes
- ✅ JWT payload contains `id`, `email`, `role` — **no passwords**

---

## Testing with Postman

1. Import `AI-Genius-Postman-Collection.json` into Postman
2. Set `BASE_URL` collection variable to `http://localhost:3000`
3. Run requests in order — token auto-saves via test scripts
