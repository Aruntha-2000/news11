import React from "react";
import { Link } from "react-router-dom";

export default function FloatingSidebar() {
  return (
    <nav className="floating-sidebar" id="floatingSidebar">
      
      <Link to="/news" className="nav-item">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
        </svg>
        <span>News</span>
      </Link>

      <Link to="/create-news" className="nav-item">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.995.995 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
        <span>Create News</span>
      </Link>

      <Link to="/profile" className="nav-item">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span>Profile</span>
      </Link>

      <Link to="/feedback" className="nav-item">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <span>Feedback</span>
      </Link>

      <Link to="/login" className="nav-item apply-btn">
        <span className="apply-tag">🔐 Login</span>
        </Link>
        <Link to="/register" className="nav-item apply-btn">
        <span className="apply-badge" style={{ backgroundColor: '#2e303a' }}>REGISTER</span>
      </Link>
      
    </nav>
  );
}