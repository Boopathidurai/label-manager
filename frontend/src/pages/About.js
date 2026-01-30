import React from 'react';
import { useLabels } from '../context/LabelContext';
import '../styles/About.css';

const About = () => {
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
    <div className="about-page">
      {/* Header */}
      <section className="about-header">
        <h1 className="about-title">
          {getLabel('about', 'about_title', 'About Us')}
        </h1>
        <div className="title-underline"></div>
      </section>

      {/* Content Sections */}
      <div className="about-content">
        <section className="about-section">
          <div className="section-icon">🎯</div>
          <h2 className="section-title">
            {getLabel('about', 'about_section1_title', 'Our Mission')}
          </h2>
          <p className="section-text">
            We are dedicated to empowering businesses with innovative technology solutions 
            that drive growth and transformation. Our mission is to make advanced tools 
            accessible to organizations of all sizes, enabling them to compete effectively 
            in the digital age.
          </p>
          <p className="section-text">
            Through continuous innovation and customer-centric approach, we strive to 
            deliver exceptional value that exceeds expectations and creates lasting impact.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">🔭</div>
          <h2 className="section-title">
            {getLabel('about', 'about_section2_title', 'Our Vision')}
          </h2>
          <p className="section-text">
            We envision a world where technology seamlessly integrates with business 
            operations, creating efficiency, innovation, and growth opportunities. Our 
            vision is to be the leading provider of intuitive, powerful solutions that 
            transform how organizations operate.
          </p>
          <p className="section-text">
            By 2030, we aim to serve over one million businesses worldwide, helping them 
            achieve their goals through our cutting-edge platform and unwavering support.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">💎</div>
          <h2 className="section-title">
            {getLabel('about', 'about_section3_title', 'Our Values')}
          </h2>
          <div className="values-grid">
            <div className="value-item">
              <h4>Integrity</h4>
              <p>We operate with honesty and transparency in everything we do.</p>
            </div>
            <div className="value-item">
              <h4>Innovation</h4>
              <p>We constantly push boundaries to create better solutions.</p>
            </div>
            <div className="value-item">
              <h4>Customer Focus</h4>
              <p>Our customers' success is at the heart of our decisions.</p>
            </div>
            <div className="value-item">
              <h4>Collaboration</h4>
              <p>We believe in the power of teamwork and partnership.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Team Section */}
      <section className="team-section">
        <h2 className="section-title">Our Team</h2>
        <p className="team-description">
          We're a diverse group of passionate individuals committed to excellence
        </p>
        <div className="team-stats">
          <div className="team-stat">
            <div className="stat-icon">👥</div>
            <div className="stat-value">200+</div>
            <div className="stat-label">Team Members</div>
          </div>
          <div className="team-stat">
            <div className="stat-icon">🌍</div>
            <div className="stat-value">15</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="team-stat">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">50+</div>
            <div className="stat-label">Awards</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
