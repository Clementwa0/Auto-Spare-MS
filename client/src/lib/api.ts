import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Send the currently-selected branch on every request so the backend can
    // scope reads/writes without requiring a fresh token after each switch.
    const branchId = localStorage.getItem("activeBranchId");
    if (branchId) config.headers["X-Branch-Id"] = branchId;
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
    } else if (status === 403 && code === "NO_BRANCH") {
      const ids: string[] = error.response?.data?.branchIds || [];
      // Has branches but none selected -> pick one. None at all -> setup.
      const target = ids.length > 0 ? "/select-branch" : "/branch/setup";
      if (!location.pathname.startsWith(target)) location.assign(target);
    } else if (status === 403 && code === "NO_COMPANY") {
      if (!location.pathname.startsWith("/branch/setup")) {
        location.assign("/branch/setup");
      }
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default api;
