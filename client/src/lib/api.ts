import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    if (status === 401) {
      localStorage.removeItem("token");
      if (!location.pathname.startsWith("/login")) {
        location.assign("/login");
      }
    } else if (status === 403 && (code === "NO_BRANCH" || code === "NO_COMPANY")) {
      if (!location.pathname.startsWith("/branch/setup")) {
        location.assign("/branch/setup");
      }
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default api;
