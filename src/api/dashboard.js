import axiosInstance from './axios';

// Fetch global stats (for homepage or admin)
export const fetchDashboardStats = () => axiosInstance.get('/dashboard/stats');

// Fetch Sacco-specific stats (for Sacco Managers)
export const fetchSaccoStats = () => axiosInstance.get('/dashboard/sacco-stats');
