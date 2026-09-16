import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

API.interceptors.request.use(
  (config) => {
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


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  }
);


export default API;