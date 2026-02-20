# YourVoice Hub — Backend API

> AI-Powered Inclusive Support Platform for Mental Health & GBV Support in Rwanda

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-red.svg)](https://jwt.io/)

---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Security](#security)
- [Testing](#testing)
- [Team](#team)

---

## 🎯 About

YourVoice Hub is a web-based platform designed to provide confidential mental health support and facilitate reporting of gender-based violence (GBV) in Rwanda. The platform features:

- **AI-powered chat** for preliminary mental health guidance
- **Secure case submission** with multimedia file support
- **Automatic NGO referrals** for urgent cases
- **NGO dashboard** for case management and analytics
- **Admin panel** for user and system management

**Target Users:**
- Primary: Individuals seeking mental health or abuse support
- Secondary: NGOs, mental health professionals, Isange One Stop Center staff

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript backend runtime |
| **Framework** | Express.js 4.18 | Web application framework |
| **Database** | MySQL 8.0 | Relational database |
| **Auth** | JWT + bcryptjs | Token-based authentication & password hashing |
| **File Upload** | Multer | Multipart form data handling |
| **Validation** | express-validator | Request validation middleware |

---

## 📁 Project Structure

```
yourvoice-backend/
├── server.js                   # Entry point - Express app setup
├── package.json                # Dependencies & scripts
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
│
├── config/
│   ├── db.js                   # MySQL connection pool
│   └── schema.sql              # Complete database schema
│
├── models/                     # Data access layer (SQL queries)
│   ├── User.js                 # User CRUD operations
│   ├── Case.js                 # Case management
│   ├── Multimedia.js           # File attachments
│   ├── AiLog.js                # AI chat history
│   ├── Notification.js         # NGO referral notifications
│   └── NgoOrganization.js      # NGO profiles
│
├── controllers/                # Business logic
│   ├── authController.js       # Register, login, profile
│   ├── caseController.js       # Case submission & management
│   ├── aiController.js         # AI chat engine
│   ├── ngoController.js        # NGO dashboard & reports
│   └── adminController.js      # Admin user management
│
├── middleware/
│   ├── auth.js                 # JWT verification & role-based access
│   ├── upload.js               # Multer file upload configuration
│   └── error.js                # Global error handler
│
├── routes/                     # API endpoints
│   ├── auth.js                 # /api/auth/*
│   ├── cases.js                # /api/cases/*
│   ├── ai.js                   # /api/ai/*
│   ├── ngo.js                  # /api/ngo/*
│   └── admin.js                # /api/admin/*
│
├── utils/                      # Shared utilities
│   ├── jwt.js                  # JWT token generation/verification
│   ├── response.js             # Standardized API responses
│   ├── aiEngine.js             # AI intent detection & responses
│   └── reports.js              # Analytics queries
│
└── uploads/                    # File storage
    ├── cases/                  # Case submission files
    └── avatars/                # User profile pictures (future)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MySQL** 8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** (comes with Node.js)

### Installation

1. **Extract the project**
   ```bash
   unzip yourvoice-backend-final.zip
   cd yourvoice-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `DB_PASSWORD` → your MySQL root password
   - `JWT_SECRET` → generate a strong random key (32+ characters)

4. **Create database and run schema**
   ```bash
   mysql -u root -p < config/schema.sql
   ```
   
   When prompted, enter your MySQL root password.

5. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   Expected response:
   ```json
   {
     "success": true,
     "message": "YourVoice Hub API is running 🚀",
     "version": "1.0.0",
     "timestamp": "2026-02-18T..."
   }
   ```

---

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Environment | `development` | No |
| `DB_HOST` | MySQL host | `localhost` | Yes |
| `DB_PORT` | MySQL port | `3306` | Yes |
| `DB_USER` | MySQL user | `root` | Yes |
| `DB_PASSWORD` | MySQL password | - | **Yes** |
| `DB_NAME` | Database name | `yourvoice_hub` | Yes |
| `JWT_SECRET` | Secret for signing JWT tokens | - | **Yes** |
| `JWT_EXPIRES_IN` | Token expiration | `7d` | No |
| `UPLOAD_MAX_SIZE` | Max file size in bytes | `10485760` (10MB) | No |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` | Yes |

---

## 💾 Database Setup

### Manual Setup

1. **Login to MySQL**
   ```bash
   mysql -u root -p
   ```

2. **Create database**
   ```sql
   CREATE DATABASE yourvoice_hub;
   USE yourvoice_hub;
   ```

3. **Run schema**
   ```bash
   source config/schema.sql;
   ```

4. **Verify tables**
   ```sql
   SHOW TABLES;
   ```
   
   You should see:
   - `users`
   - `cases`
   - `multimedia`
   - `ai_guidance_logs`
   - `ngo_notifications`
   - `ngo_organizations`

### Database Schema Overview

```
users                → User accounts (role: user/ngo/admin)
  ├── cases          → Case submissions (GBV, abuse, mental health)
  │    ├── multimedia         → Attached files
  │    └── ngo_notifications  → Referrals to NGOs
  └── ai_guidance_logs → AI chat history
  
ngo_organizations → NGO profile details
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

All protected routes require an `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Authentication (`/api/auth`)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Umubyeyi",
  "email": "alice@example.com",
  "password": "securepass123",
  "role": "user",           // optional: user | ngo
  "phone": "+250788000000", // optional
  "location": "Kigali"      // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uuid": "a1b2c3d4-...",
    "name": "Alice Umubyeyi",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Updated",
  "phone": "+250788111111",
  "location": "Kigali, Rwanda"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

---

### 📁 Cases (`/api/cases`)

#### Submit a Case (with files)
```http
POST /api/cases
Authorization: Bearer <token>
Content-Type: multipart/form-data

type: mental_health | abuse | gbv | trauma | other
description: "I have been experiencing severe anxiety..."
is_anonymous: true | false
files: [file1.jpg, audio.mp3, document.pdf]  // Max 5 files, 10MB each
```

**Auto-Priority Assignment:**
- `gbv` → `urgent` (auto-notifies NGOs)
- `abuse`, `trauma` → `high` (auto-notifies NGOs)
- `mental_health` → `medium`
- `other` → `low`

#### Get My Cases
```http
GET /api/cases?status=pending&type=gbv&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Case
```http
GET /api/cases/:uuid
Authorization: Bearer <token>
```

#### Update Case Status (NGO/Admin only)
```http
PUT /api/cases/:uuid/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "reviewed" | "referred" | "closed"
}
```

#### Delete Case
```http
DELETE /api/cases/:uuid
Authorization: Bearer <token>
```

---

### 🤖 AI Chat (`/api/ai`)

#### Send Message
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I'm feeling very anxious lately",
  "session_id": "optional-session-uuid"  // omit to start new session
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "abc-123-...",
  "response": "Thank you for sharing that with me...",
  "intent": "mental_health",
  "suggest_case_submission": false
}
```

**Intent Detection:**
- `greet` → Welcome messages
- `mental_health` → Anxiety, depression, stress
- `abuse` → Physical/emotional abuse
- `gbv` → Gender-based violence (URGENT)
- `trauma` → PTSD, flashbacks
- `loneliness` → Isolation
- `crisis` → Suicide, self-harm (returns emergency number)
- `default` → General support

#### Get Chat History
```http
GET /api/ai/history?page=1&limit=20
Authorization: Bearer <token>
```

#### Get Session Messages
```http
GET /api/ai/sessions/:session_id
Authorization: Bearer <token>
```

---

### 🏢 NGO Dashboard (`/api/ngo`)

> **Access:** `ngo` or `admin` role required

#### Get All Cases
```http
GET /api/ngo/cases?status=pending&type=gbv&priority=urgent&page=1&limit=10
Authorization: Bearer <token>
```

#### Get My Notifications
```http
GET /api/ngo/notifications
Authorization: Bearer <token>
```

#### Update Notification Status
```http
PUT /api/ngo/notifications/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "acknowledged" | "in_progress" | "resolved",
  "notes": "Contacted the survivor, scheduling follow-up"
}
```

#### Get Analytics Reports
```http
GET /api/ngo/reports
Authorization: Bearer <token>
```

**Response includes:**
- Total cases, users, AI sessions
- Cases submitted in last 7 days
- Breakdown by type, status, priority
- Monthly trend (last 6 months)

#### Get NGO Profile
```http
GET /api/ngo/profile
Authorization: Bearer <token>
```

#### Update NGO Profile
```http
PUT /api/ngo/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "org_name": "Hope Foundation Rwanda",
  "description": "Supporting GBV survivors since 2010",
  "contact_email": "contact@hope.org",
  "contact_phone": "+250788999999",
  "location": "Kigali"
}
```

---

### ⚙️ Admin (`/api/admin`)

> **Access:** `admin` role required

#### Get All Users
```http
GET /api/admin/users?role=ngo&page=1&limit=20
Authorization: Bearer <token>
```

#### Activate/Deactivate User
```http
PUT /api/admin/users/:uuid/toggle
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /api/admin/users/:uuid/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "user" | "ngo" | "admin"
}
```

#### Delete User
```http
DELETE /api/admin/users/:uuid
Authorization: Bearer <token>
```

#### Manually Refer Case to NGO
```http
POST /api/admin/refer
Authorization: Bearer <token>
Content-Type: application/json

{
  "case_uuid": "case-uuid-here",
  "ngo_uuid": "ngo-user-uuid-here"
}
```

---

## 🏗️ Architecture

### MVC Pattern with Models Layer

```
Request → Route → Middleware → Controller → Model → Database
                     ↓           ↓            ↓
                   auth.js    Business     SQL Queries
                   upload.js   Logic
                   error.js
```

### Key Design Principles

1. **Separation of Concerns**
   - Models handle ALL database queries
   - Controllers contain business logic only
   - Utilities provide shared functionality

2. **Consistent Response Format**
   ```javascript
   // Success
   { success: true, message: "...", data: {...} }
   
   // Error
   { success: false, message: "...", errors: [...] }
   
   // Paginated
   { success: true, data: [...], pagination: {...} }
   ```

3. **Role-Based Access Control (RBAC)**
   - `user` → Can submit cases, chat with AI, view own data
   - `ngo` → All user permissions + view all cases, manage referrals
   - `admin` → All NGO permissions + user management

4. **Auto-Referral System**
   - `urgent` and `high` priority cases automatically notify all active NGOs
   - Prevents duplicate notifications via `Notification.exists()` check

---

## 🔒 Security

### Authentication & Authorization
- **Password Hashing:** bcryptjs with 12 salt rounds
- **JWT Tokens:** HS256 algorithm, 7-day expiration
- **Protected Routes:** All endpoints except register/login require valid JWT
- **Role Verification:** Middleware enforces role requirements on sensitive routes

### File Upload Security
- **MIME Type Validation:** Rejects unauthorized file types
- **Size Limits:** 10MB per file, max 5 files per submission
- **Secure Storage:** Files stored outside web root with unique names
- **Access Control:** Only case owner, NGOs, and admins can view attachments

### Database Security
- **Parameterized Queries:** All SQL uses prepared statements (no SQL injection)
- **Connection Pooling:** Managed connections prevent exhaustion attacks
- **Password Never Exposed:** API responses never include password hashes

### Input Validation
- **express-validator:** All inputs validated at route level
- **Type Checking:** Enums enforced for status, role, case type fields
- **Sanitization:** Email normalization, string trimming

---

## 🧪 Testing

### Manual API Testing

Use **Postman** or **cURL**:

1. **Register a user**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
   ```

2. **Login (save the token)**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. **Submit a case**
   ```bash
   curl -X POST http://localhost:5000/api/cases \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -F "type=mental_health" \
     -F "description=Need support with anxiety" \
     -F "files=@/path/to/file.jpg"
   ```

4. **Chat with AI**
   ```bash
   curl -X POST http://localhost:5000/api/ai/chat \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{"message":"I feel depressed"}'
   ```

### Test User Roles

Create test accounts for each role:

```sql
-- After running schema.sql
INSERT INTO users (uuid, name, email, password, role) VALUES
  (UUID(), 'Admin User', 'admin@test.com', '$2a$12$...', 'admin'),
  (UUID(), 'NGO Staff', 'ngo@test.com', '$2a$12$...', 'ngo'),
  (UUID(), 'Regular User', 'user@test.com', '$2a$12$...', 'user');
```

(Use bcrypt to hash 'password123' and replace `$2a$12$...`)

---

## 📦 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random key (use `openssl rand -base64 32`)
- [ ] Set `NODE_ENV=production`
- [ ] Use environment-specific database credentials
- [ ] Enable HTTPS (use reverse proxy like Nginx)
- [ ] Set up database backups
- [ ] Configure CORS for production frontend URL
- [ ] Set up logging (consider Winston or Pino)
- [ ] Add rate limiting (express-rate-limit)
- [ ] Monitor with PM2 or systemd

### Recommended Hosting

- **AWS EC2** + RDS (MySQL)
- **Render** (full-stack deployment)
- **DigitalOcean** App Platform
- **Heroku** + ClearDB

---

## 👥 Team

**Digital Social Innovators**

| Name | Role | GitHub |
|------|------|--------|
| Alice Umubyeyi | Team Leader | [@UAlice1](https://github.com/UAlice1) |
| Faycal GITEGO | Developer | [@gitegofaycal](https://github.com/gitegofaycal) |
| Florence KUBWIMANA | Developer | - |
| Judson MUTABAZI | Developer | - |

**Repository:** [github.com/UAlice1/YourVoice_Hub](https://github.com/UAlice1/YourVoice_Hub)

---

## 🆘 Support

For questions or issues:
1. Check the [API Documentation](#api-documentation)
2. Review error logs in the console
3. Verify your `.env` configuration
4. Contact the team via GitHub

---

**Built with ❤️ for mental health support and GBV prevention in Rwanda**