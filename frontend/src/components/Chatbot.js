import React, { useState, useRef, useEffect } from 'react';
import chatbotService from '../services/chatbotService';
import { useLabels } from '../context/LabelContext';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I can help you manage labels. Try commands like:\n• "Change About to Contact Us"\n• "List all labels"\n• "Help"',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { refreshLabels } = useLabels();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatbotService.processCommand(inputValue);
      
      const botMessage = {
        type: 'bot',
        content: response.data.response,
        messageType: response.data.type,
        timestamp: new Date(),
        data: response.data
      };

      setMessages(prev => [...prev, botMessage]);

      // Refresh labels if it was a successful change
      if (response.data.type === 'success') {
        setTimeout(() => {
          refreshLabels();
        }, 500);
      }

    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: '❌ Sorry, something went wrong. Please try again.',
        messageType: 'error',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageClassName = (msg) => {
    const baseClass = `message ${msg.type}-message`;
    if (msg.messageType) {
      return `${baseClass} ${msg.messageType}-type`;
    }
    return baseClass;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-icon">🤖</div>
        <div className="header-text">
          <h3>Label Management Assistant</h3>
          <p className="status-indicator">
            <span className="status-dot"></span> Online
          </p>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={getMessageClassName(msg)}>
            <div className="message-content">
              <pre className="message-text">{msg.content}</pre>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a command (e.g., Change About to Contact Us)"
          className="chatbot-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="chatbot-send-button"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
