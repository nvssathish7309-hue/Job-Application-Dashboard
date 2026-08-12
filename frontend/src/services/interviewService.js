import api from './api';

export const interviewService = {
  getInterviews: async () => {
    const res = await api.get('/interviews');
    return res.data;
  },
  getInterviewById: async (id) => {
    const res = await api.get(`/interviews/${id}`);
    return res.data;
  },
  scheduleInterview: async (data) => {
    const res = await api.post('/interviews', data);
    return res.data;
  },
  submitFeedback: async (id, feedbackData) => {
    const res = await api.post(`/interviews/${id}/feedback`, feedbackData);
    return res.data;
  }
};
