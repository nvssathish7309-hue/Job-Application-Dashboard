import React from 'react';
import { Link } from 'react-router-dom';
import { Search, LogOut, Shield } from 'lucide-react';
import MindMatrixLogo from './MindMatrixLogo';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HR_MANAGER': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'RECRUITER': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'INTERVIEWER': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANDIDATE': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs relative">
      
      {/* Animated Spinning Glow Border Line */}
      <div className="spinning-glow-line" />
      
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="group hover:opacity-95 transition-opacity">
          <MindMatrixLogo layout="horizontal" showTagline={true} />
        </Link>
      </div>

      {/* Center: Quick Search */}
      <div className="btn-moving-light hidden md:flex items-center relative w-72 lg:w-96 rounded-xl bg-blue-50/50 border border-blue-200/90 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Search candidates, jobs, applications..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-white/90 border-0 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:bg-white transition-all"
        />
      </div>

      {/* Right: Notifications, User Profile, Role Badge, Logout */}
      <div className="flex items-center gap-3">
        <NotificationsDropdown />

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
            <div className="btn-moving-light rounded-full w-9 h-9 bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border mt-0.5 ${getRoleBadgeColor(user.role)}`}>
                <Shield className="w-2.5 h-2.5" />
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </header>
  );
}
