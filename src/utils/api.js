import axios from "axios";

const API_BASE_URL = "http://localhost:8000/";
// const API_BASE_URL = "http://localhost:7009/";

// const API_BASE_URL = "https://kenumdashboardapi.estore.africa/";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
