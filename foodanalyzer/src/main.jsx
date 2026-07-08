import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from '../Store/Store.jsx'
import axios from 'axios';

// Automatically handle switching between localhost and Render URL
const rawBase = import.meta.env.VITE_API_URL || "";
const apiBase = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
axios.defaults.baseURL = apiBase;

// Request interceptor to automatically add JWT token to all requests if present
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 status)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message;
      if (message === "Invalid token" || message === "Token not found") {
        // Clear auth data
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("useremail");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        
        // Redirect to Login page
        window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
     <App />
  </Provider>
)

