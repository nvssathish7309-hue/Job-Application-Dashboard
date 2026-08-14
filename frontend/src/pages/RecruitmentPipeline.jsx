import React, { useState, useEffect, useMemo } from 'react';
import { applicationService } from '../services/applicationService';
import { candidateService } from '../services/candidateService';
import { ArrowRight, UserCheck, Clock, Layers, Lock, Trash2, ChevronDown, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCandidates } from '../context/CandidateContext';

const STAGES = [
  { 
    key: 'New', 
    label: 'New Applicants', 
    color: 'border-purple-300 bg-purple-50/50 text-purple-700',
    cardBorder: 'border-purple-300 hover:border-purple-500 shadow-purple-500/5',
    titleColor: 'text-purple-700',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    openBtn: 'bg-purple-50 border-purple-200 text-purple-700 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600'
  },
  { 
    key: 'Screening', 
    label: 'Screening', 
    color: 'border-blue-300 bg-blue-50/50 text-blue-700',
    cardBorder: 'border-blue-300 hover:border-blue-500 shadow-blue-500/5',
    titleColor: 'text-blue-700',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    openBtn: 'bg-blue-50 border-blue-200 text-blue-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
  },
  { 
    key: 'Shortlisted', 
    label: 'Shortlisted', 
    color: 'border-sky-300 bg-sky-50/50 text-sky-700',
    cardBorder: 'border-sky-300 hover:border-sky-500 shadow-sky-500/5',
    titleColor: 'text-sky-700',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    openBtn: 'bg-sky-50 border-sky-200 text-sky-700 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600'
  },
  { 
    key: 'Interview', 
    label: 'Interview Scheduled', 
    color: 'border-amber-300 bg-amber-50/50 text-amber-700',
    cardBorder: 'border-amber-300 hover:border-amber-500 shadow-amber-500/5',
    titleColor: 'text-amber-700',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    openBtn: 'bg-amber-50 border-amber-200 text-amber-700 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600'
  },
  { 
    key: 'Selected', 
    label: 'Selected / Offer', 
    color: 'border-emerald-300 bg-emerald-50/50 text-emerald-700',
    cardBorder: 'border-emerald-300 hover:border-emerald-500 shadow-emerald-500/5',
    titleColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    openBtn: 'bg-emerald-50 border-emerald-200 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
  },
  { 
    key: 'Rejected', 
    label: 'Rejected', 
    color: 'border-rose-300 bg-rose-50/50 text-rose-700',
    cardBorder: 'border-rose-300 hover:border-rose-500 shadow-rose-500/5',
    titleColor: 'text-rose-700',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    openBtn: 'bg-rose-50 border-rose-200 text-rose-700 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600'
  }
];

export default function RecruitmentPipeline() {
  const { user } = useAuth();
  const isCandidate = user?.role === 'CANDIDATE';
  const { candidates, isLoading, refreshCandidates, shortlistCandidate, scheduleInterview, selectCandidate, rejectCandidate } = useCandidates();

  // Track which stage columns are open/unfolded. Empty object means all folded by default!
  const [expandedStages, setExpandedStages] = useState({});

  const toggleStage = (stageKey) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageKey]: !prev[stageKey]
    }));
  };

  const expandAllStages = () => {
    const allExpanded = {};
    STAGES.forEach(s => { allExpanded[s.key] = true; });
    setExpandedStages(allExpanded);
  };

  const collapseAllStages = () => {
    setExpandedStages({});
  };

  useEffect(() => {
    if (refreshCandidates) refreshCandidates();
    const handleGlobalSubmit = () => {
      if (refreshCandidates) refreshCandidates();
    };
    window.addEventListener('candidateSubmitted', handleGlobalSubmit);
    return () => window.removeEventListener('candidateSubmitted', handleGlobalSubmit);
  }, [refreshCandidates]);

  const applications = useMemo(() => {
    return (candidates || []).map((c, idx) => {
      const rawStage = c.stage || c.status || 'New';

      return {
        _id: c._id || c.id || `app-${idx}`,
        applicationId: c.applicationId || (typeof c.candidateId === 'string' ? c.candidateId.replace('CAN', 'APP') : `APP-00${idx + 1}`),
        candidateId: {
          _id: c._id || c.id,
          fullName: c.fullName || c.name || 'Candidate',
          name: c.fullName || c.name || 'Candidate',
          email: c.email,
          phone: c.phone,
          role: c.role || 'Software Engineer',
          experience: c.experience || 'Fresher'
        },
        stage: rawStage,
        status: rawStage,
        source: c.source || 'Candidate Portal',
        appliedAt: c.createdAt || c.appliedDate || new Date().toISOString()
      };
    });
  }, [candidates]);

  const [confirmModalData, setConfirmModalData] = useState(null);
  const [stageRemarks, setStageRemarks] = useState('');
  const [isSavingStage, setIsSavingStage] = useState(false);

  const handleSelectStageChange = (app, candName, newStage) => {
    const currentStageKey = (app.stage || app.status || 'New');
    if (currentStageKey === newStage) return;

    const currentStageLabel = STAGES.find(s => s.key === currentStageKey)?.label || currentStageKey;
    const targetStageLabel = STAGES.find(s => s.key === newStage)?.label || newStage;

    setConfirmModalData({
      app,
      candName,
      currentStage: currentStageLabel,
      newStage,
      targetStageLabel
    });
    setStageRemarks('');
  };

  const handleConfirmSaveStage = async () => {
    if (!confirmModalData) return;
    setIsSavingStage(true);
    const { app, newStage } = confirmModalData;

    try {
      await handleStageMove(app._id, newStage, stageRemarks);

      setExpandedStages(prev => ({
        ...prev,
        [newStage]: true
      }));

      setConfirmModalData(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingStage(false);
    }
  };

  const handleStageMove = async (appId, newStage, remarks = '') => {
    if (isCandidate) return;
    try {
      const targetApp = applications.find(a => a._id === appId || a.applicationId === appId);
      const candId = targetApp?.candidateId?._id || targetApp?._id || appId;

      const stageLower = newStage.toLowerCase();

      if (stageLower.includes('shortlist')) {
        await shortlistCandidate(candId, remarks);
      } else if (stageLower.includes('interview')) {
        await scheduleInterview(candId, { round: 'Technical Round 1', notes: remarks });
      } else if (stageLower.includes('select') || stageLower.includes('offer')) {
        await selectCandidate(candId, remarks);
      } else if (stageLower.includes('reject')) {
        await rejectCandidate(candId, remarks);
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
          const updated = saved.map(c => {
            if (c._id === candId || c.id === candId || c.candidateId === candId) {
              return { ...c, stage: newStage, status: newStage };
            }
            return c;
          });
          localStorage.setItem('registered_candidates', JSON.stringify(updated));
        } catch (e) {}
      }

      await applicationService.updateStage(appId, newStage, remarks || `Moved to ${newStage} via Kanban Pipeline`).catch(() => null);
      if (refreshCandidates) await refreshCandidates();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApplication = async (appId, candidateId) => {
    if (isCandidate) return;
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      if (candidateId) {
        await candidateService.deleteCandidate(candidateId);
      } else {
        await applicationService.deleteApplication(appId);
      }
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert('Failed to delete application');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const openCount = Object.values(expandedStages).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruitment Pipeline
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Click any column header to fold or unfold that stage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-xs font-bold">
            <button
              onClick={expandAllStages}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Unfold all stage columns"
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Expand All</span>
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={collapseAllStages}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Fold all stage columns"
            >
              <Minimize2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Fold All</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{applications.length} Applications</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex items-start gap-3 overflow-x-auto pt-2 pb-6 px-1 min-h-[500px]">
        {STAGES.map((col) => {
          const colApps = applications.filter(a => {
            const s = (a.stage || a.status || '').toLowerCase();
            const target = col.key.toLowerCase();
            if (target === 'new') return s === 'new' || s === 'applied' || s === 'new applicants';
            if (target === 'interview') return s.includes('interview');
            if (target === 'selected') return s.includes('select') || s.includes('offer');
            if (target === 'shortlisted') return s.includes('shortlist');
            if (target === 'rejected') return s.includes('reject');
            if (target === 'screening') return s.includes('screen');
            return s === target;
          });
          const isExpanded = !!expandedStages[col.key];

          if (!isExpanded) {
            {/* ── FOLDED / COLLAPSED COLUMN ── */}
            return (
              <div
                key={col.key}
                onClick={() => toggleStage(col.key)}
                className={`group bg-white border ${col.cardBorder} rounded-2xl p-3 flex flex-col items-center justify-between min-w-[130px] w-36 transition-all duration-300 cursor-pointer select-none shadow-2xs hover:shadow-md hover:scale-[1.02] min-h-[360px]`}
                title={`Click to open ${col.label} (${colApps.length} candidates)`}
              >
                {/* Folded Top: Icon */}
                <div className={`p-2 rounded-xl border ${col.color} transition-transform group-hover:scale-110 mb-1`}>
                  <ChevronRight className="w-4.5 h-4.5" />
                </div>

                {/* Folded Middle: Colored Title Label & Colored Candidate Badge */}
                <div className="flex-1 flex flex-col items-center justify-center my-3 text-center px-1">
                  <span className={`font-extrabold text-xs leading-snug transition-colors ${col.titleColor}`}>
                    {col.label}
                  </span>
                  <span className={`mt-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border shadow-2xs ${col.badgeColor}`}>
                    {colApps.length} candidate{colApps.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Folded Bottom: Open hint */}
                <div className={`w-full text-center py-1.5 px-2 rounded-xl border text-[10px] font-extrabold transition-all uppercase tracking-wider ${col.openBtn}`}>
                  Open
                </div>
              </div>
            );
          }

          {/* ── UNFOLDED / EXPANDED COLUMN ── */}
          return (
            <div
              key={col.key}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col min-w-[270px] max-w-[320px] flex-1 transition-all duration-300 shadow-2xs"
            >
              
              {/* Column Header Bar (Clicking folds it back) */}
              <div
                onClick={() => toggleStage(col.key)}
                className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between mb-3 select-none cursor-pointer hover:opacity-90 transition-opacity ${col.color}`}
                title="Click header to fold stage"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                  <span className="font-extrabold">{col.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-900 text-[11px] font-extrabold border border-slate-200 shadow-2xs">
                  {colApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
                {colApps.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-white/50">
                    No candidates
                  </div>
                ) : (
                  colApps.map((app) => {
                    const candName = typeof app.candidateId === 'object' && app.candidateId
                      ? (app.candidateId.fullName || app.candidateId.name)
                      : (app.candidateName || app.fullName || app.name || 'Candidate');

                    const candRole = typeof app.candidateId === 'object' && app.candidateId
                      ? app.candidateId.role
                      : (app.role || app.jobTitle || 'Software Engineer');

                    const candExp = typeof app.candidateId === 'object' && app.candidateId
                      ? app.candidateId.experience
                      : (app.experience || 'Fresher');

                    return (
                      <div
                        key={app._id}
                        className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                              {candName}
                            </p>
                            <p className="text-[11px] text-slate-500 font-semibold truncate">
                              {candRole}
                            </p>
                          </div>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {app.applicationId || 'APP-001'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>{candExp}</span>
                          <span>•</span>
                          <span>{app.source || 'Website'}</span>
                        </div>

                        {/* Stage Move Action Buttons & Delete Button */}
                        <div className="pt-2.5 border-t border-slate-100 space-y-2 text-[11px]">
                          {isCandidate ? (
                            <div className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-extrabold text-slate-600 text-[10px] flex items-center justify-center gap-1 cursor-not-allowed select-none w-full">
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{col.label}</span>
                            </div>
                          ) : (
                            <select
                              value={STAGES.some(s => s.key === app.stage) ? app.stage : (app.status || 'New')}
                              onChange={(e) => handleSelectStageChange(app, candName, e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 text-[11px] focus:outline-none focus:border-blue-400 cursor-pointer transition-colors truncate"
                            >
                              {STAGES.map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                              ))}
                            </select>
                          )}

                          <div className="flex items-center justify-between pt-0.5">
                            {(() => {
                              const targetCandId = typeof app.candidateId === 'object' && app.candidateId
                                ? (app.candidateId._id || app.candidateId.id || app.candidateId.candidateId)
                                : (app.candidateId || app._id);
                              return (
                                <a
                                  href={`/candidates/${targetCandId}`}
                                  className="inline-flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800 hover:underline text-[11px] transition-colors"
                                >
                                  <span>View</span>
                                  <ArrowRight className="w-3 h-3" />
                                </a>
                              );
                            })()}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteApplication(app._id, app.candidateId?._id || app.candidateId);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── CONFIRM STAGE MOVE & SAVE MODAL ── */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Move Candidate Stage</h3>
                  <p className="text-xs text-slate-500 font-medium">Confirm & Save Stage Transition</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmModalData(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Candidate:</span>
                <span className="font-extrabold text-slate-900">{confirmModalData.candName}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                <span className="font-semibold text-slate-500">Current Stage:</span>
                <span className="px-2.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[11px]">{confirmModalData.currentStage}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-slate-500">New Target Stage:</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px] shadow-2xs">
                  {confirmModalData.targetStageLabel}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notes / Remarks (Optional)
              </label>
              <textarea
                value={stageRemarks}
                onChange={(e) => setStageRemarks(e.target.value)}
                placeholder="Add optional notes for this stage change..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveStage}
                disabled={isSavingStage}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavingStage ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <span>Save & Move Candidate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

