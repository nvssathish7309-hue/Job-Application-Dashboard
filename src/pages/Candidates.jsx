import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, X, ChevronDown, SlidersHorizontal,
  Eye, UserPlus, Users, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { TableRowSkeleton } from '../components/common/Skeleton';

// Debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const PAGE_SIZE = 10;

export default function Candidates() {
  const location = useLocation();
  const { candidates, isLoading, isError, setIsError } = useCandidates();

  // Parse initial search and status from URL query
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';
  const initialStatus = params.get('status') || 'All';

  const [rawSearch, setRawSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [roleFilter, setRoleFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const debouncedSearch = useDebounce(rawSearch, 280);

  // Dynamic role options from data
  const roleOptions = useMemo(() => {
    const roles = [...new Set(candidates.map(c => c.role))].sort();
    return ['All Roles', ...roles];
  }, [candidates]);

  // Filter + Sort
  const filtered = useMemo(() => {
    let list = candidates.filter(c => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.skills || []).some(s => s.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'All' ||
        c.status.toLowerCase().includes(statusFilter.toLowerCase());

      const matchRole = roleFilter === 'All' || c.role === roleFilter;

      let matchExp = true;
      if (experienceFilter !== 'All') {
        const yrs = c.experienceYears || 0;
        if (experienceFilter === '0-1') matchExp = yrs <= 1;
        else if (experienceFilter === '1-3') matchExp = yrs > 1 && yrs <= 3;
        else if (experienceFilter === '3-5') matchExp = yrs > 3 && yrs <= 5;
        else if (experienceFilter === '5+') matchExp = yrs > 5;
      }

      return matchSearch && matchStatus && matchRole && matchExp;
    });

    switch (sortBy) {
      case 'Name A–Z': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Name Z–A': list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Newest': list = [...list].sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0)); break;
      case 'Oldest': list = [...list].sort((a, b) => new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0)); break;
      case 'Experience': list = [...list].sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0)); break;
    }
    return list;
  }, [candidates, debouncedSearch, statusFilter, roleFilter, experienceFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const clearFilters = () => {
    setRawSearch('');
    setStatusFilter('All');
    setRoleFilter('All');
    setExperienceFilter('All');
    setSortBy('Newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = rawSearch || statusFilter !== 'All' || roleFilter !== 'All' || experienceFilter !== 'All';

  if (isError) {
    return (
      <ErrorState
        title="Failed to load candidates"
        message="Unable to retrieve candidate data. Please try again."
        onRetry={() => setIsError(false)}
      />
    );
  }

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Candidates
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <Link
          to="/candidates/add"
          className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Candidate</span>
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="search-glow relative rounded-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-[2]" />
          <input
            type="text"
            placeholder="Search candidates by name, role or skills..."
            value={rawSearch}
            onChange={e => { setRawSearch(e.target.value); setCurrentPage(1); }}
            className="relative z-[2] w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:border-transparent"
          />
          {rawSearch && (
            <button
              type="button"
              onClick={() => { setRawSearch(''); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-[2]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">


          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
            >
              {roleOptions.map(r => (
                <option key={r} value={r === 'All Roles' ? 'All' : r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Experience Filter */}
          <div className="relative">
            <select
              value={experienceFilter}
              onChange={e => { setExperienceFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
            >
              <option value="All">All Experience</option>
              <option value="0-1">0 – 1 years</option>
              <option value="1-3">1 – 3 years</option>
              <option value="3-5">3 – 5 years</option>
              <option value="5+">5+ years</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
            >
              {['All', 'New', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-auto"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-100">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Candidate', 'Role', 'Experience', 'Skills', 'Status', 'Action'].map(h => (
                    <th key={h} className="py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8">
                      <EmptyState onClearFilters={hasActiveFilters ? clearFilters : undefined} showAddButton={!hasActiveFilters} />
                    </td>
                  </tr>
                ) : (
                  paginated.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <Link to={`/candidates/${c.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate block">
                              {c.name}
                            </Link>
                            <p className="text-[11px] text-slate-400 truncate">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">{c.role}</td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{c.experience}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(c.skills || []).slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {skill}
                            </span>
                          ))}
                          {c.skills?.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium py-0.5">+{c.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4"><Badge status={c.status} /></td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/candidates/${c.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                  Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)
                ).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg font-semibold text-xs transition-all ${page === currentPage ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cards / Mobile View */}
      {viewMode === 'cards' && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-5 bg-slate-200 rounded w-24" />
                  <div className="h-8 bg-slate-200 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState onClearFilters={hasActiveFilters ? clearFilters : undefined} showAddButton={!hasActiveFilters} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map(c => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{c.role}</p>
                    </div>
                    <Badge status={c.status} />
                  </div>

                  <div className="text-xs text-slate-600 mb-2 font-medium">{c.experience}</div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(c.skills || []).slice(0, 4).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                        {skill}
                      </span>
                    ))}
                    {c.skills?.length > 4 && (
                      <span className="text-[10px] text-slate-400 py-0.5">+{c.skills.length - 4}</span>
                    )}
                  </div>

                  <Link
                    to={`/candidates/${c.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 font-semibold text-xs transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Candidate
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination for cards */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 text-xs pt-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
