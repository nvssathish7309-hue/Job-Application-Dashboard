import api from './api';

export const auditService = {
  getAuditLogs: async () => {
    const res = await api.get('/audit-logs');
    return res.data;
  }
};
