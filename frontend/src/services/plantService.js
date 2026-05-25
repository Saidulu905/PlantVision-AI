import api from './api';

export const plantService = {
  getAllPlants: async () => {
    const response = await api.get('/api/plants');
    return response.data;
  },

  getPlantById: async (id) => {
    const response = await api.get(`/api/plants/${id}`);
    return response.data;
  },

  getPlantsByCategory: async (categoryId) => {
    const response = await api.get(`/api/plants/category/${categoryId}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  // Admin specific operations
  createPlant: async (plantData) => {
    const response = await api.post('/api/plants', plantData);
    return response.data;
  },

  updatePlant: async (id, plantData) => {
    const response = await api.put(`/api/plants/${id}`, plantData);
    return response.data;
  },

  deletePlant: async (id) => {
    const response = await api.delete(`/api/plants/${id}`);
    return response.data;
  }
};

export default plantService;
