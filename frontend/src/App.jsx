import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CandidateProvider } from './context/CandidateContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import CandidateDetails from './pages/CandidateDetails';
import AddCandidate from './pages/AddCandidate';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import RecruitmentPipeline from './pages/RecruitmentPipeline';
import Interviews from './pages/Interviews';
import InterviewFeedback from './pages/InterviewFeedback';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Trash from './pages/Trash';
import PublicCareers from './pages/PublicCareers';

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div key={location.pathname} className="animate-smooth-grow">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <CandidateProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/careers" element={<PublicCareers />} />

              {/* Protected App Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Candidate Management - Internal Roles Only */}
                <Route
                  path="/candidates"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER']}>
                      <Candidates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidates/:id"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER']}>
                      <CandidateDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidates/add"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']}>
                      <AddCandidate />
                    </ProtectedRoute>
                  }
                />

                {/* Job Postings */}
                <Route path="/jobs" element={<Jobs />} />
                <Route
                  path="/jobs/create"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']}>
                      <CreateJob />
                    </ProtectedRoute>
                  }
                />

                {/* Applications & Pipeline */}
                <Route path="/applications" element={<RecruitmentPipeline />} />
                <Route
                  path="/applications/pipeline"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']}>
                      <RecruitmentPipeline />
                    </ProtectedRoute>
                  }
                />

                {/* Interviews & Feedback */}
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/interviews/:id/feedback" element={<InterviewFeedback />} />

                {/* User Management */}
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
                      <Users />
                    </ProtectedRoute>
                  }
                />

                {/* Audit Logs */}
                <Route
                  path="/audit-logs"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER']}>
                      <AuditLogs />
                    </ProtectedRoute>
                  }
                />

                {/* Reports & Analytics */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER']}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                <Route path="/settings" element={<Settings />} />
                <Route path="/trash" element={<Trash />} />
              </Route>

              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </CandidateProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
