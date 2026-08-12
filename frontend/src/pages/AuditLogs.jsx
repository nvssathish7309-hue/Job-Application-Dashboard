import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import { History, ShieldCheck } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchAuditLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Audit & Activity Logs
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Immutable history log of recruitment actions, candidate stage changes, and security events.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {log.userName || log.userId?.firstName || 'System'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {log.entity} ({log.entityId || 'N/A'})
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
