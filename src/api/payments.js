import axiosInstance from './axios';

export const initiateSTKPush = async (bookingData) => {
    // bookingData: { matatu_id, seat_number, amount, phone_number }
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
};

export const checkPaymentStatus = async (bookingId) => {
    const response = await axiosInstance.get(`/bookings/${bookingId}/status`);
    return response.data;
};