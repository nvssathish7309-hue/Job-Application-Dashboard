import React, { useState, useMemo, useEffect } from 'react';
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
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

  useEffect(() => {
    const loadNotifs = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('local_notifications') || '[]');
        setLocalNotifs(saved);
      } catch (e) {}
    };
    loadNotifs();
    window.addEventListener('candidateSubmitted', loadNotifs);
    return () => window.removeEventListener('candidateSubmitted', loadNotifs);
  }, []);

  const validNotifications = useMemo(() => {
    const userEmail = (user?.email || 'nvssathish7309@gmail.com').toLowerCase();
    const userFirstName = (user?.firstName || 'Sathish').toLowerCase();
    const candName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Sathish N';

    const merged = [];

    // 1. Backend notifications
    (notifications || []).forEach(n => {
      if (n && !merged.some(m => m.id === n._id || m.id === n.id)) {
        merged.push({
          id: n._id || n.id,
          title: n.title,
          message: n.message,
          timestamp: n.createdAt || n.timestamp,
          isRead: n.isRead
        });
      }
    });

    // 2. Local storage notifications
    localNotifs.forEach(ln => {
      if (ln && !merged.some(m => m.id === ln.id)) {
        merged.push(ln);
      }
    });

    // 3. Auto-generated candidate status notifications with Congratulations
    try {
      const savedCand = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const allCand = [...(candidates || []), ...savedCand];
      
      const candidateRecords = allCand.filter(c => {
        if (!c) return false;
        const cEmail = (c.email || '').toLowerCase();
        const cName = (c.fullName || c.name || '').toLowerCase();
        return cEmail === userEmail || cName.includes(userFirstName) || cName.includes('sathish') || userEmail.includes('sathish');
      });

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
            subText = 'Interview round scheduled.';
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

          const notifId = `notif-app-${idx}-${appIdx}-${roleName.replace(/\s+/g, '-')}-${stageText.replace(/\s+/g, '-')}`;

          const title = `🎉 Congratulations ${candName}! — MindMatrix`;
          const msg = `Congratulations ${candName}! Your candidate application status for "${roleName}" is currently "${stageText}" (${subText}).`;

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
    } catch (e) {}

    return merged.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }, [notifications, localNotifs, user, candidates]);

  const activeUnreadCount = validNotifications.filter(n => !n.isRead).length;

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
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">MindMatrix Alerts</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  {activeUnreadCount} new
                </span>
              </div>
              {activeUnreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {validNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">No new notifications</p>
                </div>
              ) : (
                validNotifications.map((item) => (
                  <div
                    key={item.id || item._id}
                    onClick={() => markAsRead(item.id || item._id)}
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
                      <Link
                        to={item.link}
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
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
