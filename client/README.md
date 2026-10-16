# 💻 TMS Client — Task & Project Management Frontend

The client-side interface for **TMS**, built with **React 19**, **Vite**, **Tailwind CSS v4**, **Zustand**, and **Axios**.

---

## ⚡ Tech Stack & Architecture

- **Core**: React 19 + Vite (ESM)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware
- **API Client & Networking**: Axios with custom **Request & Response Interceptors**
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans typography
- **Routing & RBAC**: React Router with `ProtectedRoute` guards and role-level checks
- **Icons**: Lucide React

---

## 🔄 Zustand State Management

All application state is centralized in lightweight, reactive Zustand stores located in `src/store/`:

### 1. `useAuthStore.js`
Manages user authentication, persistent JWT session in `localStorage`, and role permissions:
- `user`: Authenticated user profile (`_id`, `name`, `email`, `role`, `title`, `avatar`)
- `token`: Active JWT token
- `isAuthenticated`: Boolean
- `login(email, password)`: Authenticates against `/api/auth/login`
- `register(userData)`: Registers via `/api/auth/register`
- `logout()`: Clears authentication state and persistent storage
- `checkAuth()`: Re-verifies session with `/api/auth/me` on app launch
- `hasRole(...roles)`, `isAdmin()`, `canManage()`: Role check utilities

### 2. `useProjectStore.js`
Manages project data, filters, and metrics:
- `projects`: List of workspace projects
- `stats`: Aggregate statistics (counts by status, priority breakdown, total budget/spent)
- `fetchProjects(params)`: Retrieves projects with search/filters
- `fetchStats()`: Retrieves dashboard analytics
- `createProject(data)`, `updateProject(id, data)`, `deleteProject(id)`
- `updateProjectStatus(id, newStatus)`: 1-click status toggling

### 3. `useTeamMemberStore.js`
Manages team directory:
- `teamMembers`: List of collaborators with assigned project counters
- `fetchTeamMembers(params)`, `createTeamMember(data)`, `updateTeamMember(id, data)`, `deleteTeamMember(id)`

---

## 🛡️ Axios Interceptors (`src/services/api.js`)

Network requests are routed through a configured Axios instance with automated interceptors:

### 1. Request Interceptor (Dynamic Token Injection)
- Dynamically retrieves the active JWT token from `useAuthStore.getState().token`.
- Automatically attaches the `Authorization: Bearer <token>` header to all outgoing API requests.
- Appends request timing headers and logs dev requests.

### 2. Response Interceptor (Error Normalization & Auto-Logout)
- **Automatic Unwrapping**: Returns `response.data` directly to callers.
- **401 Unauthorized Handling**: If a session expires or a token is invalid, the interceptor automatically calls `useAuthStore.getState().logout()`, clearing the session and redirecting the user to `/login`.
- **Validation Error Normalization**: Extracts and formats nested Zod / Mongoose validation errors into friendly human-readable messages.

---

## 🔐 Role-Based Access Control (RBAC)

The application enforces role permissions at both the route level and the component level:

- **👑 Admin**: Full access. Can create, edit, and delete projects & team members.
- **💼 Manager**: Project lead. Can create and edit projects & team members.
- **👤 Member**: Contributor. View-only access to projects and directory.

---

## 🚀 Running the Client

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Production build
npm run build
```
