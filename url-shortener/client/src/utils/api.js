import axios from 'axios';

// In development, Vite proxies /api to the backend (see vite.config.js),
// so a relative base URL works. In production, set VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Normalizes error messages so components can just read err.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const shortenUrl = (payload) => api.post('/api/shorten', payload).then((r) => r.data);

export const fetchUrls = (params) => api.get('/api/urls', { params }).then((r) => r.data);

export const deleteUrl = (id) => api.delete(`/api/url/${id}`).then((r) => r.data);

export const toggleFavorite = (id) => api.patch(`/api/url/${id}/favorite`).then((r) => r.data);

export const fetchAnalytics = (id) => api.get(`/api/analytics/${id}`).then((r) => r.data);

export const fetchOverview = () => api.get('/api/analytics').then((r) => r.data);

export default api;
