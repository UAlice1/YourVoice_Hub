import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

// ✅ NGO API
export const ngoAPI = {
  getCases: (params) => api.get('/ngo/cases', { params }),
  getNotifications: () => api.get('/ngo/notifications'),
  updateNotification: (id, data) => api.put(`/ngo/notifications/${id}`, data),
  getReports: () => api.get('/ngo/reports'),
  getProfile: () => api.get('/ngo/profile'),
  updateProfile: (data) => api.put('/ngo/profile', data),
};

// ✅ Cases API (NEW)
export const casesAPI = {
  // Submit new case (with optional files)
  submitCase: (formData) =>
    api.post('/cases', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get logged-in user's cases (supports pagination + filters)
  getUserCases: (params) => api.get('/cases', { params }),

  // Get single case by UUID
  getCaseByUuid: (uuid) => api.get(`/cases/${uuid}`),

  // Update case status
  updateCaseStatus: (uuid, status) =>
    api.put(`/cases/${uuid}/status`, { status }),

  // Delete case
  deleteCase: (uuid) => api.delete(`/cases/${uuid}`),
};

export default api;