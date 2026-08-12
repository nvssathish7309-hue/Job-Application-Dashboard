import api from './api';

export const candidateService = {
  getCandidates: async (params = {}) => {
    const res = await api.get('/candidates', { params });
    return res.data;
  },
  getCandidateById: async (id) => {
    const res = await api.get(`/candidates/${id}`);
    return res.data;
  },
  createCandidate: async (formData) => {
    const res = await api.post('/candidates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  updateCandidate: async (id, formData) => {
    const res = await api.put(`/candidates/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  deleteCandidate: async (id) => {
    const res = await api.delete(`/candidates/${id}`);
    return res.data;
  },
  shortlistCandidate: async (id, remarks = '') => {
    const res = await api.patch(`/candidates/${id}/shortlist`, { remarks });
    return res.data;
  },
  rejectCandidate: async (id, reason = '') => {
    const res = await api.patch(`/candidates/${id}/reject`, { reason });
    return res.data;
  }
};
