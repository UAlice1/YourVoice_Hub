import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register:   (data) => api.post('/auth/register', data),
  login:      (data) => api.post('/auth/login', data),
  getProfile: ()     => api.get('/auth/me'),
};

export const ngoAPI = {
  getCases:           (params)   => api.get('/ngo/cases', { params }),
  getNotifications:   ()         => api.get('/ngo/notifications'),
  updateNotification: (id, data) => api.put(`/ngo/notifications/${id}`, data),
  getReports:         ()         => api.get('/ngo/reports'),
  getProfile:         ()         => api.get('/ngo/profile'),
  updateProfile:      (data)     => api.put('/ngo/profile', data),
  getCaseById:        (id)       => api.get(`/ngo/cases/${id}`), 
  updateCaseStatus: (id, data) => api.put(`/ngo/cases/${id}`, data),
};

export const caseAPI = {
  create:  (data)     => api.post('/cases', data),
  getAll:  (params)   => api.get('/cases', { params }),
  getById: (id)       => api.get(`/cases/${id}`),
  update:  (id, data) => api.put(`/cases/${id}`, data),
  delete:  (id)       => api.delete(`/cases/${id}`),
};

export const casesAPI = {
  submitCase:       (formData) => api.post('/cases', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    }),
  getUserCases:     (params)   => api.get('/cases', { params }),
  getCaseByUuid:    (uuid)     => api.get(`/cases/${uuid}`),
  updateCaseStatus: (uuid, status) => api.put(`/cases/${uuid}/status`, { status }),
  deleteCase:       (uuid)     => api.delete(`/cases/${uuid}`),
};

export const aiAPI = {
  chat:    (data) => api.post('/ai/chat', data),
  history: ()     => api.get('/ai/history'),
};

export const adminAPI = {
  getUsers:     (params)     => api.get('/admin/users', { params }),
  updateRole:   (uuid, role) => api.put(`/admin/users/${uuid}/role`, { role }),
  toggleActive: (uuid)       => api.put(`/admin/users/${uuid}/toggle-active`),
  deleteUser:   (uuid)       => api.delete(`/admin/users/${uuid}`),
  getReferrals: (params)     => api.get('/admin/referrals', { params }),
};

export default api;