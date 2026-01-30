import React, { createContext, useState, useEffect, useContext } from 'react';
import labelService from '../services/labelService';
import socketService from '../services/socketService';

const LabelContext = createContext();

export const useLabels = () => {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error('useLabels must be used within a LabelProvider');
  }
  return context;
};

export const LabelProvider = ({ children }) => {
  const [labels, setLabels] = useState({});
  const [rawLabels, setRawLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch labels on mount
  useEffect(() => {
    fetchLabels();
    setupSocketListeners();

    return () => {
      socketService.off('label-updated');
    };
  }, []);

  // Fetch labels from API
  const fetchLabels = async () => {
    try {
      setLoading(true);
      const response = await labelService.getAllLabels();
      if (response.success) {
        setLabels(response.data.labels);
        setRawLabels(response.data.rawLabels);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching labels:', err);
      setError('Failed to load labels');
    } finally {
      setLoading(false);
    }
  };

  // Setup Socket.io listeners for real-time updates
  const setupSocketListeners = () => {
    socketService.connect();
    
    socketService.on('label-updated', (updatedLabel) => {
      console.log('📡 Label updated via socket:', updatedLabel);
      // Refresh labels when update is received
      fetchLabels();
    });
  };

  // Get label value by key and page
  const getLabel = (page, key, defaultValue = '') => {
    return labels[page]?.[key] || defaultValue;
  };

  // Refresh labels manually
  const refreshLabels = () => {
    fetchLabels();
  };

  const value = {
    labels,
    rawLabels,
    loading,
    error,
    getLabel,
    refreshLabels
  };

  return (
    <LabelContext.Provider value={value}>
      {children}
    </LabelContext.Provider>
  );
};
