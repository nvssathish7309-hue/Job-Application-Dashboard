import React from 'react';
import { 
  Briefcase, 
  Plus, 
  Sun, 
  Moon, 
  Loader2, 
  AlertTriangle, 
  Search, 
  Sparkles,
  Users
} from 'lucide-react';

import MindMatrixLogo from './MindMatrixLogo';

export default function Navbar({ 
  darkMode, 
  setDarkMode, 
  onOpenAddModal, 
  searchQuery, 
  setSearchQuery,
  isLoadingState,
  setIsLoadingState,
  isErrorState,
  setIsErrorState,
  candidateCount
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <MindMatrixLogo layout="horizontal" showTagline={true} />
            <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
              HR Portal
            </span>
          </div>

          {/* Quick Search bar */}
          <div className="flex-1 max-w-md hidden md:block relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search candidate name, skills, role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:ring-indigo-500 text-slate-800 placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action buttons & Dev State Toggles */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Demo State Control Pills */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setIsLoadingState(!isLoadingState)}
                title="Toggle loading skeleton state to test UX"
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  isLoadingState 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Loader2 className={`w-3.5 h-3.5 ${isLoadingState ? 'animate-spin' : ''}`} />
                <span>Loading</span>
              </button>

              <button
                onClick={() => setIsErrorState(!isErrorState)}
                title="Toggle error state banner to test resiliency"
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  isErrorState 
                    ? 'bg-red-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Error State</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* + Add Candidate CTA */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Candidate</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
