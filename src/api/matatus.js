import axiosInstance from './axios';

export const getAvailableSeats = async (matatuId) => {
    const response = await axiosInstance.get(`/matatus/${matatuId}/seats`);
    return response.data; // Expected: { booked_seats: ['A1', 'B2'] }
};