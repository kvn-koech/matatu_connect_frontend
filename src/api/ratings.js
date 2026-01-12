import axiosInstance from './axios';

export const fetchRatings = () => axiosInstance.get('/ratings/');
export const submitRating = (data) => axiosInstance.post('/ratings/', data);
