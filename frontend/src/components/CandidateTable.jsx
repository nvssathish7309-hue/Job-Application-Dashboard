import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, MoreVertical, Calendar, CheckCircle, XCircle, Trophy } from 'lucide-react';

export function getStatusBadge(status) {
  switch (status) {
    case 'Shortlisted':
      return {
        bg: 'bg-blue-50 border-blue-200 text-blue-700',
        dot: 'bg-blue-500'
      };
    case 'Interview Scheduled':
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-700',
        dot: 'bg-amber-500 animate-pulse'
      };
    case 'Selected':
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        dot: 'bg-emerald-500'
      };
    case 'Rejected':
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-700',
        dot: 'bg-rose-500'
      };
    case 'Applied':
    default:
      return {
        bg: 'bg-slate-100 border-slate-200 text-slate-700',
        dot: 'bg-slate-400'
      };
  }
}

export default function CandidateTable({ candidates, onViewCandidate, onChangeStatus }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(candidates.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = candidates.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Candidate</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Experience</th>
              <th className="py-4 px-6">Skills</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentCandidates.map((candidate) => {
              const badge = getStatusBadge(candidate.status);
              const avatarInitials = candidate.name
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('');

              return (
                <tr 
                  key={candidate.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Candidate Name & Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                        {avatarInitials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {candidate.name}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {candidate.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {candidate.role}
                  </td>

                  {/* Experience */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      candidate.experience === 'Fresher'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {candidate.experience}
                    </span>
                  </td>

                  {/* Skills Tags */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {candidate.skills.slice(0, 3).map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/80 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 text-slate-700 rounded-md">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                      <span>{candidate.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewCandidate(candidate)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-200 transition-all hover:scale-105 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({candidates.length} candidates)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages)
            .map((page, idx, arr) => {
              const showDots = idx > 0 && page - arr[idx - 1] > 1;
              return (
                <React.Fragment key={page}>
                  {showDots && <span className="px-1 text-slate-400 text-xs">...</span>}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
