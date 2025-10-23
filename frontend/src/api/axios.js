import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // Production environment
  if (import.meta.env.PROD) {
    return 'https://cicd-whitefly-v2.onrender.com/api';
  }
  // Development environment - check for custom URL first
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  // For file uploads, don't set Content-Type (let browser set it with boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('CSRF token might be invalid or missing');
    }
    return Promise.reject(error);
  }
);

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default api;
