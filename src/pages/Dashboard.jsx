import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, Calendar, CheckCircle2, Plus,
  Search, Eye, ArrowRight, TrendingUp, Award,
  AlignJustify, BarChart2, BarChart3, PieChart, Triangle,
  Filter, RotateCcw, Briefcase
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import Badge from '../components/common/Badge';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import CandidateListModal from '../components/candidates/CandidateListModal';
import { CardSkeleton, ChartSkeleton, TableRowSkeleton } from '../components/common/Skeleton';

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
  const { candidates, metrics, isLoading, isError, setIsError } = useCandidates();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [chartType, setChartType] = useState('horizontal');
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    statusFilter: 'All'
  });

  // Extract unique roles dynamically from candidates
  const availableRoles = useMemo(() => {
    return Array.from(new Set(candidates.map(c => c.role))).filter(Boolean);
  }, [candidates]);

  const handleCardClick = (title, status) => {
    setStatusFilter(status);
    setModalState({
      isOpen: true,
      title,
      statusFilter: status
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setRoleFilter('All');
    setExperienceFilter('All');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All' || roleFilter !== 'All' || experienceFilter !== 'All';

  // Filter recent candidates table
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchSearch = !searchTerm || 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStatus = statusFilter === 'All' || 
        c.status.toLowerCase().includes(statusFilter.toLowerCase()) ||
        (statusFilter.toLowerCase() === 'applied' && (c.status.toLowerCase().includes('applied') || c.status.toLowerCase().includes('new')));

      const matchRole = roleFilter === 'All' || 
        c.role.toLowerCase() === roleFilter.toLowerCase();

      const matchExp = experienceFilter === 'All' ||
        (experienceFilter === '0-2' && (c.experience.includes('1') || c.experience.includes('2') || c.experience.includes('0'))) ||
        (experienceFilter === '3-5' && (c.experience.includes('3') || c.experience.includes('4') || c.experience.includes('5'))) ||
        (experienceFilter === '5+' && (c.experience.includes('6') || c.experience.includes('7') || c.experience.includes('8') || c.experience.includes('10')));

      return matchSearch && matchStatus && matchRole && matchExp;
    }).slice(0, 10);
  }, [candidates, searchTerm, statusFilter, roleFilter, experienceFilter]);

  if (isError) {
    return (
      <ErrorState 
        title="Failed to load dashboard metrics"
        message="Unable to communicate with recruitment database service. Please retry."
        onRetry={() => setIsError(false)}
      />
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

      {/* 4. Recent Candidates Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-200 space-y-4">
          
          {/* 1. Header Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-base text-slate-900">
                Recent Candidates
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200">
                {filteredCandidates.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Filter active candidates by status, role, experience or search name
            </p>
          </div>

          {/* 2. Filter Options & View Directory in the SAME ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            
            {/* Filter Inputs (Search, Role, Exp, Status, Reset) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 1. Search Filter */}
              <div className="search-glow relative min-w-[170px] flex-1 sm:flex-initial rounded-xl">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-[2]" />
                <input 
                  type="text"
                  placeholder="Filter recent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative z-[2] w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-[2]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 2. Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 max-w-[140px] truncate transition-all"
              >
                <option value="All">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              {/* 3. Experience Filter */}
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
              >
                <option value="All">All Experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>

              {/* 4. Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
              >
                <option value="All">All Statuses</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* 5. Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 flex items-center gap-1 shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* View All Directory Button in the SAME ROW */}
            <Link
              to="/candidates"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-all shrink-0 self-start md:self-auto"
            >
              <span>View All Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>

        </div>

        {/* Candidate Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Experience</th>
                <th className="py-3.5 px-4">Skills</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8">
                    <EmptyState 
                      title="No matching candidates" 
                      description="Try adjusting your quick filter term."
                      onClearFilters={() => setSearchTerm('')}
                      showAddButton={false}
                    />
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {c.role}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.experience}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 2).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                            {skill}
                          </span>
                        ))}
                        {c.skills.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-medium py-0.5">
                            +{c.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/candidates/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
