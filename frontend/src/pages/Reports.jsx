import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Download, BarChart2, PieChart, Users, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = data?.distribution || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruitment Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Export hiring reports, stage analytics, and recruiter metrics.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Analytics Chart Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">Candidate Pipeline Stage Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
