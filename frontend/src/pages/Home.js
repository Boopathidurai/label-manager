import React from 'react';
import { useLabels } from '../context/LabelContext';
import '../styles/Home.css';

const Home = () => {
  const { getLabel, loading } = useLabels();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {getLabel('home', 'home_title', 'Welcome to Our Platform')}
          </h1>
          <p className="hero-subtitle">
            {getLabel('home', 'home_subtitle', 'Transforming Ideas into Reality')}
          </p>
          <button className="cta-button">
            {getLabel('home', 'home_cta_button', 'Get Started')} →
          </button>
        </div>
        <div className="hero-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">
              {getLabel('home', 'home_feature1_title', 'Innovation')}
            </h3>
            <p className="feature-description">
              Cutting-edge solutions that push boundaries and create new possibilities for your business growth.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">
              {getLabel('home', 'home_feature2_title', 'Reliability')}
            </h3>
            <p className="feature-description">
              Dependable systems built with robust architecture to ensure consistent performance and uptime.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">
              {getLabel('home', 'home_feature3_title', 'Excellence')}
            </h3>
            <p className="feature-description">
              Commitment to delivering the highest quality in every aspect of our products and services.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">150+</div>
            <div className="stat-label">Countries</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
