import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { useCandidates } from '../../context/CandidateContext';
import { MindMatrixIcon } from '../MindMatrixLogo';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { metrics } = useCandidates();

  const navItems = [
    { name: 'Dashboard',     path: '/dashboard',       icon: LayoutDashboard, badge: null },
    { name: 'Candidates',    path: '/candidates',      icon: Users,           badge: metrics.totalCandidates },
    { name: 'Add Candidate', path: '/candidates/add',  icon: UserPlus,        badge: null },
  ];

  const secondaryItems = [
    { name: 'Settings', path: '/settings', icon: Settings, badge: null },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-600 border-r border-slate-200 select-none">

      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-1.5 rounded-xl bg-blue-50 border border-blue-100 shrink-0">
            <MindMatrixIcon className="w-7 h-5" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base tracking-tight">
                <span className="text-blue-700">Mind</span>
                <span className="text-blue-500">Matrix</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Recruiter Hub
              </span>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-2 rounded-xl text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 transition-all active:scale-95 cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          {(!collapsed || mobileOpen) && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Main Menu
            </p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/candidates' || item.path === '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-200'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                      {(!collapsed || mobileOpen) && (
                        <span className="flex-1 truncate">{item.name}</span>
                      )}
                      {(!collapsed || mobileOpen) && item.badge !== null && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Secondary */}
        <div>
          {(!collapsed || mobileOpen) && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              System
            </p>
          )}
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {(!collapsed || mobileOpen) && (
                    <span className="flex-1 truncate">{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Badge */}
      {(!collapsed || mobileOpen) && (
        <div className="btn-moving-light p-3 m-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            MM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Enterprise HR</p>
            <p className="text-[11px] text-slate-400 truncate">v2.4.0 · Active</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block sticky top-0 h-screen transition-all duration-300 z-30 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="relative w-64 max-w-xs h-full z-10 animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
