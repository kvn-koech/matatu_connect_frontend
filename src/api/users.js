import axiosInstance from './apiClient';

// Drivers
export const fetchDrivers = () => axiosInstance.get('/users/manager/drivers');
export const inviteDriver = (email) => axiosInstance.post('/users/manager/invite', { email });
export const searchDriver = (email) => axiosInstance.get('/users/manager/drivers/search', { params: { email } });
export const updateDriverStatus = (id, action) => axiosInstance.post(`/users/manager/drivers/${id}/${action}`);
export const assignRoute = (driverId, routeId) => axiosInstance.post(`/users/manager/drivers/${driverId}/assign-route`, { route_id: routeId });
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);
