import axios from "axios";

// Use Vite's environment variables (assuming `VITE_BASE_URL` is defined in your .env file)
const baseURL = import.meta.env.VITE_BASE_URL;
const masterURL = import.meta.env.VITE_MASTER_URL;

// Create axios instance
const plansAxiosInstance = axios.create({
  baseURL: masterURL, // Custom base URL for plans
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
