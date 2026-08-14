import api from './api';

export const userService = {
  getUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  createUser: async (userData) => {
    const res = await api.post('/users', userData);
    return res.data;
  },
  updateUserRole: async (id, role) => {
    const res = await api.put(`/users/${id}/role`, { role });
    return res.data;
  },
  toggleUserStatus: async (id) => {
    const res = await api.patch(`/users/${id}/toggle-status`);
    return res.data;
  },
  updateUserPassword: async (id, password) => {
    const res = await api.put(`/users/${id}/password`, { password });
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }
};
