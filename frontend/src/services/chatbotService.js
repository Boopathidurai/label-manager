import api from './api';

const chatbotService = {
  /**
   * Process chatbot command
   */
  processCommand: async (command) => {
    const response = await api.post('/chatbot/process', { command });
    return response.data;
  }
};

export default chatbotService;
