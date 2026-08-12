import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2, RotateCcw, Search, ChevronLeft, AlertTriangle, RefreshCw, X, ShieldAlert
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import Badge from '../components/common/Badge';

export default function Trash() {
  const { trashedCandidates, restoreCandidate, permanentlyDeleteCandidate, emptyTrash } = useCandidates();
  const [search, setSearch] = useState('');
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return trashedCandidates;
    const q = search.toLowerCase();
    return trashedCandidates.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [trashedCandidates, search]);

  const handleRestore = (candidate) => {
    restoreCandidate(candidate.id);
  };

  const handlePermanentDelete = (candidate) => {
    if (window.confirm(`Permanently delete ${candidate.name}? This action cannot be undone.`)) {
      permanentlyDeleteCandidate(candidate.id);
    }
  };

  const handleConfirmEmptyTrash = () => {
    emptyTrash();
    setConfirmEmptyOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Trash</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Trash & Recycle Bin
              {trashedCandidates.length > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded-full">
                  {trashedCandidates.length} Item{trashedCandidates.length > 1 ? 's' : ''}
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Candidates in trash can be restored back to your recruitment pipeline or permanently removed.
            </p>
          </div>
        </div>

        {trashedCandidates.length > 0 && (
          <button
            onClick={() => setConfirmEmptyOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-sm shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      {trashedCandidates.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search deleted candidates by name, role or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      )}

      {/* Trash Table / List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {trashedCandidates.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Trash2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Trash is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              When you delete candidates from your dashboard or candidate list, they will appear here before permanent deletion.
            </p>
            <Link
              to="/candidates"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Return to Candidates
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            No deleted candidates match "{search}"
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Candidate', 'Role', 'Prior Status', 'Date Trashed', 'Actions'].map((h) => (
                    <th key={h} className="py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xs border border-slate-200">
                          {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{c.role}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {c.trashedAt || 'Recently'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* Restore Button */}
                        <button
                          onClick={() => handleRestore(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
                          title="Restore candidate to active list"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore
                        </button>

                        {/* Delete Permanently Button */}
                        <button
                          onClick={() => handlePermanentDelete(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
                          title="Delete candidate permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Empty Trash */}
      {confirmEmptyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Empty Trash?</h3>
                <p className="text-xs text-slate-500">This action is permanent and cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/60 border border-rose-100 p-3 rounded-xl">
              All {trashedCandidates.length} candidate(s) in the trash will be permanently removed from your system, including all their application data.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmEmptyOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEmptyTrash}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Empty Trash Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
