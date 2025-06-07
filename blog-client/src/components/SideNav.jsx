import React from 'react';
import { FaHome, FaPenAlt, FaSignOutAlt, FaBlog } from 'react-icons/fa';
import './SideNav.css';

export const SideNav = ({ activePage, setActivePage, onLogout }) => {
  return (
    <nav className="side-nav">
      <div className="nav-header">
        <FaBlog className="nav-logo-icon" />
        <h2 className="nav-logo">BlogApp</h2>
      </div>
      
      <ul className="nav-list">
        <li
          className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          <FaHome className="nav-icon" />
          <span className="nav-text">Home Feed</span>
          {activePage === 'home' && <div className="active-indicator"></div>}
        </li>
        
        <li
          className={`nav-item ${activePage === 'my-posts' ? 'active' : ''}`}
          onClick={() => setActivePage('my-posts')}
        >
          <FaPenAlt className="nav-icon" />
          <span className="nav-text">My Posts</span>
          {activePage === 'my-posts' && <div className="active-indicator"></div>}
        </li>
      </ul>
      
      <div className="nav-footer">
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </nav>
  );
};