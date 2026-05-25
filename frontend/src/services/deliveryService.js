import api from './api';

export const deliveryService = {
  trackDelivery: async (orderId) => {
    const response = await api.get(`/api/delivery/track/${orderId}`);
    return response.data;
  },

  // Admin operations
  getAllDeliveries: async () => {
    const response = await api.get('/api/delivery/admin/all');
    return response.data;
  },

  updateDelivery: async (id, status, estimatedDate) => {
    const response = await api.put(`/api/delivery/admin/update/${id}`, {
      deliveryStatus: status,
      estimatedDate: estimatedDate
    });
    return response.data;
  }
};

export default deliveryService;
