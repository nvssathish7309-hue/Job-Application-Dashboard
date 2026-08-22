import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import { History, ShieldCheck, Trash2, FileSpreadsheet, FileText, Search, XCircle, AlertTriangle } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAuditLogs = async () => {
    try {
      const res = await auditService.getAuditLogs();
      if (res.success) setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this audit log entry?')) return;
    setDeletingId(id);
    try {
      const res = await auditService.deleteLog(id);
      if (res.success) {
        setLogs(logs.filter(log => log._id !== id));
      } else {
        alert(res.message || 'Failed to delete audit log entry.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete audit log entry.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllLogs = async () => {
    try {
      const res = await auditService.clearLogs();
      if (res.success) {
        setLogs([]);
        setShowClearModal(false);
        alert('All audit logs have been successfully cleared.');
      } else {
        alert(res.message || 'Failed to clear audit logs.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear audit logs.');
    }
  };

  // Export to Excel / CSV
  const exportToExcel = () => {
    if (!logs.length) return alert('No audit logs available to export.');

    const headers = ['Timestamp', 'User Name', 'User Email', 'Action', 'Entity', 'Entity ID', 'Details'];
    const rows = logs.map(log => [
      `"${new Date(log.createdAt).toLocaleString()}"`,
      `"${log.userName || log.userId?.firstName || 'System'}"`,
      `"${log.userEmail || log.userId?.email || 'N/A'}"`,
      `"${log.action || ''}"`,
      `"${log.entity || ''}"`,
      `"${log.entityId || 'N/A'}"`,
      `"${(log.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Logs_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPdf = () => {
    if (!logs.length) return alert('No audit logs available to export.');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Please allow popups to export PDF report.');

    const logRowsHtml = filteredLogs.map((log, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #475569;">
          ${new Date(log.createdAt).toLocaleString()}
        </td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #0f172a;">
          ${log.userName || log.userId?.firstName || 'System'}
        </td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background-color: #eff6ff; color: #1d4ed8; font-size: 10px; font-weight: bold;">
            ${log.action}
          </span>
        </td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #334155; font-weight: 600;">
          ${log.entity} (${log.entityId || 'N/A'})
        </td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #334155;">
          ${log.description}
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Audit Logs Report - MindMatrix OS</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 24px; color: #0f172a; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
            .logo { font-size: 20px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f1f5f9; padding: 10px 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #475569; text-align: left; border-bottom: 2px solid #cbd5e1; }
            .footer { margin-top: 25px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">⚡ MindMatrix Recruitment OS</div>
              <div class="subtitle">System Audit &amp; Activity History Report</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748b;">
              <div>Generated: ${new Date().toLocaleString()}</div>
              <div>Total Log Entries: ${filteredLogs.length}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${logRowsHtml}
            </tbody>
          </table>

          <div class="footer">
            Official Confidential System Audit Log Report • Generated by MindMatrix Platform
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase();
    const userStr = (log.userName || log.userId?.firstName || 'System').toLowerCase();
    const actionStr = (log.action || '').toLowerCase();
    const entityStr = (log.entity || '').toLowerCase();
    const descStr = (log.description || '').toLowerCase();
    return userStr.includes(q) || actionStr.includes(q) || entityStr.includes(q) || descStr.includes(q);
  });

  return (
    <div className="space-y-6 animate-smooth-grow">
      
      {/* Page Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-blue-600" />
            <span>System Audit &amp; Activity Logs</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track recruitment actions, candidate updates, user access changes, and security audit events.
          </p>
        </div>

        {/* Action Buttons: Export PDF, Export Excel, Clear Logs */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportToPdf}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export audit logs to PDF document"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={exportToExcel}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export audit logs to Excel CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => setShowClearModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Clear all audit log entries"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Logs</span>
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit logs by user, action, entity, or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>
        <div className="text-xs font-bold text-slate-500 shrink-0">
          Showing <span className="text-slate-900">{filteredLogs.length}</span> of {logs.length} logs
        </div>
      </div>

      {/* Table Container */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-extrabold text-slate-700 text-sm">No audit logs found</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchQuery ? 'Try clearing your search query to view all system events.' : 'System audit history is currently empty.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                    {log.userName || log.userId?.firstName || 'System'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-100 inline-block">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {log.entity} {log.entityId ? `(${log.entityId})` : ''}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium max-w-xs sm:max-w-md truncate" title={log.description}>
                    {log.description}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteLog(log._id)}
                      disabled={deletingId === log._id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Clear All Audit Logs?</h3>
                <p className="text-xs text-slate-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50 p-3 rounded-2xl border border-rose-100">
              Are you sure you want to permanently delete all <strong>{logs.length}</strong> system audit log records from the database?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllLogs}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
