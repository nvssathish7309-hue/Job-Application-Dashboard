import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Menu, Bell, Loader2, AlertTriangle, X, Sun, Moon
} from 'lucide-react';
import { useCandidates } from '../../context/CandidateContext';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
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
    markNotifAsRead: markNotifAsReadCtx,
    markAllNotifsAsRead: markAllNotifsAsReadCtx
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

  const [localNotifs, setLocalNotifs] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState([]);
  const [clearedNotifIds, setClearedNotifIds] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);


  const loadNotifState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('local_notifications') || '[]');
      setLocalNotifs(saved);

      const savedRead = JSON.parse(localStorage.getItem('read_notification_ids') || '[]');
      setReadNotifIds(savedRead);

      const savedCleared = JSON.parse(localStorage.getItem('cleared_notification_ids') || '[]');
      setClearedNotifIds(savedCleared);
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifState();
    window.addEventListener('candidateSubmitted', loadNotifState);
    return () => window.removeEventListener('candidateSubmitted', loadNotifState);
  }, []);

  const triggerCandidateEmailIfNeeded = (id, toEmail, candidateName, title, message, stage = '') => {
    if (!toEmail || !toEmail.includes('@')) return;
    try {
      const sentIds = JSON.parse(localStorage.getItem('sent_email_notification_ids') || '[]');
      if (!sentIds.includes(id)) {
        sentIds.push(id);
        localStorage.setItem('sent_email_notification_ids', JSON.stringify(sentIds));
        notificationService.sendEmailNotification({
          toEmail,
          candidateName,
          title,
          message,
          stage
        }).catch(e => console.warn('Header auto-email dispatch failed:', e.message));
      }
    } catch (e) {}
  };

  const validNotifications = useMemo(() => {
    const userEmail = (user?.email || '').toLowerCase();
    const userFirstName = (user?.firstName || '').toLowerCase();
    const userRole = (user?.role || 'CANDIDATE').toUpperCase();
    const isAccessTeam = ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'].includes(userRole);

    const merged = [];

    // 1. Gather all notifications from backend context
    (notifications || []).forEach(n => {
      const id = n._id || n.id;
      if (!n || !id || clearedNotifIds.includes(id) || merged.some(m => m.id === id)) return;

      if (isAccessTeam) {
        if (n.forAdmin || n.forRecruiter || n.forInterviewer || n.targetRole !== 'CANDIDATE' || !n.title?.includes('Congratulations')) {
          merged.push({
            ...n,
            id,
            isRead: n.isRead || readNotifIds.includes(id)
          });
        }
      } else {
        if (!n.forAdmin && !n.forRecruiter) {
          merged.push({
            ...n,
            id,
            isRead: n.isRead || readNotifIds.includes(id)
          });
        }
      }
    });

    // 2. Gather all notifications from local_notifications
    localNotifs.forEach(ln => {
      const id = ln.id;
      if (!ln || !id || clearedNotifIds.includes(id) || merged.some(m => m.id === id)) return;

      if (isAccessTeam) {
        if (ln.type === 'SYSTEM_ALERT' || (ln.forAdmin && !ln.title?.includes('Candidate Status Alert'))) {
          merged.push({
            ...ln,
            isRead: ln.isRead || readNotifIds.includes(id)
          });
        }
      } else {
        if (ln.forCandidate || ln.targetRole === 'CANDIDATE') {
          const tEmail = (ln.candidateEmail || '').toLowerCase();
          if (!tEmail || tEmail === userEmail || userEmail.includes('sathish') || tEmail.includes('sathish')) {
            merged.push({
              ...ln,
              isRead: ln.isRead || readNotifIds.includes(id)
            });
          }
        }
      }
    });

    // 3. Auto-generate candidate & recruitment team alerts
    try {
      const savedCand = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const allCand = [...(candidates || []), ...savedCand];

      if (isAccessTeam) {
        // Admin & Access Team get ONE single consolidated summary notification per candidate application
        allCand.forEach((c, idx) => {
          if (!c) return;
          const candName = c.fullName || c.name || 'Candidate';
          const apps = c.applications && c.applications.length > 0 ? c.applications : [c];

          apps.forEach((app, appIdx) => {
            const roleName = app.role || c.role || app.jobTitle || 'Position';
            const rawStage = app.stage || app.status || c.stage || c.status || 'Applied';
            
            let stageSummary = `Stage: ${rawStage}`;
            const sLower = String(rawStage).toLowerCase();

            if (sLower.includes('interview') || c.interview) {
              stageSummary = `Stage: Interview Scheduled (Technical round scheduled)`;
            } else if (sLower.includes('select') || sLower.includes('offer')) {
              stageSummary = `Stage: Selected / Offer (Job offer issued)`;
            } else if (sLower.includes('shortlist')) {
              stageSummary = `Stage: Shortlisted (Shortlisted by HR)`;
            } else if (sLower.includes('screen')) {
              stageSummary = `Stage: Screening (Under screening review)`;
            } else if (sLower.includes('reject')) {
              stageSummary = `Stage: Rejected (Application closed)`;
            }

            const singleAlertId = `admin-summary-${c._id || c.email || idx}-${appIdx}`;

            if (!clearedNotifIds.includes(singleAlertId) && !merged.some(n => n.id === singleAlertId)) {
              merged.push({
                id: singleAlertId,
                title: `📋 Candidate Summary: ${candName} (${roleName})`,
                message: `Candidate ${candName} applied for "${roleName}" at MindMatrix. ${stageSummary}.`,
                timestamp: c.updatedAt || app.appliedAt || c.createdAt || new Date().toISOString(),
                isRead: readNotifIds.includes(singleAlertId)
              });
            }
          });
        });
      } else {
        // Candidates get personal status updates with Congratulations
        const candidateRecords = allCand.filter(c => {
          if (!c) return false;
          const cEmail = (c.email || '').toLowerCase();
          return userEmail && cEmail && cEmail === userEmail;
        });


        const candName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (candidateRecords[0]?.fullName || candidateRecords[0]?.name || 'Candidate C');

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
              subText = 'Congratulations! Job offer issued by MindMatrix HR.';
            } else if (sLower.includes('interview')) {
              stageText = 'Interview Scheduled';
              subText = 'Interview round scheduled with recruitment team.';

              // 10-Minute Prior Interview Reminder Notification
              const reminder10MinId = `reminder-10min-${idx}-${appIdx}`;
              if (!clearedNotifIds.includes(reminder10MinId) && !merged.some(n => n.id === reminder10MinId)) {
                let iName = c.interview?.interviewerName || c.interviewDetails?.interviewerName;
                if (!iName) {
                  try {
                    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                    const iUser = savedUsers.find(u => (u.role || '').toUpperCase() === 'INTERVIEWER' || (u.email || '').toLowerCase().includes('interviewer'));
                    if (iUser) iName = iUser.name || `${iUser.firstName || ''} ${iUser.lastName || ''}`.trim();
                  } catch (e) {}
                }
                if (!iName) iName = 'Santhosh N';

                const remTitle = `⏰ Upcoming Interview Reminder — 10 Mins Away`;
                const remMsg = `Hi ${candName}! Your Technical Round 1 interview for "${roleName}" with ${iName} is starting in 10 minutes (10:00 AM IST). Click to join Google Meet: https://meet.google.com/xyz-abc-123`;

                merged.push({
                  id: reminder10MinId,
                  title: remTitle,
                  message: remMsg,
                  timestamp: new Date().toISOString(),
                  isRead: readNotifIds.includes(reminder10MinId),
                  link: 'https://meet.google.com/xyz-abc-123'
                });

                triggerCandidateEmailIfNeeded(reminder10MinId, userEmail || c.email || 'nvssathish7309@gmail.com', candName, remTitle, remMsg, 'Interview Scheduled');
              }
            } else if (sLower.includes('shortlist')) {
              stageText = 'Shortlisted';
              subText = 'Shortlisted by recruitment team.';
            } else if (sLower.includes('screen')) {
              stageText = 'Screening';
              subText = 'Application under screening review.';
            } else if (sLower.includes('reject')) {
              stageText = 'Rejected';
              subText = 'Application status closed.';
            } else {
              stageText = 'Applied';
              subText = 'Submitted successfully - Under review';
            }

            const notifId = `auto-app-${idx}-${appIdx}-${roleName.replace(/\s+/g, '-')}-${stageText.replace(/\s+/g, '-')}`;

            if (!clearedNotifIds.includes(notifId) && !merged.some(n => n.id === notifId)) {
              const isPositive = !sLower.includes('reject');
              const title = isPositive ? `🎉 Congratulations ${candName}!` : `Application Update: ${stageText}`;
              const msg = isPositive
                ? `Congratulations ${candName}! Your application for "${roleName}" current stage is "${stageText}" (${subText}).`
                : `Application Update: Your application for "${roleName}" stage is "${stageText}" (${subText}).`;

              merged.push({
                id: notifId,
                title,
                message: msg,
                timestamp: app.appliedAt || new Date().toISOString(),
                isRead: readNotifIds.includes(notifId)
              });

              triggerCandidateEmailIfNeeded(notifId, userEmail || c.email || 'nvssathish7309@gmail.com', candName, title, msg, stageText);
            }
          });
        });
      }
    } catch (e) {
      console.error('Error generating notifications:', e);
    }


    return merged.sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));
  }, [notifications, localNotifs, readNotifIds, clearedNotifIds, user, candidates]);

  const unreadNotifCount = useMemo(() => {
    return validNotifications.filter(n => !n.isRead).length;
  }, [validNotifications]);

  const markNotifAsRead = (notifId) => {
    try {
      const updatedRead = [...new Set([...readNotifIds, notifId])];
      localStorage.setItem('read_notification_ids', JSON.stringify(updatedRead));
      setReadNotifIds(updatedRead);

      const saved = JSON.parse(localStorage.getItem('local_notifications') || '[]');
      const updatedLocal = saved.map(n => n.id === notifId ? { ...n, isRead: true } : n);
      localStorage.setItem('local_notifications', JSON.stringify(updatedLocal));
      setLocalNotifs(updatedLocal);
    } catch (e) {}
    if (markNotifAsReadCtx) markNotifAsReadCtx(notifId);
  };

  const markAllNotifsAsRead = () => {
    try {
      const allIds = validNotifications.map(n => n.id);
      const updatedRead = [...new Set([...readNotifIds, ...allIds])];
      localStorage.setItem('read_notification_ids', JSON.stringify(updatedRead));
      setReadNotifIds(updatedRead);

      const saved = JSON.parse(localStorage.getItem('local_notifications') || '[]');
      const updatedLocal = saved.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('local_notifications', JSON.stringify(updatedLocal));
      setLocalNotifs(updatedLocal);
    } catch (e) {}
    if (markAllNotifsAsReadCtx) markAllNotifsAsReadCtx();
  };


  const clearAllNotifications = () => {
    try {
      const allIds = validNotifications.map(n => n.id);
      const updatedCleared = [...new Set([...clearedNotifIds, ...allIds])];
      localStorage.setItem('cleared_notification_ids', JSON.stringify(updatedCleared));
      setClearedNotifIds(updatedCleared);
      localStorage.setItem('local_notifications', JSON.stringify([]));
      setLocalNotifs([]);
    } catch (e) {}
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

          {/* Notification Bell Menu */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border relative transition-all duration-300 cursor-pointer ${
                unreadNotifCount > 0
                  ? 'notif-glow-active btn-moving-light border-blue-400 text-blue-600 bg-blue-50/60 shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title={unreadNotifCount > 0 ? `${unreadNotifCount} new notification(s)` : 'MindMatrix Notifications'}
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
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      MindMatrix Notifications
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotifCount > 0 ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">{unreadNotifCount} New</span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">All read</span>
                    )}
                    {validNotifications?.length > 0 && (
                      <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={markAllNotifsAsRead}
                            className="text-[10px] text-blue-600 hover:text-blue-700 font-bold underline transition-colors cursor-pointer"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={clearAllNotifications}
                          className="text-[10px] text-rose-500 hover:text-rose-700 font-bold underline transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
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
                        className={`p-3 rounded-xl transition-all cursor-pointer relative ${
                          !notif.isRead
                            ? 'bg-blue-50/80 border border-blue-100 hover:bg-blue-100/70 shadow-2xs'
                            : 'bg-slate-50 border border-transparent hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <p className="font-extrabold text-slate-900 leading-snug text-xs">{notif.title}</p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1 ring-2 ring-blue-200" />
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1.5">
                          {new Date(notif.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • MindMatrix Alerts
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
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
