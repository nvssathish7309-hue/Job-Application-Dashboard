import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, LogOut, Shield, Sparkles, Zap, Bot } from 'lucide-react';
import MindMatrixLogo from './MindMatrixLogo';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isAiModeActive, setIsAiModeActive] = useState(true);
  const [showAiToast, setShowAiToast] = useState(false);

  const toggleAiMode = () => {
    const nextState = !isAiModeActive;
    setIsAiModeActive(nextState);
    setShowAiToast(true);
    setTimeout(() => setShowAiToast(false), 2500);
  };

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

      {/* Right: AI Mode Toggle, Notifications, User Profile, Role Badge, Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3">

        {/* ⚡ AI Mode Toggle Button (Styled strictly like Image 1) */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleAiMode}
            className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer select-none shadow-2xs hover:shadow-md active:scale-95"
            style={{
              backgroundOrigin: 'border-box',
              backgroundImage: isAiModeActive
                ? `linear-gradient(#F0F5FE, #F0F5FE), linear-gradient(135deg, #3b82f6 0%, #8b5cf6 35%, #ec4899 70%, #06b6d4 100%)`
                : `linear-gradient(#F8FAFC, #F8FAFC), linear-gradient(135deg, #cbd5e1, #94a3b8)`,
              backgroundClip: 'padding-box, border-box',
              border: '1.8px solid transparent',
            }}
            title={isAiModeActive ? "AI Mode is Active (Auto Matching & Insights)" : "Click to Enable AI Mode"}
          >
            <Sparkles className={`w-4 h-4 transition-colors ${isAiModeActive ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-slate-800 font-extrabold tracking-tight">AI Mode</span>
            <span className={`w-2.5 h-2.5 rounded-full transition-all ${isAiModeActive ? 'bg-blue-500 ring-2 ring-blue-200' : 'bg-slate-400'}`} />
          </button>

          {/* AI Mode Status Toast */}
          {showAiToast && (
            <div className="absolute right-0 top-11 w-64 p-2.5 rounded-xl bg-slate-900 text-white border border-blue-500/40 shadow-xl z-50 text-[11px] font-semibold animate-fade-in flex items-center gap-2 backdrop-blur-md">
              <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{isAiModeActive ? '✨ AI Smart Assist Mode Enabled' : '⏸️ AI Assist Mode Paused'}</span>
            </div>
          )}
        </div>

        {/* Bell Notifications Dropdown */}
        <NotificationsDropdown />

        {/* User Info */}
        {user && (() => {
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email || 'User';
          const parts = fullName.split(/\s+/).filter(Boolean);
          const initials = parts.length === 0 ? 'U' : parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

          return (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="btn-moving-light rounded-full w-9 h-9 bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {initials}
              </div>
              
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {fullName}
                </p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border mt-0.5 ${getRoleBadgeColor(user.role)}`}>
                  <Shield className="w-2.5 h-2.5" />
                  {user.role?.replace('_', ' ')}
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
          );
        })()}

      </div>

    </header>
  );
}
