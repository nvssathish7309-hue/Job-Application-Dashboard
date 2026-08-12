import React from 'react';
import { Eye, Mail, Phone, Calendar, Award } from 'lucide-react';
import { getStatusBadge } from './CandidateTable';

export default function CandidateGrid({ candidates, onViewCandidate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidates.map((candidate) => {
        const badge = getStatusBadge(candidate.status);
        const avatarInitials = candidate.name
          .split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('');

        return (
          <div 
            key={candidate.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-base flex items-center justify-center shadow-sm shrink-0">
                    {avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {candidate.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600">
                      {candidate.role}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${badge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                  <span>{candidate.status}</span>
                </span>
              </div>

              {/* Detail Pills */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Experience: <strong>{candidate.experience}</strong></span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {candidate.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* View Profile Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Applied: {candidate.appliedDate}
              </span>
              <button
                onClick={() => onViewCandidate(candidate)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
