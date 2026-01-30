import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLabels } from '../context/LabelContext';
import Chatbot from '../components/Chatbot';
import labelService from '../services/labelService';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { rawLabels, getLabel, refreshLabels } = useLabels();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('chatbot');
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await labelService.getLabelHistory(20);
      if (response.success) {
        setHistory(response.data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>{getLabel('admin', 'admin_dashboard_title', 'Admin Dashboard')}</h1>
          <p className="user-info">Welcome, {user?.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </div>

      <div className="dashboard-content">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${activeTab === 'chatbot' ? 'active' : ''}`}
              onClick={() => setActiveTab('chatbot')}
            >
              <span className="tab-icon">🤖</span>
              <span>Chatbot</span>
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'labels' ? 'active' : ''}`}
              onClick={() => setActiveTab('labels')}
            >
              <span className="tab-icon">🏷️</span>
              <span>All Labels</span>
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <span className="tab-icon">📜</span>
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-main">
          {activeTab === 'chatbot' && (
            <div className="tab-content">
              <Chatbot />
            </div>
          )}

          {activeTab === 'labels' && (
            <div className="tab-content">
              <div className="labels-header">
                <h2>All Labels</h2>
                <button onClick={refreshLabels} className="refresh-button">
                  🔄 Refresh
                </button>
              </div>
              <div className="labels-table-container">
                <table className="labels-table">
                  <thead>
                    <tr>
                      <th>Label Key</th>
                      <th>Current Value</th>
                      <th>Page</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawLabels.map((label) => (
                      <tr key={label.id}>
                        <td className="label-key">{label.label_key}</td>
                        <td className="label-value">{label.label_value}</td>
                        <td>
                          <span className="page-badge">{label.page}</span>
                        </td>
                        <td className="label-description">{label.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-content">
              <div className="history-header">
                <h2>Change History</h2>
                <button onClick={fetchHistory} className="refresh-button">
                  🔄 Refresh
                </button>
              </div>
              {loadingHistory ? (
                <div className="loading-state">Loading history...</div>
              ) : (
                <div className="history-list">
                  {history.length === 0 ? (
                    <div className="empty-state">
                      <p>No changes yet</p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="history-item">
                        <div className="history-icon">
                          {item.change_type === 'chatbot' ? '🤖' : '✏️'}
                        </div>
                        <div className="history-content">
                          <div className="history-main">
                            <strong>{item.label_key}</strong>
                            <div className="history-change">
                              <span className="old-value">"{item.old_value}"</span>
                              <span className="arrow">→</span>
                              <span className="new-value">"{item.new_value}"</span>
                            </div>
                          </div>
                          <div className="history-meta">
                            <span className="change-type-badge">{item.change_type}</span>
                            <span className="timestamp">{formatDate(item.created_at)}</span>
                          </div>
                          {item.chatbot_command && (
                            <div className="chatbot-command">
                              💬 "{item.chatbot_command}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
