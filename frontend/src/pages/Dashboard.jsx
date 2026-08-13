import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Calendar, CheckCircle2, Plus,
  TrendingUp, Award, AlignJustify, BarChart2,
  BarChart3, PieChart, Triangle, Briefcase, FileText,
  MapPin, Building, Clock, ArrowRight, X, CheckCircle
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';
import ErrorState from '../components/common/ErrorState';
import CandidateListModal from '../components/candidates/CandidateListModal';
import { CardSkeleton, ChartSkeleton } from '../components/common/Skeleton';

// ── Pipeline chart colour palette ─────────────────────────────────────────────
const PIPELINE_SEGMENTS = [
  { key: 'shortlisted', label: 'Shortlisted', color: '#3b82f6', bg: 'bg-blue-500',   text: 'text-blue-700',   light: '#eff6ff', border: '#bfdbfe' },
  { key: 'interview',   label: 'Interview',   color: '#f59e0b', bg: 'bg-amber-500',   text: 'text-amber-700',  light: '#fffbeb', border: '#fde68a' },
  { key: 'selected',    label: 'Selected',    color: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-700',light: '#ecfdf5', border: '#a7f3d0' },
  { key: 'rejected',    label: 'Rejected',    color: '#ef4444', bg: 'bg-rose-500',    text: 'text-rose-700',   light: '#fff1f2', border: '#fecdd3' },
  { key: 'applied',     label: 'Applied',     color: '#8b5cf6', bg: 'bg-purple-500',  text: 'text-purple-700', light: '#f3e8ff', border: '#e9d5ff' },
];

function getMetricValue(metrics, key) {
  return key === 'shortlisted' ? metrics.shortlistedCount
       : key === 'interview'   ? metrics.interviewCount
       : key === 'selected'    ? metrics.selectedCount
       : key === 'rejected'    ? metrics.rejectedCount
       :                         (metrics.appliedCount ?? metrics.newCount);
}

// ── CHART: Horizontal stacked bar ─────────────────────────────────────────────
function HorizontalBarChart({ metrics }) {
  const total = metrics.totalCandidates || 1;
  const segments = useMemo(() => {
    return PIPELINE_SEGMENTS.map(s => ({
      ...s,
      value: getMetricValue(metrics, s.key),
      pct: (getMetricValue(metrics, s.key) / total) * 100
    })).sort((a, b) => b.value - a.value);
  }, [metrics, total]);

  return (
    <div className="space-y-4">
      <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
        {segments.map(s => {
          return s.pct > 0 ? (
            <div key={s.key} style={{ width: `${s.pct}%`, background: s.color }}
              className="h-full transition-all rounded-sm" title={`${s.label}: ${s.value}`} />
          ) : null;
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-between">
          <span className="text-slate-500 font-medium">All</span>
          <span className="font-bold text-slate-500">{metrics.totalCandidates}</span>
        </div>
        {segments.map(s => (
          <div key={s.key} className="p-2.5 rounded-xl flex items-center justify-between border"
            style={{ background: s.light, borderColor: s.border }}>
            <span style={{ color: s.color }} className="font-medium">{s.label}</span>
            <span style={{ color: s.color }} className="font-bold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CHART: Vertical bar ────────────────────────────────────────────────────────
function VerticalBarChart({ metrics }) {
  const allBars = useMemo(() => {
    const raw = [
      { label: 'Total', value: metrics.totalCandidates, color: '#94a3b8' },
      ...PIPELINE_SEGMENTS.map(s => ({ label: s.label, value: getMetricValue(metrics, s.key), color: s.color })),
    ];
    return raw.sort((a, b) => b.value - a.value);
  }, [metrics]);

  const max = Math.max(...allBars.map(b => b.value), 1);

  return (
    <div className="flex items-end justify-center gap-4 h-52 pt-4 pb-6 px-2">
      {allBars.map(bar => (
        <div key={bar.label} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.value}</span>
          <div className="w-full relative flex items-end" style={{ height: '140px' }}>
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
              style={{
                height: `${(bar.value / max) * 140}px`,
                background: bar.color,
                minHeight: bar.value > 0 ? '6px' : '0',
              }}
              title={`${bar.label}: ${bar.value}`}
            />
          </div>
          <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight truncate w-full">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── CHART: Donut ───────────────────────────────────────────────────────────────
function DonutChart({ metrics }) {
  const total = metrics.totalCandidates || 1;
  const data = useMemo(() => {
    return PIPELINE_SEGMENTS.map(s => ({
      ...s,
      value: getMetricValue(metrics, s.key),
      pct: (getMetricValue(metrics, s.key) / total) * 100,
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);
  }, [metrics, total]);

  // SVG arc helper
  const r = 70, cx = 90, cy = 90;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const arcs = data.map(d => {
    const offset = circumference - (d.pct / 100) * circumference;
    const rotation = (cumulative / 100) * 360 - 90;
    cumulative += d.pct;
    return { ...d, offset, rotation };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
      <div className="relative shrink-0">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {arcs.map((arc, i) => (
            <circle key={i}
              cx={cx} cy={cy} r={r}
              fill="transparent"
              stroke={arc.color}
              strokeWidth="28"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={arc.offset}
              transform={`rotate(${arc.rotation} ${cx} ${cy})`}
              className="transition-all duration-500 hover:stroke-[32] cursor-pointer"
            />
          ))}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#94a3b8" fontSize="22" fontWeight="800">{total}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">TOTAL</text>
        </svg>
      </div>
      <div className="flex flex-col gap-2.5 flex-1 w-full">
        {data.map(d => (
          <div key={d.key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
            <span className="text-xs font-semibold text-slate-600 flex-1">{d.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
              </div>
              <span className="text-xs font-bold w-10 text-right" style={{ color: d.color }}>{d.value}</span>
              <span className="text-[10px] text-slate-400 w-8 text-right">{d.pct.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CHART: Pie ────────────────────────────────────────────────────────────────
function PieChartView({ metrics }) {
  const total = metrics.totalCandidates || 1;
  const data = useMemo(() => {
    return PIPELINE_SEGMENTS.map(s => ({
      ...s,
      value: getMetricValue(metrics, s.key),
      pct: (getMetricValue(metrics, s.key) / total) * 100,
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);
  }, [metrics, total]);

  // Build SVG pie slices using path commands
  const cx = 90, cy = 90, r = 80;
  let startAngle = -90;

  const slices = data.map(d => {
    const angle = (d.pct / 100) * 360;
    const rad = (a) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(startAngle));
    const y1 = cy + r * Math.sin(rad(startAngle));
    const endAngle = startAngle + angle;
    const x2 = cx + r * Math.cos(rad(endAngle));
    const y2 = cy + r * Math.sin(rad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    startAngle = endAngle;
    return { ...d, path };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
      <svg width="180" height="180" viewBox="0 0 180 180" className="shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2"
            className="hover:opacity-80 cursor-pointer transition-opacity" />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-2.5 flex-1 w-full text-xs">
        {data.map(d => (
          <div key={d.key} className="flex items-center gap-2 p-2 rounded-xl border"
            style={{ background: d.light, borderColor: d.border }}>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
            <div className="min-w-0">
              <p className="font-bold" style={{ color: d.color }}>{d.value} ({d.pct.toFixed(0)}%)</p>
              <p className="text-slate-500 truncate">{d.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CHART: Funnel ─────────────────────────────────────────────────────────────
function FunnelChart({ metrics }) {
  const total = metrics.totalCandidates || 1;

  // Build stages and sort in descending order of value to ensure
  // rounded pills decrease smoothly from top to bottom (Image 2 design with proper funnel order)
  const sortedStages = useMemo(() => {
    const raw = [
      { label: 'Total', value: metrics.totalCandidates, color: '#94a3b8' },
      ...PIPELINE_SEGMENTS.map(s => ({
        label: s.label,
        value: getMetricValue(metrics, s.key),
        color: s.color
      }))
    ];
    return raw.sort((a, b) => b.value - a.value);
  }, [metrics]);

  return (
    <div className="space-y-3 py-3 w-full">
      {sortedStages.map((stage) => {
        const pct = Math.round((stage.value / total) * 100);
        const barWidthPct = Math.max(8, pct);

        return (
          <div key={stage.label} className="flex items-center gap-4 group">
            {/* Left: Stage Label */}
            <div className="w-24 text-right shrink-0">
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                {stage.label}
              </span>
            </div>

            {/* Center: Rounded Pill Bar (Image 2 design) */}
            <div className="flex-1 flex justify-center">
              <div
                className="h-9 rounded-2xl flex items-center justify-center text-white text-xs font-extrabold shadow-xs transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-md"
                style={{
                  width: `${barWidthPct}%`,
                  minWidth: '40px',
                  backgroundColor: stage.color,
                }}
                title={`${stage.label}: ${stage.value} candidate(s) (${pct}%)`}
              >
                {stage.value}
              </div>
            </div>

            {/* Right: Percentage */}
            <div className="w-12 shrink-0">
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                {pct}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { candidates, metrics, isLoading, isError, setIsError } = useCandidates();
  
  const [chartType, setChartType] = useState('horizontal');
  const [publicJobs, setPublicJobs] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    statusFilter: 'All'
  });

  useEffect(() => {
    const fetchPublicJobsData = async () => {
      try {
        const res = await jobService.getPublicJobs();
        if (res.success) {
          setPublicJobs(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch public jobs:', err);
      }
    };
    fetchPublicJobsData();
  }, []);

  const handleCardClick = (title, status) => {
    setModalState({
      isOpen: true,
      title,
      statusFilter: status
    });
  };

  if (isError) {
    return (
      <ErrorState 
        title="Failed to load dashboard metrics"
        message="Unable to communicate with recruitment database service. Please retry."
        onRetry={() => setIsError(false)}
      />
    );
  }

  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    resume: null
  });

  const handleOpenApplyModal = (job) => {
    setSelectedJobToApply(job);
    setApplySubmitted(false);

    let savedProfile = null;
    try {
      const stored = localStorage.getItem('candidateProfile');
      if (stored) savedProfile = JSON.parse(stored);
    } catch (e) {}

    const defaultName = (user?.firstName && user?.lastName)
      ? `${user.firstName} ${user.lastName}`
      : (user?.name || savedProfile?.name || 'Sathish N');

    setApplyForm({
      fullName: defaultName,
      email: user?.email || savedProfile?.email || 'nvssathish7309@gmail.com',
      phone: user?.phone || savedProfile?.phone || '+91 6380887476',
      resume: null
    });
  };

  const [appliedJobTitles, setAppliedJobTitles] = useState(() => {
    try {
      const stored = localStorage.getItem(`appliedJobs_${user?.email || 'guest'}`);
      return stored ? JSON.parse(stored) : ['Senior Frontend Engineer'];
    } catch (e) {
      return ['Senior Frontend Engineer'];
    }
  });

  useEffect(() => {
    if (user?.email) {
      try {
        localStorage.setItem(`appliedJobs_${user.email}`, JSON.stringify(appliedJobTitles));
      } catch (e) {}
    }
  }, [appliedJobTitles, user?.email]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', applyForm.fullName);
      formData.append('email', applyForm.email);
      formData.append('phone', applyForm.phone);
      formData.append('role', selectedJobToApply?.title || 'Senior Frontend Engineer');
      if (applyForm.resume) {
        formData.append('resume', applyForm.resume);
      }
      const res = await candidateService.createCandidate(formData);

      if (selectedJobToApply?.title) {
        setAppliedJobTitles(prev => [...new Set([...prev, selectedJobToApply.title])]);
      }

      window.dispatchEvent(new CustomEvent('candidateSubmitted', { detail: res?.data }));
    } catch (err) {
      console.error(err);
    } finally {
      setApplySubmitted(true);
    }
  };

  // Specialized Candidate Portal View
  if (user?.role === 'CANDIDATE') {
    let savedProfile = null;
    try {
      const stored = localStorage.getItem('candidateProfile');
      if (stored) savedProfile = JSON.parse(stored);
    } catch (e) {}

    const candidateRole = savedProfile?.role || 'Senior Frontend Engineer';
    const candidateName = user.firstName || savedProfile?.name?.split(' ')[0] || 'Applicant';
    const openJobsCount = publicJobs.length;

    const submittedCount = appliedJobTitles.length;
    const currentStageText = submittedCount > 0 ? 'Shortlisted' : 'Not Applied';
    const currentStageSub = submittedCount > 0 ? 'In review by recruiter' : 'No active application';
    const nextInterviewText = submittedCount > 0 ? 'Technical Round 1' : 'None Scheduled';
    const nextInterviewSub = submittedCount > 0 ? 'Scheduled for Aug 15, 10:00 AM' : 'Will appear once scheduled';

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-blue-100 mb-3">
              Candidate Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {candidateName}! 👋
            </h1>
            <p className="mt-2 text-sm text-blue-100/90 font-medium leading-relaxed">
              Explore active job openings in your company, track your current pipeline stage, and review upcoming interview details.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/careers"
                className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Explore Open Positions</span>
                <Plus className="w-4 h-4" />
              </Link>
              <Link
                to="/settings"
                className="px-5 py-2.5 bg-blue-500/30 hover:bg-blue-500/40 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Edit Candidate Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards Grid: Openings, Submitted Apps, Current Stage, Next Interview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Company Openings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Company Openings
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{openJobsCount}</span>
              <Link to="/careers" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-slate-400 mt-2">{openJobsCount} active job hiring role{openJobsCount === 1 ? '' : 's'} in company</p>
          </div>

          {/* Card 2: Submitted Applications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Submitted Applications
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{submittedCount}</span>
            <p className="text-xs text-slate-400 mt-2">Active job submission{submittedCount === 1 ? '' : 's'}</p>
          </div>

          {/* Card 3: Current Pipeline Stage */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Current Stage
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xl font-extrabold text-blue-600 tracking-tight block truncate">{currentStageText}</span>
            <p className="text-xs text-slate-400 mt-2">{currentStageSub}</p>
          </div>

          {/* Card 4: Next Interview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                Next Interview
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xl font-extrabold text-amber-600 tracking-tight block truncate">{nextInterviewText}</span>
            <p className="text-xs text-slate-400 mt-2">{nextInterviewSub}</p>
          </div>

        </div>

        {/* Next Interview Detail Card (Only shown if candidate has active application) */}
        {submittedCount > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-amber-500/30">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Upcoming Interview
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Aug 15, 2026</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">Technical Round 1 — {candidateRole}</h3>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-amber-600" /> 10:00 AM - 10:45 AM IST</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5 text-blue-600" /> Interviewer: Ankita Kumar (Senior HR)</span>
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> Scheduled
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Active Company Openings Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Company Openings at MindMatrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">{openJobsCount} active position{openJobsCount === 1 ? '' : 's'} open for applications</p>
            </div>
            <Link to="/careers" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Openings →</Link>
          </div>
          {publicJobs.length === 0 ? (
            <p className="text-xs text-slate-400">No active job openings available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {publicJobs.map((job) => {
                const isApplied = appliedJobTitles.includes(job.title) || appliedJobTitles.includes(job._id);
                return (
                  <div key={job._id || job.jobId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{job.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{job.department} · {job.location || job.workMode || 'Bangalore'}</p>
                    </div>
                    {isApplied ? (
                      <span className="px-3.5 py-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl inline-flex items-center gap-1 select-none shadow-2xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenApplyModal(job)}
                        className="px-4 py-2 text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-2xs active:scale-[0.97] cursor-pointer"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Apply Job Modal (Matching Screenshot 1) */}
        {selectedJobToApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up relative">
              
              {applySubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Application Submitted!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Thank you for applying for <span className="font-bold text-slate-800">{selectedJobToApply.title}</span>. Our HR recruiting team will review your application.
                  </p>
                  <button
                    onClick={() => setSelectedJobToApply(null)}
                    className="px-6 py-2.5 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors mt-2 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                      Apply for {selectedJobToApply.title}
                    </h3>
                    <button
                      onClick={() => setSelectedJobToApply(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={applyForm.fullName}
                        onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Upload Resume (PDF, DOCX) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setApplyForm({ ...applyForm, resume: e.target.files[0] })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedJobToApply(null)}
                        className="px-5 py-2.5 bg-slate-100 font-bold text-xs text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track and manage candidates across the hiring process.
          </p>
        </div>

        <Link
          to="/candidates/add"
          className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Candidate</span>
        </Link>
      </div>

      {/* 2. Primary Metric Cards (4 Required Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Card 1: Total Candidates */}
            <div 
              onClick={() => handleCardClick('Total Candidates', 'All')}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-400 hover:shadow-md hover:scale-[1.01] cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                  Total Candidates
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.totalCandidates}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Active applications in pipeline</span>
                <span className="text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View students →
                </span>
              </div>
            </div>

            {/* Card 2: Shortlisted */}
            <div 
              onClick={() => handleCardClick('Shortlisted Candidates', 'Shortlisted')}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-400 hover:shadow-md hover:scale-[1.01] cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                  Shortlisted
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.shortlistedCount}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +12% this week
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Qualified for interview rounds</span>
                <span className="text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View students →
                </span>
              </div>
            </div>

            {/* Card 3: Interview Scheduled */}
            <div 
              onClick={() => handleCardClick('Interview Scheduled Candidates', 'Interview')}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-amber-400 hover:shadow-md hover:scale-[1.01] cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                  Interview Scheduled
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.interviewCount}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  4 rounds today
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Upcoming technical assessments</span>
                <span className="text-[11px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View students →
                </span>
              </div>
            </div>

            {/* Card 4: Selected */}
            <div 
              onClick={() => handleCardClick('Selected Candidates', 'Selected')}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-400 hover:shadow-md hover:scale-[1.01] cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                  Selected
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.selectedCount}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  2 offers accepted
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Hired & ready to onboard</span>
                <span className="text-[11px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View students →
                </span>
              </div>
            </div>
          </>
        )}

      </div>

      {/* 3. Hiring Pipeline Overview — Chart Switcher */}
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          {/* Header Row */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Hiring Pipeline Overview</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                  {[
                    { id: 'horizontal', label: 'Stacked Bar' },
                    { id: 'vertical',   label: 'Bar Chart' },
                    { id: 'donut',      label: 'Donut Chart' },
                    { id: 'pie',        label: 'Pie Chart' },
                    { id: 'funnel',     label: 'Funnel' },
                  ].find(c => c.id === chartType)?.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Live status distribution of candidate pool</p>
            </div>

            {/* Right: Chart Type Toggle + Total */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                All Candidates: <strong className="text-slate-900">{metrics.totalCandidates}</strong>
              </span>

              {/* Chart Type Icon Buttons with Labels */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                {[
                  { id: 'horizontal', icon: <AlignJustify className="w-3.5 h-3.5" />,  label: 'Stacked Bar'   },
                  { id: 'vertical',   icon: <BarChart2    className="w-3.5 h-3.5" />,  label: 'Bar Chart'     },
                  { id: 'donut',      icon: <BarChart3    className="w-3.5 h-3.5" />,  label: 'Donut Chart'   },
                  { id: 'pie',        icon: <PieChart     className="w-3.5 h-3.5" />,  label: 'Pie Chart'     },
                  { id: 'funnel',     icon: <Triangle     className="w-3.5 h-3.5 rotate-180" />, label: 'Funnel' },
                ].map(({ id, icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setChartType(id)}
                    title={label}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      chartType === id
                        ? 'bg-white shadow-sm text-blue-600 border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Area — animated fade on switch */}
          <div key={chartType} className="animate-fade-in">
            {chartType === 'horizontal' && <HorizontalBarChart metrics={metrics} />}
            {chartType === 'vertical'   && <VerticalBarChart   metrics={metrics} />}
            {chartType === 'donut'      && <DonutChart         metrics={metrics} />}
            {chartType === 'pie'        && <PieChartView       metrics={metrics} />}
            {chartType === 'funnel'     && <FunnelChart        metrics={metrics} />}
          </div>
        </div>
      )}



      {/* Candidate List Modal Popup */}
      <CandidateListModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        statusFilter={modalState.statusFilter}
        candidates={candidates}
      />

    </div>
  );
}
