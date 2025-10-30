import axios from "axios";

// Use Vite's environment variables (assuming `VITE_BASE_URL` is defined in your .env file)
const baseURL = import.meta.env.VITE_BASE_URL;

// Create axios instance
const plansAxiosInstance = axios.create({
  baseURL:'http://localhost:8050/api/v1',
  // baseURL: 'https://4c6bc37e-56c7-4438-9945-499e7dc0c72c-00-fy6ntyr2qww8.sisko.replit.dev/api/v1',
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { plansAxiosInstance };
