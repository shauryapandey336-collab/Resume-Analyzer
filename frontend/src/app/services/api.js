import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:5000/api",
     "https://resume-analyzer-by1r.onrender.com"
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
    (config) => {
        // Browser only
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;