import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, searchQuery, setSearchQuery }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans antialiased">

      {/* Navigation Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="footer-glow-line bg-white py-4 text-center text-xs text-slate-400 font-medium">
          MindMatrix Recruitment Dashboard · v2.4.0 · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
