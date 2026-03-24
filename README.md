# 🏥 MedTrack — Medical Equipment Maintenance Tracking System

A web-based system for tracking hospital equipment, scheduling maintenance, and
reporting faults. Built with **Plain HTML/CSS/JS** (frontend) and **Node.js + Express**
(backend), connected to a **PostgreSQL** database over the hospital LAN.

---

## 📁 Project Structure

```
medtrack/
├── backend/                  # Node.js + Express REST API
│   ├── server.js             # Entry point
│   ├── package.json
│   ├── .env.example          # Copy to .env and fill in values
│   ├── db/
│   │   ├── schema.sql        # Run once to create tables
│   │   └── pool.js           # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js           # JWT authenticate + authorize
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── equipmentController.js
│   │   ├── maintenanceController.js
│   │   ├── faultController.js
│   │   └── usersController.js
│   └── routes/
│       └── index.js          # All API routes
│
└── frontend/                 # Plain HTML/CSS/JS
    ├── index.html            # Login page
    ├── css/
    │   └── style.css         # Full design system
    ├── js/
    │   ├── api.js            # Fetch wrapper for all API calls
    │   ├── utils.js          # Auth guards, toast, badges, modals
    │   └── sidebar.js        # Dynamic sidebar (role-aware)
    └── pages/
        ├── dashboard.html    # Overview + stats
        ├── equipment.html    # Equipment CRUD
        ├── maintenance.html  # Maintenance scheduling
        ├── faults.html       # Fault reporting
        └── users.html        # User management (admin only)
```

---

## ⚙️ Backend Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` with your database credentials and a secure JWT secret:
```
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medtrack
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=a_long_random_string_here
JWT_EXPIRES_IN=8h
```

### 4. Create the database and run schema
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE medtrack;"

# Run the schema (creates tables + seeds default admin)
psql -U postgres -d medtrack -f db/schema.sql
```

### 5. Start the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```
The API will be running at **http://localhost:8080**

---

## 🌐 Frontend Setup

The frontend is plain HTML — no build step needed.

### Option A: Open directly in browser
```bash
# Just open frontend/index.html in any browser
# Note: some browsers block fetch to localhost with file:// protocol
```

### Option B: Serve with a simple static server (recommended)
```bash
# Using Node.js
npx serve frontend

# Using Python
cd frontend && python -m http.server 3000
```
Then visit **http://localhost:3000**

### Set the API URL
Open `frontend/js/api.js` and update `API_BASE` if your backend runs on a
different IP (e.g. on the hospital LAN):
```js
const API_BASE = 'http://192.168.1.100:8080/api';
```

---

## 🔐 Default Login

| Email | Password | Role |
|-------|----------|------|
| `admin@medtrack.local` | `Admin@1234` | Administrator |

> ⚠️ **Change the default password immediately after first login.**

---

## 👥 Roles & Permissions

| Feature | Admin | Staff | Healthcare |
|---------|-------|-------|------------|
| View equipment | ✅ | ✅ | ✅ |
| Add / edit / delete equipment | ✅ | ❌ | ❌ |
| Schedule maintenance | ✅ | ❌ | ❌ |
| Update maintenance status | ✅ | ✅ | ❌ |
| Report faults | ✅ | ✅ | ✅ |
| Resolve / close faults | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Sign in |
| GET | `/api/auth/me` | Any | Current user info |
| GET | `/api/equipment` | Any | List all equipment |
| POST | `/api/equipment` | Admin | Add equipment |
| PATCH | `/api/equipment/:id` | Admin | Update equipment |
| DELETE | `/api/equipment/:id` | Admin | Delete equipment |
| GET | `/api/maintenance` | Any | List maintenance records |
| POST | `/api/maintenance` | Admin | Schedule maintenance |
| PATCH | `/api/maintenance/:id/status` | Any | Update status |
| DELETE | `/api/maintenance/:id` | Admin | Delete record |
| GET | `/api/faults` | Any | List fault reports |
| POST | `/api/faults` | Any | Report a fault |
| PATCH | `/api/faults/:id/status` | Admin | Resolve / close |
| GET | `/api/users` | Admin | List users |
| POST | `/api/users` | Admin | Create user |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## 🔒 Security Notes
- All passwords are hashed with **bcrypt** (10 salt rounds)
- All protected routes require a **JWT Bearer token**
- The system is designed for a **hospital LAN** — do not expose directly to the internet
- For production, set `CORS origin` in `server.js` to your specific frontend domain

---

## 🏗️ Built With
- **Backend:** Node.js, Express, PostgreSQL (`pg`), bcryptjs, jsonwebtoken
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Design:** Custom CSS design system (no frameworks)
