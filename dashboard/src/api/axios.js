import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Something went wrong";

    // 🔐 Unauthorized / Forbidden
    if (status === 401 && !error.config.url.includes("/auth/me")) {
      toast.error("Please login to continue");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      toast.error("You are not authorized to perform this action");
    }

    if (status >= 500) {
      toast.error("Server error. Try again later");
    }

    return Promise.reject(error);
  }
);

export default api;
