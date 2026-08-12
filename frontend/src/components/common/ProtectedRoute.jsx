import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white border border-rose-200 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">403 Access Denied</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">
            You don't have permission to access this feature. Role <span className="font-bold text-rose-600">{user?.role}</span> is restricted.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
