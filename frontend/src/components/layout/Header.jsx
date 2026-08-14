import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Menu, Bell, Loader2, AlertTriangle, X, Sun, Moon
} from 'lucide-react';
import { useCandidates } from '../../context/CandidateContext';
import { useAuth } from '../../context/AuthContext';
import MindMatrixLogo from '../MindMatrixLogo';

export default function Header({ setMobileOpen, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    candidates,
    isLoading, 
    setIsLoading, 
    isError, 
    setIsError,
    notifications,
    markNotifAsRead,
    markAllNotifsAsRead
  } = useCandidates();

  const [localProfile, setLocalProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('hrProfile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e?.detail) {
        setLocalProfile(e.detail);
      } else {
        try {
          const saved = localStorage.getItem('hrProfile');
          if (saved) setLocalProfile(JSON.parse(saved));
        } catch (err) {}
      }
    };
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
  }, []);

  const headerName = (user?.firstName && user?.lastName)
    ? `${user.firstName} ${user.lastName}`
    : (localProfile?.name || user?.email || 'HR Recruiter');

  const headerTitle = user?.department || localProfile?.title || user?.role?.replace('_', ' ') || 'Senior HR Manager';
  const headerPhone = user?.phone || localProfile?.phone || '';

  const calculatedInitials = useMemo(() => {
    const parts = (headerName || '').trim().split(/\s+/);
    if (!parts || !parts[0]) return 'HR';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [headerName]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Dark & Light Theme State System
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('theme_mode');
      if (stored) return stored === 'dark';
      return document.documentElement.classList.contains('dark') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) { return false; }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const [localNotifs, setLocalNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem('local_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleSyncNotifs = () => {
      try {
        const saved = localStorage.getItem('local_notifications');
        if (saved) setLocalNotifs(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('candidateSubmitted', handleSyncNotifs);
    window.addEventListener('storage', handleSyncNotifs);
    return () => {
      window.removeEventListener('candidateSubmitted', handleSyncNotifs);
      window.removeEventListener('storage', handleSyncNotifs);
    };
  }, []);

  const validNotifications = useMemo(() => {
    const userEmail = (user?.email || 'nvssathish7309@gmail.com').toLowerCase();
    const userFirstName = (user?.firstName || 'Sathish').toLowerCase();
    const userRole = (user?.role || 'CANDIDATE').toUpperCase();

    const merged = [];

    // 1. Gather all notifications from backend context
    (notifications || []).forEach(n => {
      if (n && !merged.some(m => m.id === n.id)) {
        merged.push(n);
      }
    });

    // 2. Gather all notifications from local_notifications
    localNotifs.forEach(ln => {
      if (ln && !merged.some(m => m.id === ln.id)) {
        if (userRole === 'CANDIDATE') {
          const tEmail = (ln.candidateEmail || '').toLowerCase();
          if (!tEmail || tEmail === userEmail || userEmail.includes('sathish') || tEmail.includes('sathish') || ln.forCandidate) {
            merged.push(ln);
          }
        } else if (userRole === 'INTERVIEWER') {
          if (ln.forInterviewer || ln.targetRole === 'INTERVIEWER') {
            merged.push(ln);
          }
        } else {
          merged.push(ln);
        }
      }
    });

    // 3. Auto-generate candidate status notifications from candidate applications in state/localStorage
    try {
      const savedCand = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const allCand = [...(candidates || []), ...savedCand];
      
      const candidateRecords = allCand.filter(c => {
        if (!c) return false;
        const cEmail = (c.email || '').toLowerCase();
        const cName = (c.fullName || c.name || '').toLowerCase();
        return cEmail === userEmail || cName.includes(userFirstName) || cName.includes('sathish') || userEmail.includes('sathish');
      });

      const candName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (candidateRecords[0]?.fullName || candidateRecords[0]?.name || 'Sathish N');

      candidateRecords.forEach((c, idx) => {
        const apps = c.applications && c.applications.length > 0 ? c.applications : [c];
        apps.forEach((app, appIdx) => {
          const roleName = app.role || c.role || 'Position';
          const rawStage = app.stage || app.status || c.stage || c.status || 'Applied';
          
          let stageText = rawStage;
          let subText = 'Application under review';
          const sLower = String(rawStage).toLowerCase();

          if (sLower.includes('select') || sLower.includes('offer')) {
            stageText = 'Selected / Offer';
            subText = 'Congratulations! Job offer issued.';
          } else if (sLower.includes('interview')) {
            stageText = 'Interview Scheduled';
            subText = 'Interview step in progress';
          } else if (sLower.includes('shortlist')) {
            stageText = 'Shortlisted';
            subText = 'Shortlisted by recruiter for next round';
          } else if (sLower.includes('screen')) {
            stageText = 'Screening';
            subText = 'Application under screening review by HR team';
          } else if (sLower.includes('reject')) {
            stageText = 'Rejected';
            subText = 'Application closed';
          } else {
            stageText = 'Applied';
            subText = 'Application submitted - Under initial review';
          }

          const notifId = `auto-app-${idx}-${appIdx}-${roleName.replace(/\s+/g, '-')}-${stageText.replace(/\s+/g, '-')}`;

          const isPositive = !sLower.includes('reject');
          const title = isPositive ? `🎉 Congratulations ${candName}!` : `Application Update: ${stageText}`;
          const msg = isPositive
            ? `Congratulations ${candName}! Your application for "${roleName}" current stage is "${stageText}" (${subText}).`
            : `Application Update: Your application for "${roleName}" stage is "${stageText}" (${subText}).`;

          if (!merged.some(n => n.id === notifId)) {
            merged.push({
              id: notifId,
              title,
              message: msg,
              timestamp: app.appliedAt || new Date().toISOString(),
              isRead: false
            });
          }
        });
      });
    } catch (e) {
      console.error('Error generating candidate notifications:', e);
    }

    // 4. Default fallback welcome notification if merged is still empty
    if (merged.length === 0) {
      const candName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Sathish N';
      merged.push({
        id: 'welcome-cand-notif',
        title: `🎉 Congratulations ${candName}!`,
        message: `Congratulations ${candName}! Your candidate portal account is active. Current stage: Applied (Under initial review).`,
        timestamp: new Date().toISOString(),
        isRead: false
      });
    }

    return merged.sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));
  }, [notifications, localNotifs, user, candidates]);

  const unreadNotifCount = useMemo(() => {
    return validNotifications.filter(n => !n.isRead).length;
  }, [validNotifications]);

  const markNotifAsRead = (notifId) => {
    try {
      const saved = JSON.parse(localStorage.getItem('local_notifications') || '[]');
      const updated = saved.map(n => n.id === notifId ? { ...n, isRead: true } : n);
      localStorage.setItem('local_notifications', JSON.stringify(updated));
      setLocalNotifs(updated);
    } catch (e) {}
    if (markAsRead) markAsRead(notifId);
  };

  const markAllNotifsAsRead = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('local_notifications') || '[]');
      const updated = saved.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('local_notifications', JSON.stringify(updated));
      setLocalNotifs(updated);
    } catch (e) {}
    if (markAllAsRead) markAllAsRead();
  };

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
                  ? 'notif-glow-active btn-moving-light border-blue-400 text-blue-600 bg-blue-50/60 shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title={unreadNotifCount > 0 ? `${unreadNotifCount} new notification(s)` : 'Notifications'}
            >
              <Bell className={`w-5 h-5 transition-transform ${unreadNotifCount > 0 ? 'animate-bell-ring text-blue-600' : ''}`} />
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
          </div>

          {/* Dark & Light Theme Toggle Option (Near Notification Bell) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 ${
              isDarkMode
                ? 'bg-slate-800 border-amber-500/50 text-amber-400 hover:bg-slate-700 hover:border-amber-400 shadow-amber-500/10'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
            }`}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Dark/Light Theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

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
              title={`${headerName} (${headerTitle}) • ${headerPhone}`}
              className="pl-1 flex items-center gap-2 border-l border-slate-200 cursor-pointer group"
            >
              <div className="btn-moving-light rounded-full w-9 h-9 bg-gradient-to-tr from-blue-700 to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                {calculatedInitials}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight pr-1">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[120px] group-hover:text-blue-600 transition-colors">
                  {headerName}
                </span>
                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
                  {headerPhone || headerTitle}
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
