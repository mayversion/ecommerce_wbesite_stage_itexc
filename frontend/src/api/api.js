import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies, authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error('Unauthorized access - please log in');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  // Add more auth endpoints as needed
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  // Add more product endpoints as needed
};

// Add more API modules as needed

export default api;
