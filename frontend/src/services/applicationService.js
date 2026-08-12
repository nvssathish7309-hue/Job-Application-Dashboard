import api from './api';

export const applicationService = {
  getApplications: async (params = {}) => {
    const res = await api.get('/applications', { params });
    return res.data;
  },
  getApplicationById: async (id) => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },
  updateStage: async (id, stage, remarks = '') => {
    const res = await api.patch(`/applications/${id}/stage`, { stage, remarks });
    return res.data;
  }
};
