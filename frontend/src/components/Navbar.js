import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLabels } from '../context/LabelContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { getLabel, loading } = useLabels();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">Label Manager</div>
          <div className="nav-loading">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏷️</span>
          Label Manager
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              {getLabel('navbar', 'nav_home', 'Home')}
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              {getLabel('navbar', 'nav_about', 'About')}
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/login" 
              className={`nav-link admin-link ${isActive('/admin/login') || isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              🔐 Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
