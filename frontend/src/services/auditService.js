import api from './api';

export const auditService = {
  getAuditLogs: async () => {
    const res = await api.get('/audit-logs');
    return res.data;
  },
  deleteLog: async (id) => {
    const res = await api.delete(`/audit-logs/${id}`);
    return res.data;
  },
  clearLogs: async () => {
    const res = await api.delete('/audit-logs');
    return res.data;
  }
};
