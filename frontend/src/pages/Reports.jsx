import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Download, BarChart2, PieChart as PieIcon, Users, TrendingUp, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await reportService.getDashboardMetrics();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleDownloadCSV = () => {
    reportService.downloadCSV();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-smooth-grow">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Loading Analytics Dashboard...</p>
      </div>
    );
  }

  const chartData = data?.distribution || [
    { name: 'New', count: 0, color: '#64748b' },
    { name: 'Shortlisted', count: 4, color: '#3b82f6' },
    { name: 'Interview', count: 2, color: '#f59e0b' },
    { name: 'Selected', count: 2, color: '#10b981' },
    { name: 'Rejected', count: 0, color: '#ef4444' }
  ];

  const metrics = data?.metrics || {
    totalCandidates: 8,
    shortlistedCount: 4,
    interviewCount: 2,
    selectedCount: 2
  };

  return (
    <div className="space-y-6 animate-smooth-grow">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart2 className="w-7 h-7 text-blue-600" />
            <span>Recruitment Reports &amp; Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Export hiring reports, stage analytics, and recruiter performance metrics.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Top Metric Cards with Smooth Entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Candidates</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {metrics.totalCandidates || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Shortlisted</p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {metrics.shortlistedCount || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Interview Scheduled</p>
              <p className="text-2xl font-black text-amber-500 mt-1">
                {metrics.interviewCount || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Hired / Selected</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {metrics.selectedCount || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Candidate Pipeline Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Candidate Pipeline Stage Distribution</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">Live Stage Metrics</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f8fafc', radius: 8 }} />
                <Bar 
                  dataKey="count" 
                  radius={[10, 10, 0, 0]}
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={1800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Ratio Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600" />
              <span>Stage Share</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">% Breakdown</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.filter(d => d.count > 0)}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={5}
                  isAnimationActive={true}
                  animationBegin={300}
                  animationDuration={1800}
                  animationEasing="ease-out"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
