import axios from 'axios';

/**
 * Base API URL
 * - Use Vite environment variables
 * - Falls back to localhost for development
 */
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Create Axios instance
 */
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds to handle slow M-Pesa sandbox responses
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * REQUEST INTERCEPTOR
 * Attach JWT token to every request if available
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 * Handle auth errors globally
 */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            console.warn('Unauthorized – token may be expired');

            // Optional: clear auth data
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            // Optional redirect (uncomment if needed)
            // window.location.href = "/login";
        }

        if (status === 403) {
            console.warn('Forbidden – insufficient permissions');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
