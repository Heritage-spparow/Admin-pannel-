import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 30000,
  withCredentials: true,
});

/* 🔑 DO NOT FORCE CONTENT-TYPE */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 🚫 let browser decide content-type for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});


// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/password', passwords),

  // Address management
  addAddress: (addressData) => api.post('/auth/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/auth/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.put(`/auth/addresses/${addressId}/default`),
  registerWithGoogle: () => api.get('/auth/google'),
};

// Product API calls
export const productAPI = {
  getAll: (params) => api.get('/products-enhanced', { params }),
  getById: (id) => api.get(`/products-enhanced/${id}`),
  getFeatured: () => api.get('/products-enhanced/featured'),
  getTopRated: () => api.get('/products-enhanced/top/rated'),
  getCategories: () => api.get('/products-enhanced/categories'),
   getCollections: () => api.get("/products-enhanced/collections"),
  search: (query) => api.get('/products-enhanced', { params: { search: query } }),
};
export const collectionAPI = {
  getAll: () => api.post("/collections/sync"),

  updateCoverImage: (name, data) =>
    api.put(`/collections/${name}/cover`, data),

  deleteCoverImage: (name) =>
    api.delete(`/collections/${name}/cover`),
};

// Cart API calls
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productData) => api.post('/cart/add', productData),
  update: (itemId, updateData) => api.put(`/cart/item/${itemId}`, updateData),
  remove: ({ productId, size }) =>
    api.delete('/cart/item', {
      params: { productId, size }
    }),
  clear: () => api.delete('/cart/clear'),
  getCount: () => api.get('/cart/count'),
};

// Order API calls
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateToPaid: (id, paymentData) => api.put(`/orders/${id}/pay`, paymentData),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  invoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),

  createRazorpayOrder: (amount) =>
    api.post('/orders/razorpay', { amount }),

  verifyRazorpayPayment: (data) =>
    api.post('/orders/razorpay/verify', data),
};

// ==========================
// ADMIN API CALLS (UPDATED)
// ==========================
// ==========================
// ADMIN API CALLS (UPDATED)
// ==========================
export const adminAPI = {
  // 🔥 ADMINS ONLY
  getAdmins: () => api.get("/admin/admins"),

  toggleAdminStatus: (id) =>
    api.put(`/admin/admins/${id}/status`),

  deleteAdmin: (id) =>
    api.delete(`/admin/admins/${id}`),

  // 👤 CUSTOMERS (ROLE = user)
  getCustomers: () => api.get("/admin/customers"),

  // 📦 ORDERS
  getOrders: (params) => api.get("/orders", { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) =>
    api.put(`/orders/${id}/status`, data),

  // 📊 DASHBOARD
  getStats: () => api.get("/admin/overview"),

  // 🔔 NOTIFICATIONS (NEW)

  getNewOrders: (since) =>
    api.get("/admin/notifications/orders", {
      params: { since },
    }),
};



export const landingAPI = {
  get: () => api.get("/landing"),
  update: (data) => api.post("/landing", data),
};

export default api;