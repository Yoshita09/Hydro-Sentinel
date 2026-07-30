// src/components/Header.js
import React from 'react';

/**
 * Renders the main title and system status of the dashboard.
 */
const Header = () => {
  return (
    <div className="dashboard-header">
      <div>
        <h1>Water Intelligence Dashboard</h1>
        <p>Real-time monitoring and analytics</p>
      </div>
      <div className="system-status">
        System Active
      </div>
    </div>
  );
};

export default Header;