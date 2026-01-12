import axiosInstance from './axios';

// Fetch bookings (filtered by role on backend)
export const fetchBookings = () => axiosInstance.get('/bookings/');

// Create a new booking
export const createBooking = (data) => axiosInstance.post('/bookings/', data);

// Update booking status (accept/reject)
export const updateBookingStatus = (id, action) => axiosInstance.post(`/bookings/${id}/${action}`);

// Fetch bookings for a specific matatu (for seat status)
export const fetchMatatuBookings = (matatuId) => axiosInstance.get(`/bookings/matatu/${matatuId}`);
