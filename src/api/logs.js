import axiosInstance from './axios';

// Submit a daily log
export const submitDriverLog = (data) => axiosInstance.post('/logs/', data);
