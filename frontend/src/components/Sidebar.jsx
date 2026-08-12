import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  GitPullRequest, 
  Calendar, 
  BarChart3, 
  UserCheck, 
  History, 
  Settings,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const allNavItems = [
    {
      title: 'Recruitment',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'] },
        { label: 'Candidates', path: '/candidates', icon: Users, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'] },
        { label: 'Jobs', path: '/jobs', icon: Briefcase, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER'] },
        { label: 'Applications', path: '/applications', icon: FileText, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER'] },
        { label: 'Pipeline Board', path: '/applications/pipeline', icon: GitPullRequest, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER'] },
        { label: 'Interviews', path: '/interviews', icon: Calendar, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'] }
      ]
    },
    {
      title: 'Administration',
      items: [
        { label: 'User Management', path: '/users', icon: UserCheck, roles: ['SUPER_ADMIN'] },
        { label: 'Audit Logs', path: '/audit-logs', icon: History, roles: ['SUPER_ADMIN', 'HR_MANAGER'] },
        { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'HR_MANAGER'] },
        { label: 'Public Careers', path: '/careers', icon: Globe, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'] },
        { label: 'Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'HR_MANAGER', 'RECRUITER', 'INTERVIEWER'] }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 min-h-[calc(100vh-4rem)] border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 hidden md:block">
      <div className="space-y-6">
        {allNavItems.map((group, gIdx) => {
          const visibleItems = group.items.filter(item => item.roles.includes(user?.role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-2">
              <h3 className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {visibleItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={idx}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold'
                            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Role Footer Info */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
        <p className="text-[11px] font-semibold text-slate-400">Logged in as:</p>
        <p className="font-extrabold text-slate-900 truncate">{user?.email}</p>
        <span className="mt-1 inline-block text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {user?.role?.replace('_', ' ')}
        </span>
      </div>
    </aside>
  );
}
