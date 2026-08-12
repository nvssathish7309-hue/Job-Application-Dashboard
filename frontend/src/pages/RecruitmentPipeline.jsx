import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { ArrowRight, UserCheck, Clock, Layers } from 'lucide-react';

const STAGES = [
  { key: 'New', label: 'New Applicants', color: 'border-purple-300 bg-purple-50/50 text-purple-700' },
  { key: 'Screening', label: 'Screening', color: 'border-blue-300 bg-blue-50/50 text-blue-700' },
  { key: 'Shortlisted', label: 'Shortlisted', color: 'border-sky-300 bg-sky-50/50 text-sky-700' },
  { key: 'Interview', label: 'Interview Scheduled', color: 'border-amber-300 bg-amber-50/50 text-amber-700' },
  { key: 'Selected', label: 'Selected / Offer', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-700' },
  { key: 'Rejected', label: 'Rejected', color: 'border-rose-300 bg-rose-50/50 text-rose-700' }
];

export default function RecruitmentPipeline() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getApplications();
      if (res.success) setApplications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStageMove = async (appId, newStage) => {
    try {
      await applicationService.updateStage(appId, newStage, `Moved to ${newStage} via Kanban Pipeline`);
      fetchApplications();
    } catch (err) {
      alert('Failed to update application stage');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruitment Pipeline
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Drag & drop or move candidate applications across hiring stages.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{applications.length} Total Applications</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colApps = applications.filter(a => (a.stage || a.status) === col.key);

          return (
            <div key={col.key} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col min-w-[240px]">
              
              {/* Column Header */}
              <div className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between mb-3 ${col.color}`}>
                <span>{col.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-900 text-[11px] font-extrabold shadow-2xs">
                  {colApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                {colApps.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                    No candidates
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all space-y-2.5 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                            {app.candidateId?.fullName || 'Candidate'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-semibold truncate">
                            {app.candidateId?.role || 'Software Engineer'}
                          </p>
                        </div>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {app.applicationId}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>{app.candidateId?.experience || 'Fresher'}</span>
                        <span>•</span>
                        <span>{app.source || 'Website'}</span>
                      </div>

                      {/* Stage Move Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <select
                          value={app.stage || app.status}
                          onChange={(e) => handleStageMove(app._id, e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 text-[10px] focus:outline-none"
                        >
                          {STAGES.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>

                        <a
                          href={`/candidates/${app.candidateId?._id}`}
                          className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                        >
                          View <ArrowRight className="w-2.5 h-2.5" />
                        </a>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
