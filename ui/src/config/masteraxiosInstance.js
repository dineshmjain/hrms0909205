import axios from "axios";


const masterPortalBaseUrl = import.meta.env.VITE_MASTER_PORTAL_BASE_URL;
export const masterPortalFormInstance = axios.create({
    baseURL: masterPortalBaseUrl,
    headers: {
        "Content-Type": "multipart/form-data",
    },
})

masterPortalFormInstance.interceptors.request.use(
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
const masterPortalAxiosInstance = axios.create({
    baseURL: masterPortalBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
masterPortalAxiosInstance.interceptors.request.use(
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

export default masterPortalAxiosInstance;
