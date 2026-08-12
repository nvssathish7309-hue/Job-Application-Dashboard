import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Menu, Bell, Loader2, AlertTriangle, X
} from 'lucide-react';
import { useCandidates } from '../../context/CandidateContext';
import MindMatrixLogo from '../MindMatrixLogo';

export default function Header({ setMobileOpen, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { 
    candidates,
    hrProfile, 
    hrInitials, 
    isLoading, 
    setIsLoading, 
    isError, 
    setIsError,
    notifications,
    markNotifAsRead,
    markAllNotifsAsRead
  } = useCandidates();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Filter out notifications associated with deleted candidates
  const validNotifications = useMemo(() => {
    if (!candidates) return notifications || [];
    const validCandidateIds = new Set(candidates.map(c => c.id));
    return (notifications || []).filter(n => !n.candidateId || validCandidateIds.has(n.candidateId));
  }, [notifications, candidates]);

  const unreadNotifCount = useMemo(() => {
    return validNotifications.filter(n => !n.isRead).length;
  }, [validNotifications]);

  // Close notification popover when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotifications]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/candidates?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleFastRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm relative">
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 overflow-hidden z-30">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 animate-pulse w-full" />
        </div>
      )}

      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="no-glow flex items-center gap-2">
            <MindMatrixLogo layout="horizontal" showTagline={true} />
            <span className="btn-moving-light ml-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
              HR Portal
            </span>
          </Link>
        </div>

        {/* Center: Global Search */}
        <form onSubmit={handleSearchSubmit} className="search-glow flex-1 max-w-md hidden md:block relative rounded-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-[2]" />
          <input
            type="text"
            placeholder="Search candidates by name, role or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative z-[2] w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:border-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-[2]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">

          {/* Dev UX State Toggles */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={handleFastRefresh}
              title="Fast refresh data & UI"
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                isLoading
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200 active:scale-95'
              }`}
            >
              <Loader2 className={`w-3.5 h-3.5 ${isLoading ? 'animate-[spin_0.5s_linear_infinite]' : ''}`} />
              <span>Loading</span>
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border relative transition-all duration-300 ${
                unreadNotifCount > 0
                  ? 'notif-glow-active btn-moving-light border-blue-400 text-blue-600 bg-blue-50/60'
                  : 'text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title={unreadNotifCount > 0 ? `${unreadNotifCount} new notification(s)` : 'Notifications'}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <>
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white z-10" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-75 z-10" />
                </>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Recruitment Alerts
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadNotifCount > 0 ? (
                      <span className="text-[11px] text-blue-600 font-semibold">{unreadNotifCount} New</span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">All read</span>
                    )}
                    {validNotifications?.length > 0 && unreadNotifCount > 0 && (
                      <button
                        onClick={markAllNotifsAsRead}
                        className="text-[10px] text-slate-500 hover:text-blue-600 font-semibold underline transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>

                <div className="py-2 space-y-2 text-xs max-h-80 overflow-y-auto pr-0.5">
                  {!validNotifications || validNotifications.length === 0 ? (
                    <p className="text-center py-6 text-slate-400 text-xs font-medium">
                      No notifications yet
                    </p>
                  ) : (
                    validNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotifAsRead(notif.id);
                          if (notif.candidateId) {
                            const exists = candidates.some(c => c.id === notif.candidateId);
                            if (exists) {
                              navigate(`/candidates/${notif.candidateId}`);
                            }
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2 rounded-xl transition-all cursor-pointer relative ${
                          !notif.isRead
                            ? 'bg-blue-50 border border-blue-100 hover:bg-blue-100/60'
                            : 'bg-slate-50 border border-transparent hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-semibold text-slate-800 leading-snug">{notif.title}</p>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 leading-tight">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

            {/* Add Candidate CTA */}
            <Link
              to="/candidates/add"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">+ Add Candidate</span>
            </Link>

            {/* Recruiter Avatar */}
            <div 
              onClick={() => navigate('/settings')}
              title={`${hrProfile.name} (${hrProfile.title || 'HR Manager'}) • ${hrProfile.phone}`}
              className="pl-1 flex items-center gap-2 border-l border-slate-200 cursor-pointer group"
            >
              <div className="btn-moving-light rounded-full w-9 h-9 bg-gradient-to-tr from-blue-700 to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                {hrInitials}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight pr-1">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[120px] group-hover:text-blue-600 transition-colors">
                  {hrProfile.name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
                  {hrProfile.phone || hrProfile.title}
                </span>
              </div>
            </div>

          </div>
        </div>
        {/* Animated Glow Line along Header Bottom */}
        <div className="header-glow-line" />
    </header>
  );
}
