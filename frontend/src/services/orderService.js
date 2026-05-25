import api from './api';

export const orderService = {
  checkout: async (address) => {
    const response = await api.post('/api/orders/checkout', { address });
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Admin order operations
  getAllOrders: async () => {
    const response = await api.get('/api/orders/admin/all');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/api/orders/admin/status/${id}?status=${status}`);
    return response.data;
  }
};

export default orderService;
