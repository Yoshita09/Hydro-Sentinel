import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import ConsumptionPage from './pages/ConsumptionPage';
import QualityMonitorPage from './pages/QualityMonitorPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
// We must import these even if they are placeholders to stop the routing from defaulting.
import './styles/App.css';

/**
 * Main application component responsible for routing and global layout.
 */
const App = () => {
  // State to manage the active page, default is 'Dashboard'
  const [activePage, setActivePage] = useState('Dashboard');

  // Function to determine which component to render
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardContent />; 
      case 'Consumption':
        return <ConsumptionPage />;
      case 'Quality Monitor': // <-- Case name MUST match the sidebar link exactly
        return <QualityMonitorPage />; // <-- Renders the Quality Monitor content
      case 'Alerts': // <-- Routing is set up for Alerts
        return <AlertsPage />;
      case 'Settings': // Directs to the newly built Settings page
        return <SettingsPage />;
      default:
        // Fallback case: if the page state is invalid, show the Dashboard
        return <DashboardContent />; 
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar handles navigation */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} /> 
      <div className="main-content">
        {renderPage()} {/* Render the currently active page */}
      </div>
    </div>
    
  );
};

export default App;
