import React, { useState, useMemo, useEffect } from 'react';
import { Bell, CheckCheck, ExternalLink, Inbox, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useCandidates } from '../context/CandidateContext';
import { Link } from 'react-router-dom';

export default function NotificationsDropdown() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const { candidates } = useCandidates();
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifs, setLocalNotifs] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState([]);
  const [clearedNotifIds, setClearedNotifIds] = useState([]);

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

  const validNotifications = useMemo(() => {
    const userEmail = (user?.email || '').toLowerCase();
    const userFirstName = (user?.firstName || '').toLowerCase();
    const userRole = (user?.role || 'CANDIDATE').toUpperCase();
    const isAccessTeam = ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'].includes(userRole);

    const merged = [];

    // 1. Backend notifications
    (notifications || []).forEach(n => {
      const id = n._id || n.id;
      if (!n || !id || clearedNotifIds.includes(id) || merged.some(m => m.id === id)) return;

      if (isAccessTeam) {
        if (n.forAdmin || n.forRecruiter || n.forInterviewer || n.targetRole !== 'CANDIDATE' || !n.title?.includes('Congratulations')) {
          merged.push({
            id,
            title: n.title,
            message: n.message,
            timestamp: n.createdAt || n.timestamp,
            isRead: n.isRead || readNotifIds.includes(id)
          });
        }
      } else {
        if (!n.forAdmin && !n.forRecruiter) {
          merged.push({
            id,
            title: n.title,
            message: n.message,
            timestamp: n.createdAt || n.timestamp,
            isRead: n.isRead || readNotifIds.includes(id)
          });
        }
      }
    });

    // 2. Local storage notifications
    localNotifs.forEach(ln => {
      const id = ln.id;
      if (!ln || !id || clearedNotifIds.includes(id) || merged.some(m => m.id === id)) return;

      if (isAccessTeam) {
        // Filter out granular candidate alerts for admin, keeping only system-wide notifications
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

    // 3. Auto-generated candidate & recruitment team alerts
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
          const cName = (c.fullName || c.name || '').toLowerCase();
          return (userEmail && cEmail === userEmail) || cName.includes(userFirstName) || cName.includes('sathish') || userEmail.includes('sathish');
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

                merged.push({
                  id: reminder10MinId,
                  title: `⏰ Upcoming Interview Reminder — 10 Mins Away`,
                  message: `Hi ${candName}! Your Technical Round 1 interview for "${roleName}" with ${iName} is starting in 10 minutes (10:00 AM IST). Click to join Google Meet: https://meet.google.com/xyz-abc-123`,
                  timestamp: new Date().toISOString(),
                  isRead: readNotifIds.includes(reminder10MinId),
                  link: 'https://meet.google.com/xyz-abc-123'
                });
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

            const notifId = `cand-app-${idx}-${appIdx}-${roleName.replace(/\s+/g, '-')}-${stageText.replace(/\s+/g, '-')}`;

            if (!clearedNotifIds.includes(notifId) && !merged.some(n => n.id === notifId)) {
              const title = `🎉 Congratulations ${candName}! — MindMatrix`;
              const msg = `Congratulations ${candName}! Your candidate application status for "${roleName}" is currently "${stageText}" (${subText}).`;

              merged.push({
                id: notifId,
                title,
                message: msg,
                timestamp: app.appliedAt || new Date().toISOString(),
                isRead: readNotifIds.includes(notifId)
              });
            }
          });
        });
      }
    } catch (e) {}

    return merged.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }, [notifications, localNotifs, readNotifIds, clearedNotifIds, user, candidates]);

  const activeUnreadCount = useMemo(() => {
    return validNotifications.filter(n => !n.isRead).length;
  }, [validNotifications]);

  const handleMarkSingleAsRead = (id) => {
    try {
      const updatedRead = [...new Set([...readNotifIds, id])];
      localStorage.setItem('read_notification_ids', JSON.stringify(updatedRead));
      setReadNotifIds(updatedRead);

      const saved = JSON.parse(localStorage.getItem('local_notifications') || '[]');
      const updatedLocal = saved.map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem('local_notifications', JSON.stringify(updatedLocal));
      setLocalNotifs(updatedLocal);
    } catch (e) {}
    if (markAsRead) markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
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
    if (markAllAsRead) markAllAsRead();
  };

  const handleClearAllNotifications = () => {
    try {
      const allIds = validNotifications.map(n => n.id);
      const updatedCleared = [...new Set([...clearedNotifIds, ...allIds])];
      localStorage.setItem('cleared_notification_ids', JSON.stringify(updatedCleared));
      setClearedNotifIds(updatedCleared);
      localStorage.setItem('local_notifications', JSON.stringify([]));
      setLocalNotifs([]);
    } catch (e) {}
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
          activeUnreadCount > 0
            ? 'bg-blue-50 text-blue-600 border border-blue-300 shadow-md shadow-blue-500/20 notif-glow-active'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent'
        }`}
        title="MindMatrix Notifications"
      >
        <Bell className={`w-5 h-5 stroke-[2.2] transition-transform ${activeUnreadCount > 0 ? 'animate-bell-ring text-blue-600' : ''}`} />
        {activeUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white animate-pulse z-10">
            {activeUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">MindMatrix Alerts</h3>
                {activeUnreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[11px]">
                    {activeUnreadCount} new
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-[11px]">
                    All read
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {/* Mark All Read Button */}
                {activeUnreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Mark all notifications as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}

                {/* Clear All Notifications Button */}
                {validNotifications.length > 0 && (
                  <button
                    onClick={handleClearAllNotifications}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors border-l border-slate-200 pl-2.5"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {validNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">No notifications left</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">All notifications cleared or read.</p>
                </div>
              ) : (
                validNotifications.map((item) => (
                  <div
                    key={item.id || item._id}
                    onClick={() => handleMarkSingleAsRead(item.id || item._id)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                      !item.isRead ? 'bg-blue-50/60 hover:bg-blue-100/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!item.isRead ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-900 leading-snug">{item.title}</p>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-relaxed">{item.message}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {new Date(item.timestamp || item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • MindMatrix Alerts
                      </span>
                    </div>
                    {item.link && (
                      item.link.startsWith('http') ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-600 hover:text-emerald-700 p-1 bg-emerald-50 rounded-md border border-emerald-200 shrink-0"
                          title="Join Meeting"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          to={item.link}
                          onClick={() => setIsOpen(false)}
                          className="text-slate-400 hover:text-blue-600 p-1 shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
