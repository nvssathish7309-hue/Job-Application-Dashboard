import React from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  LayoutList, 
  LayoutGrid, 
  RotateCcw,
  Briefcase
} from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedRole,
  setSelectedRole,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  availableRoles,
  totalResults,
  onResetFilters
}) {
  const isFiltered = searchQuery !== '' || selectedStatus !== 'All' || selectedRole !== 'All' || sortBy !== 'newest';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm transition-colors">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Mobile Search input */}
        <div className="relative block md:hidden w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search candidates, skills, role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm">
            <Filter className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 uppercase hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 cursor-pointer pr-2 text-sm"
            >
              <option value="All" className="bg-white text-slate-800">All Stages</option>
              <option value="Applied" className="bg-white text-slate-800">Applied</option>
              <option value="Shortlisted" className="bg-white text-slate-800">Shortlisted</option>
              <option value="Interview Scheduled" className="bg-white text-slate-800">Interview Scheduled</option>
              <option value="Selected" className="bg-white text-slate-800">Selected</option>
              <option value="Rejected" className="bg-white text-slate-800">Rejected</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm">
            <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 uppercase hidden sm:inline">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 cursor-pointer pr-2 text-sm"
            >
              <option value="All" className="bg-white text-slate-800">All Roles</option>
              {availableRoles.map(role => (
                <option key={role} value={role} className="bg-white text-slate-800">{role}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm">
            <ArrowUpDown className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 uppercase hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 cursor-pointer pr-2 text-sm"
            >
              <option value="newest" className="bg-white">Newest First</option>
              <option value="name-asc" className="bg-white">Name (A - Z)</option>
              <option value="name-desc" className="bg-white">Name (Z - A)</option>
              <option value="exp-desc" className="bg-white">Experience (High to Low)</option>
              <option value="exp-asc" className="bg-white">Experience (Fresher First)</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

        </div>

        {/* View Mode & Results Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <span className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{totalResults}</strong> candidates
          </span>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'table' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
