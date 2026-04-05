import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — could trigger logout here
      console.log("Auth token expired");
    }
    return Promise.reject(error);
  }
);

export default api;