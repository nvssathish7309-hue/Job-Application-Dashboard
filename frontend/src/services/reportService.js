import api from './api';

export const reportService = {
  getDashboardMetrics: async () => {
    const res = await api.get('/reports/metrics');
    return res.data;
  },
  downloadCSV: async () => {
    const res = await api.get('/reports/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'recruitment_report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
