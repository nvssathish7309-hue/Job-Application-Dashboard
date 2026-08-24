import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar, 
  BarChart3, 
  UserCheck, 
  History, 
  Settings,
  Trash2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const allNavItems = [
    {
      title: 'MAIN MENU',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER', 'CANDIDATE'] },
        { label: 'Candidates', path: '/candidates', icon: Users, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'] },
        { label: 'Jobs', path: '/jobs', icon: Briefcase, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER'] },
        { label: 'Applications', path: '/applications', icon: FileText, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'CANDIDATE'] },
        { label: 'Interviews', path: '/interviews', icon: Calendar, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'] }
      ]
    },
    {
      title: 'System & Portal',
      items: [
        { label: 'User Management', path: '/users', icon: UserCheck, roles: ['SUPER_ADMIN', 'HR_MANAGER'] },
        { label: 'Audit Logs', path: '/audit-logs', icon: History, roles: ['SUPER_ADMIN', 'HR_MANAGER'] },
        { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'HR_MANAGER'] },
        { label: 'Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER', 'CANDIDATE'] },
        { label: 'Trash', path: '/trash', icon: Trash2, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER', 'CANDIDATE'] }
      ]
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white text-slate-700 h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 hidden md:flex transition-all duration-300 relative`}>
      <div className="space-y-5 overflow-y-auto flex-1 pr-1 pb-4">
        
        {/* Sidebar Header & Collapse Toggle */}
        <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-100">
          {!isCollapsed ? (
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              MAIN MENU
            </span>
          ) : (
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
              MENU
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center"
            title={isCollapsed ? "Expand Sidebar (>)" : "Collapse Sidebar (<)"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {allNavItems.map((group, gIdx) => {
          const visibleItems = group.items.filter(item => item.roles.includes(user?.role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-2">
              {!isCollapsed && group.title !== 'MAIN MENU' && (
                <h3 className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <nav className="space-y-1">
                {visibleItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={idx}
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold'
                            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                        }`
                      }
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5" />
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Role Footer Info Pinned at Bottom Left Edge with Spinning Glow Effect */}
      <div className="pt-2 mt-auto shrink-0">
        <div className="spinning-glow-border-card p-[1.5px]">
          <div className={`p-3.5 rounded-[14px] bg-slate-50 border border-slate-200/80 text-xs relative z-10 ${isCollapsed ? 'text-center p-2' : ''}`}>
            {!isCollapsed ? (
              <>
                <p className="text-[11px] font-semibold text-slate-400">Logged in as:</p>
                <p className="font-extrabold text-slate-900 truncate">{user?.email}</p>
                <span className="mt-1 inline-block text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  {user?.role?.replace('_', ' ')}
                </span>
              </>
            ) : (
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block truncate">
                {user?.role?.split('_')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
