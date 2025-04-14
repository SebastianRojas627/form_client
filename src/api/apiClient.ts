import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const apiClient = axios.create({
  baseURL: "http://localhost:5001",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleApiError(error);
    console.error(errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default apiClient;
