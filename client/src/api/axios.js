import axios from "axios";

const API = axios.create({
  baseURL: "https://devlink-backend-xs0u.onrender.com",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
