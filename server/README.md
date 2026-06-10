# SaaS Multi-User Backend (Express + MongoDB)

Production-ready CommonJS backend with JWT auth and role-based access (`admin`, `sales`).

## Setup

```bash
cd server
npm install
cp .env.example .env   # edit values
npm run dev            # or: npm start
```

`.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/saas_app
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=*
```

## Project Structure
```
server/
  config/db.js
  controllers/authController.js
  controllers/userController.js
  middleware/authMiddleware.js
  models/User.js
  routes/authRoutes.js
  routes/userRoutes.js
  index.js
```

## Roles
- **admin** – full access; can create/list/delete users.
- **sales** – default role; can authenticate and use app features, cannot manage users.

## SaaS Flow
1. Admin signs up via `POST /api/auth/register` (role is always forced to `admin`).
2. Admin logs in via `POST /api/auth/login` → receives JWT.
3. Admin creates sales members via `POST /api/users`.
4. Sales members log in and use protected endpoints (cannot hit `/api/users`).

## Endpoints

### Auth
| Method | Path                | Access | Description |
| ------ | ------------------- | ------ | ----------- |
| POST   | `/api/auth/register`| Public | Creates an **admin** account. Any `role` in body is ignored. |
| POST   | `/api/auth/login`   | Public | Returns `{ user, token }`. |
| GET    | `/api/auth/me`      | Auth   | Current user profile. |

### Users (admin only)
| Method | Path             | Description |
| ------ | ---------------- | ----------- |
| POST   | `/api/users`     | Create user (default role `sales`; `admin` allowed server-side). |
| GET    | `/api/users`     | List all users. |
| GET    | `/api/users/:id` | Get one user. |
| DELETE | `/api/users/:id` | Delete user. |

All protected routes require header:
```
Authorization: Bearer <jwt-token>
```

## Example requests (Postman / curl)

### 1. Register first admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Owner","email":"owner@acme.com","password":"secret123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@acme.com","password":"secret123"}'
```
Copy `token` from response.

### 3. Get current user
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. Admin creates a sales member
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam Sales","email":"sam@acme.com","password":"secret123","role":"sales"}'
```

### 5. List users
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 6. Delete user
```bash
curl -X DELETE http://localhost:5000/api/users/<USER_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## Security
- Passwords hashed via bcrypt pre-save hook (`select: false`, never returned).
- `toJSON` strips `password` and `__v`.
- Email is unique + lowercased.
- Role is enum-validated; `/auth/register` ignores client role and forces `admin`.
- JWT contains only `{ id, role }`; verified on every protected request, then user re-loaded from DB.
- `helmet` security headers, `cors`, JSON body size limit.
- Global + auth-specific `express-rate-limit`.
- Centralized error handler; structured 404 handler.
- `morgan` request logging.

## Postman collection (importable JSON)
See `postman_collection.json` in this folder.
