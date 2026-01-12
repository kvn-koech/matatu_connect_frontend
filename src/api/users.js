import axiosInstance from './axios';

// Drivers
export const fetchDrivers = () => axiosInstance.get('/users/manager/drivers');
export const inviteDriver = (email) => axiosInstance.post('/users/manager/invite', { email });
export const searchDriver = (email) => axiosInstance.get('/users/manager/drivers/search', { params: { email } });
export const updateDriverStatus = (id, action) => axiosInstance.post(`/users/manager/drivers/${id}/${action}`);
