# Full-Stack Job Application Management System (MERN)

A production-quality full-stack internal recruitment platform built with **React, Node.js, Express, MongoDB, Mongoose, JWT Authentication, and Multer file uploads**.

---

## 🚀 Key Features & Capability Overview

- **Authentication & Security**:
  - JWT (JSON Web Token) authentication with bearer authorization header interceptors.
  - Role-Based Access Control (RBAC) with 4 permission levels (`SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`, `INTERVIEWER`).
  - Bcrypt password hashing, Helmet headers, and Rate limiting.
- **Candidate Management**:
  - Candidate listing with search, status filter, role filter, experience filter, sorting, and pagination.
  - Auto-generated candidate IDs (`CAN-0001`, `CAN-0002`).
  - Resume upload support (`PDF`, `DOC`, `DOCX`) with static document serving.
  - Shortlist & Reject actions with reason logging and stage history recording.
- **Recruitment Pipeline**:
  - Interactive Kanban board (`New`, `Screening`, `Shortlisted`, `Interview`, `Selected`, `Rejected`).
  - Stage update tracking with audit log history generation.
- **Interview Scheduling & Evaluation**:
  - Interview booking with interviewer assignment and meeting links.
  - 1 to 5 star rating evaluations and hiring recommendations (`Strong Hire`, `Hire`, `Hold`, `Reject`).
  - Dedicated Interviewer Dashboard.
- **Dashboard & Analytics**:
  - Summary metric cards (`Total Candidates`, `Shortlisted`, `Interview Scheduled`, `Selected`).
  - Recharts analytics visualization and CSV exports.
- **Audit Logs & Notifications**:
  - Immutable activity history logging.
  - Real-time unread notification count badge and dropdown.
- **Public Careers Portal**:
  - External careers page (`/careers`) allowing candidates to view openings and apply directly.

---

## 🔑 Demo Login Credentials

You can log in manually or click the **One-Click Demo Account Badges** on the login page:

| Role | Email | Password | Allowed Access |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@mindmatrix.com` | `Sathish@29` | Full System, User Management, Audit Logs, Settings |
| **HR Manager** | `hr@mindmatrix.com` | `HrManager@2026` | Dashboard, Candidates, Jobs, Pipeline, Reports |
| **Recruiter** | `recruiter@mindmatrix.com` | `Recruiter@2026` | Dashboard, Candidates, Jobs, Schedule Interviews |
| **Interviewer** | `interviewer@mindmatrix.com` | `Interviewer@2026` | Assigned Interviews, Candidate Evaluation & Feedback |

---

## 🛠️ Project Structure

```text
job-application-dashboard/
├── package.json               Root workspace scripts
├── README.md                  Documentation
├── backend/                   Node.js + Express + MongoDB Server
│   ├── src/
│   │   ├── config/            db.js (MongoDB config)
│   │   ├── controllers/       auth, candidate, job, application, interview, user, report
│   │   ├── middleware/        auth (JWT), rbac (Roles), upload (Multer), error
│   │   ├── models/            User, Candidate, Job, Application, Interview, Feedback, AuditLog, Notification
│   │   ├── routes/            REST API Endpoints
│   │   ├── services/          auditService, emailService
│   │   └── server.js          Express Application
│   ├── uploads/               Resume file storage
│   └── package.json
└── frontend/                  React + Vite + Tailwind CSS Application
    ├── src/
    │   ├── components/        Navbar, Sidebar, ProtectedRoute, NotificationsDropdown
    │   ├── context/           AuthContext, CandidateContext, NotificationContext
    │   ├── pages/             Login, Dashboard, Candidates, CandidateDetails, AddCandidate, Jobs, RecruitmentPipeline, Interviews, Users, Reports, PublicCareers
    │   └── services/          Axios API services (api, authService, candidateService, etc.)
    └── package.json
```

---

## 🚦 Quick Start Setup Instructions

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Seed Database with Demo Data
```bash
cd backend
npm run seed
```

### 3. Run Application
```bash
# Terminal 1: Run Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2: Run Frontend App (Port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment Guide

When deploying the frontend and backend to cloud platforms (e.g., Render, Vercel, Netlify, Railway):

### 1. Backend Deployment (Render / Railway / Heroku)
- **Environment Variables**:
  - `PORT`: `5000` (or auto-assigned by host)
  - `MONGODB_URI`: Your MongoDB Atlas URI (or leave blank to use auto-seeded `MongoMemoryServer`)
  - `CLIENT_URL`: `https://your-frontend-domain.vercel.app` (your deployed frontend URL to allow CORS)
  - `JWT_SECRET`: A secure random secret string

### 2. Frontend Deployment (Vercel / Netlify)
- **Build Settings**:
  - **Base Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
- **Environment Variable**:
  - `VITE_API_URL`: Set this to your deployed backend URL: `https://your-backend-url.onrender.com/api`

> [!TIP]
> After setting `VITE_API_URL` in your frontend host, redeploy the frontend so Vite bakes the backend URL into the production build!

