import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  addToCart: async (plantId, quantity) => {
    const response = await api.post('/api/cart/add', { plantId, quantity });
    return response.data;
  },

  updateQuantity: async (id, quantity) => {
    const response = await api.put(`/api/cart/update/${id}?quantity=${quantity}`);
    return response.data;
  },

  removeCartItem: async (id) => {
    const response = await api.delete(`/api/cart/remove/${id}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/api/cart/clear');
    return response.data;
  }
};

export default cartService;
