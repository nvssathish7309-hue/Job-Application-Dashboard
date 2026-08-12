import React, { useState } from 'react';
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

export default function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 stroke-[2.2]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
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
                <h3 className="font-extrabold text-slate-900 text-sm">Notifications</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  {unreadCount} new
                </span>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">No new notifications</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => markAsRead(item._id)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                      !item.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!item.isRead ? 'bg-blue-600' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-900 leading-snug">{item.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.message}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
