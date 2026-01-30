import api from './api';

const labelService = {
  /**
   * Get all labels
   */
  getAllLabels: async () => {
    const response = await api.get('/labels');
    return response.data;
  },

  /**
   * Update label
   */
  updateLabel: async (key, value, changeType = 'manual', chatbotCommand = null) => {
    const response = await api.put(`/labels/${key}`, {
      value,
      changeType,
      chatbotCommand
    });
    return response.data;
  },

  /**
   * Get label history
   */
  getLabelHistory: async (limit = 50, labelKey = null) => {
    const params = { limit };
    if (labelKey) params.labelKey = labelKey;
    
    const response = await api.get('/labels/history', { params });
    return response.data;
  },

  /**
   * Search labels
   */
  searchLabels: async (query) => {
    const response = await api.get('/labels/search', {
      params: { query }
    });
    return response.data;
  }
};

export default labelService;
