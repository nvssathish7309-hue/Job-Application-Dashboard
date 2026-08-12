import api from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },
  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },
  createJob: async (data) => {
    const res = await api.post('/jobs', data);
    return res.data;
  },
  updateJob: async (id, data) => {
    const res = await api.put(`/jobs/${id}`, data);
    return res.data;
  },
  updateJobStatus: async (id, status) => {
    const res = await api.patch(`/jobs/${id}/status`, { status });
    return res.data;
  },
  deleteJob: async (id) => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },
  getPublicJobs: async () => {
    const res = await api.get('/jobs/public');
    return res.data;
  },
  getPublicJobById: async (id) => {
    const res = await api.get(`/jobs/public/${id}`);
    return res.data;
  }
};
