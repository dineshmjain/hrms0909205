import axios from "axios";


const taskBaseUrl = import.meta.env.VITE_TASK_BASE_URL;
export const taskAxiosFormInstance = axios.create({
    baseURL: taskBaseUrl,
    headers: {
        "Content-Type": "multipart/form-data",
    },
})

taskAxiosFormInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


// Create axios instance
const taskAxiosInstance = axios.create({
    baseURL: taskBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
taskAxiosInstance.interceptors.request.use(
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

export default taskAxiosInstance;
