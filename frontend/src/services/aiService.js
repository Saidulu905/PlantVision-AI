import api from './api';

export const aiService = {
  detectPlant: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/api/ai/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  chat: async (message) => {
    const response = await api.post('/api/ai/chat', { message });
    return response.data;
  }
};

export default aiService;
