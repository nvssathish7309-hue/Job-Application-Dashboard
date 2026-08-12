import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Search, 
  Users, 
  Eye, 
  ArrowRight, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';
import Badge from '../common/Badge';

export default function CandidateListModal({ isOpen, onClose, title, statusFilter, candidates }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter candidates based on selected card status and search query
  const filteredCandidates = (candidates || []).filter(c => {
    const s = (c.status || '').toLowerCase();
    const matchStatus = 
      !statusFilter || 
      statusFilter === 'All' || 
      s.includes(statusFilter.toLowerCase());

    const q = searchTerm.toLowerCase();
    const matchSearch = 
      !q || 
      c.name.toLowerCase().includes(q) || 
      c.role.toLowerCase().includes(q) || 
      (c.skills || []).some(sk => sk.toLowerCase().includes(q));

    return matchStatus && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                {title || 'Candidate Details'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Showing {filteredCandidates.length} students / applicants in this list
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar (Search) */}
        <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student by name, role or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <button
            onClick={() => {
              onClose();
              navigate(`/candidates?status=${encodeURIComponent(statusFilter || 'All')}`);
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors shrink-0"
          >
            <span>Open in Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Candidate List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="font-bold text-slate-800 text-sm mb-1">No matching candidates found</p>
              <p className="text-xs">Try clearing your search query.</p>
            </div>
          ) : (
            filteredCandidates.map(c => (
              <div 
                key={c.id} 
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0 text-xs">
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                        {c.name}
                      </h4>
                      <Badge status={c.status} />
                    </div>
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                      <span><Briefcase className="w-3 h-3 inline mr-1 text-slate-400" />{c.role}</span>
                      <span>·</span>
                      <span>{c.experience}</span>
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{c.email}</span>
                      {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{c.phone}</span>}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(c.skills || []).slice(0, 4).map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate(`/candidates/${c.id}`);
                  }}
                  className="self-end sm:self-center px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Profile</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>Total Records: {filteredCandidates.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
