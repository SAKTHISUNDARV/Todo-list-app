// src/api.js
import axios from "axios";

// Use environment variable for flexibility
const BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const MAX_RETRIES = 2;
console.log("BASE_URL:", BASE_URL);
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log requests in development
  if (import.meta.env.DEV) {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  
  return config;
});

// Handle expired/invalid token and network errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Retry mechanism for network errors
    if (error.request && !config._retry && (config._retryCount || 0) < MAX_RETRIES) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;
      
      // Wait before retrying
      const delay = Math.pow(2, config._retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(config);
    }
    
    // Handle HTTP errors
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        console.error("Authentication error. Redirecting to login.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
      
      // Log HTTP errors
      if (import.meta.env.DEV) {
        console.error(`API Error: ${error.response.status} ${error.config.url}`, error.response.data);
      }
    } else if (error.request) {
      // Handle network errors
      console.error("Network error: Could not connect to server.", error.request);
      if (!navigator.onLine) {
        console.error("You are offline. Please check your internet connection.");
      }
    } else {
      // Handle other errors
      console.error("Request error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
