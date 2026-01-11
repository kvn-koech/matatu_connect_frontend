import axiosInstance from './axios';

// Fetch all matatus
export const fetchMatatus = async () => {
    const response = await axiosInstance.get('/matatus/');
    return response.data;
};

export const getAvailableSeats = async (matatuId) => {
    const response = await axiosInstance.get(`/matatus/${matatuId}/seats`);
    return response.data; // Expected: { booked_seats: ['A1', 'B2'] }
};

export const acceptVehicle = async (id) => {
    const response = await axiosInstance.post(`/matatus/${id}/accept`);
    return response.data;
};

export const rejectVehicle = async (id) => {
    const response = await axiosInstance.post(`/matatus/${id}/reject`);
    return response.data;
};

export const addVehicle = async (data) => {
    const response = await axiosInstance.post(`/matatus/`, data);
    return response.data;
};

export const updateVehicle = async (id, data) => {
    const response = await axiosInstance.patch(`/matatus/${id}`, data);
    return response.data;
};

export const deleteVehicle = async (id) => {
    const response = await axiosInstance.delete(`/matatus/${id}`);
    return response.data;
};