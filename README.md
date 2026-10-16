# 🚀 TMS - Task & Project Management System

A modern, full-stack collaborative Project and Task Management System (TMS) built with **React 19, Vite, Tailwind CSS v4, Node.js, Express, and MongoDB / Mongoose**.

![TMS Dashboard Preview](./client/public/favicon.png)

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Architecture](#-project-architecture)
- [📡 Backend API Documentation](#-backend-api-documentation)
- [⚙️ Setup & Local Installation](#️-setup--local-installation)
- [🧪 Automated API Testing](#-automated-api-testing)
- [🌐 Deployment Guide](#-deployment-guide)
  - [1. MongoDB Atlas Configuration](#1-mongodb-atlas-configuration)
  - [2. Deploy Backend to Render](#2-deploy-backend-to-render)
  - [3. Deploy Frontend to Vercel](#3-deploy-frontend-to-vercel)
- [🤝 Contributing & License](#-contributing--license)

---

- **🔒 Authentication & Protected Routes**:
  - Secure JWT authentication with persistent sessions.
  - Automatic route guarding (`ProtectedRoute`) redirecting unauthenticated users to `/login`.
  - 1-Click quick demo login for all three roles (**Admin**, **Manager**, and **Member**).
- **🛡️ Role-Based Access Control (RBAC)**:
  - **👑 Admin** (`admin@tms.io` / `Admin@123`): Full access — can create, edit, and delete projects and team members.
  - **💼 Manager** (`manager@tms.io` / `Manager@123`): Project lead — can create and edit projects and team members.
  - **👤 Member** (`member@tms.io` / `Member@123`): Contributor — view-only dashboard, projects, and directory.
  - Role-based UI guards (buttons hidden/disabled) + strict backend API authorization (403 Forbidden).
- **📊 Comprehensive Executive Dashboard**: Real-time project KPIs, completion rates, budget & expenditure tracking, status breakdowns, priority distribution, and upcoming deadlines alert.
- **📁 Full Project CRUD**:
  - Create new projects with title, description, category, timeline, priority, budget, progress percentage, and tags.
  - Multi-select assignment of team members.
  - Edit project parameters with prepopulated form values.
  - Delete projects with safe confirmation modal.
  - Real-time client-side keyword search (title, description, tags).
  - Status filters (`All`, `Planning`, `In Progress`, `Completed`, `On Hold`) and priority filters (`All`, `Low`, `Medium`, `High`, `Urgent`).
  - Dual view toggle (Interactive Card Grid view vs Data Table view).
  - Quick action status toggles (e.g. 1-click "Mark Complete").
- **👥 Team Members Management**:
  - Add and update team members (name, unique email, role, department, contact info, skills, avatar).
  - Tracks live assigned project counts per member.
  - Safe deletion: automatically unassigns member from existing projects before removal.
- **⚡ Zero-Config Local Development & Live Atlas Sync**:
  - Connected directly to MongoDB Atlas cluster with automatic fallback to in-memory database if needed.
- **🎨 Premium UI/UX**:
  - Sleek, modern design with Plus Jakarta Sans typography.
  - Dark mode and light mode toggle.
  - Micro-animations, progress meters, badge indicators, loading skeleton states, empty states, and toast notifications.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router, Lucide Icons |
| **API Client** | Axios (configured with base URL and error interceptors) |
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Validation** | Zod (strict schema validation for request bodies and MongoDB ObjectIds) |
| **Testing** | Automated Node.js integration verification suite |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 📂 Project Architecture

```
tms/
├── client/                     # Frontend React + Vite Client
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Navigation sidebar & backend health status
│   │   │   ├── ProjectCard.jsx # Project card with progress bar & avatars
│   │   │   ├── ProjectForm.jsx # Create & Edit project modal form
│   │   │   ├── StatusBadge.jsx # Modern status & priority pills
│   │   │   └── LoadingState.jsx# Skeletons, error states, and empty states
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Metrics, charts, upcoming deadlines
│   │   │   ├── Projects.jsx    # Projects CRUD, search, filter, grid/table view
│   │   │   └── TeamMembers.jsx # Team member directory & assignments
│   │   ├── services/
│   │   │   └── api.js          # Axios API client & endpoints
│   │   ├── hooks/
│   │   │   ├── useProjects.js  # Project state & operations hook
│   │   │   └── useTeamMembers.js # Team members state hook
│   │   ├── App.jsx             # Main application layout & routes
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS styles & animations
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── server/                     # Backend Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose Atlas connection + dev fallback
│   │   ├── models/
│   │   │   ├── Project.js      # Project Mongoose schema & indexes
│   │   │   └── TeamMember.js   # TeamMember Mongoose schema
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   └── teamMemberController.js
│   │   ├── routes/
│   │   │   ├── projectRoutes.js
│   │   │   └── teamMemberRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js # Centralized error & 404 handler
│   │   │   └── validateRequest.js # Zod validation middleware
│   │   ├── services/
│   │   │   └── seedService.js  # Seed realistic demo data
│   │   └── server.js           # Express app initialization
│   ├── test-apis.js            # Automated API verification suite
│   ├── package.json
│   └── .env.example
├── .gitignore
├── package.json                # Monorepo convenience scripts
└── README.md
```

---

## 📡 Backend API Documentation

Base URL: `http://localhost:5000/api` (or deployed URL on Render)

### 1. Projects Endpoints

#### `GET /api/projects`
List all projects with optional filtering and search.
- **Query Parameters**:
  - `search` (string): Search by keyword in title, description, or tags.
  - `status` (string): Filter by `Planning`, `In Progress`, `Completed`, or `On Hold`.
  - `priority` (string): Filter by `Low`, `Medium`, `High`, or `Urgent`.
  - `sort` (string): Sort field and direction (e.g. `createdAt:desc`, `dueDate:asc`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "67104b2a510526e849924823",
      "title": "Cloud Infrastructure Modernization",
      "description": "Migrate legacy microservices to Kubernetes on AWS EKS.",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2026-11-25T16:30:00.000Z",
      "progress": 65,
      "budget": 45000,
      "spent": 28000,
      "category": "DevOps & Cloud",
      "tags": ["AWS", "Kubernetes", "CI/CD"],
      "teamMembers": [
        {
          "_id": "67104b2a510526e84992481e",
          "name": "Bob Smith",
          "email": "bob.smith@techcorp.io",
          "role": "Backend Developer",
          "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        }
      ]
    }
  ]
}
```

#### `GET /api/projects/stats`
Returns aggregated analytics for the Dashboard.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalProjects": 5,
    "statusCounts": {
      "completed": 1,
      "inProgress": 2,
      "planning": 1,
      "onHold": 1
    },
    "priorityCounts": {
      "Urgent": 1,
      "High": 2,
      "Medium": 2,
      "Low": 0
    },
    "totalTeamMembers": 5,
    "activeTeamMembers": 5,
    "totalBudget": 155000,
    "totalSpent": 82200,
    "avgProgress": 55,
    "upcomingDeadlines": [...]
  }
}
```

#### `GET /api/projects/:id`
Get a single project populated with team member details.
- **Response `200 OK`**: Returns project object.
- **Error `400 Bad Request`**: If `:id` is not a valid 24-character hex ObjectId.
- **Error `404 Not Found`**: If project does not exist.

#### `POST /api/projects`
Create a new project.
- **Request Body**:
```json
{
  "title": "Real-Time Customer Analytics Dashboard",
  "description": "Build high-performance real-time analytics dashboard.",
  "status": "Planning",
  "priority": "High",
  "dueDate": "2026-12-15T00:00:00.000Z",
  "budget": 30000,
  "spent": 0,
  "progress": 0,
  "category": "Web Development",
  "tags": ["React", "WebSockets"],
  "teamMembers": ["67104b2a510526e84992481e"]
}
```
- **Response `201 Created`**: Returns created project object.
- **Error `400 Bad Request`**: Missing required fields or validation failure.

#### `PATCH /api/projects/:id`
Update an existing project (partial update).
- **Request Body**: Accepts any project fields to update.
- **Response `200 OK`**: Returns updated project.

#### `DELETE /api/projects/:id`
Delete a project.
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Project deleted successfully.",
  "data": { "id": "67104b2a510526e849924823" }
}
```

---

### 2. Team Members Endpoints

#### `GET /api/team-members`
List all team members with their active project counts.
- **Query Parameters**: `search`, `status`, `department`.
- **Response `200 OK`**: Returns array of team members.

#### `GET /api/team-members/:id`
Get a single team member with list of assigned projects.

#### `POST /api/team-members`
Add a new team member.
- **Request Body**:
```json
{
  "name": "Sarah Connor",
  "email": "sarah.connor@techcorp.io",
  "role": "DevOps Engineer",
  "department": "Infrastructure",
  "phone": "+1 555-0199",
  "status": "Active",
  "skills": ["AWS", "Terraform", "Docker"]
}
```
- **Response `201 Created`**: Returns created team member.
- **Error `409 Conflict`**: If email is already in use.

#### `PATCH /api/team-members/:id`
Update team member details.

#### `DELETE /api/team-members/:id`
Delete team member and automatically unassign them from projects.

---

## ⚙️ Setup & Local Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install
```bash
git clone <your-repository-url>
cd tms

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
# Optional: Add your MongoDB Atlas connection string here.
# If left empty, an in-memory database will be used automatically.
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tms?retryWrites=true&w=majority
JWT_SECRET=supersecret_tms_jwt_key_2026
```

**Client (`client/.env`)**:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Locally

Open two terminal windows:

**Terminal 1 (Backend Server)**:
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

Alternatively, from the root folder:
```bash
npm run dev:server
npm run dev:client
```

---

## 🧪 Automated API Testing

An automated verification test script tests all endpoints, success cases, validation errors, 404 not found, and duplicate rejection.

To execute the test suite:
```bash
cd server
node test-apis.js
```

**Test Output**:
```
🧪 Starting TMS API Verification Suite...

✅ [PASS] Health Check (200 OK)
✅ [PASS] GET /api/team-members returns list
✅ [PASS] POST /api/team-members success (201 Created)
✅ [PASS] POST /api/team-members duplicate email (409 Conflict)
✅ [PASS] PATCH /api/team-members/:id success (200 OK)
✅ [PASS] GET /api/projects returns seeded projects
✅ [PASS] GET /api/projects/stats returns analytics
✅ [PASS] GET /api/projects/:id valid project (200 OK)
✅ [PASS] GET /api/projects/:id missing project (404 Not Found)
✅ [PASS] GET /api/projects/:id invalid ObjectId (400 Bad Request)
✅ [PASS] POST /api/projects success (201 Created)
✅ [PASS] POST /api/projects invalid input (400 Validation Error)
✅ [PASS] PATCH /api/projects/:id update success (200 OK)
✅ [PASS] DELETE /api/projects/:id success (200 OK)
✅ [PASS] DELETE /api/projects/:id already deleted (404 Not Found)
✅ [PASS] DELETE /api/team-members/:id success (200 OK)

=========================================
🎯 Test Summary: 16 Passed, 0 Failed
=========================================
```

---

## 🌐 Deployment Guide

### 1. MongoDB Atlas Configuration
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or create an account.
2. Build a new free cluster (M0).
3. Under **Database Access**, create a database user with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so Render can connect.
5. In your cluster dashboard, click **Connect** -> **Drivers** -> Copy the connection string.
   Example: `mongodb+srv://admin:<password>@cluster0.mongodb.net/tms?retryWrites=true&w=majority`

### 2. Deploy Backend to Render
1. Create an account on [Render](https://render.com/).
2. Click **New** -> **Web Service** -> Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add **Environment Variables** in Render dashboard:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://admin:<password>@cluster0.mongodb.net/tms?retryWrites=true&w=majority`
   - `CLIENT_URL`: `https://your-tms-client.vercel.app`
5. Click **Create Web Service**. Note down the Render URL (e.g., `https://tms-server.onrender.com`).

### 3. Deploy Frontend to Vercel
1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New Project** -> Import your GitHub repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://tms-server.onrender.com/api` (Render URL + `/api`)
5. Click **Deploy**. Vercel will build and assign a production URL.

---

## 🤝 Contributing & License

This project is licensed under the MIT License.
