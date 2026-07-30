// src/pages/AlertsPage.js
import React from 'react';

/**
 * Renders an individual alert card item.
 */
const AlertCardItem = ({ type, title, message, location, timestamp, value, isResolved, resolvedTime }) => {
    // Determine the styling based on alert type/status
    const alertClass = type.toLowerCase();
    const icon = {
        'heavy metal detected': '🧪',
        'tds anomaly': '⚠️',
        'leak detected': '🚨'
    }[title.toLowerCase()] || '🔔';

    return (
        <div className={`alert-management-card ${alertClass} ${isResolved ? 'resolved-card' : ''}`}>
            <div className="alert-header-row">
                <div className="alert-type-badge">
                    <span className="alert-icon">{icon}</span>
                    <span className="alert-title-text">{title}</span>
                </div>
                <div className={`alert-priority ${alertClass}`}>{type.toUpperCase()}</div>
                {!isResolved && (
                    <button className="resolve-btn">Resolve</button>
                )}
            </div>

            <p className="alert-message">{message}</p>

            <div className="alert-details">
                <p className="detail-item">
                    <span role="img" aria-label="location">📍</span> {location}
                </p>
                <p className="detail-item">
                    <span role="img" aria-label="time">🕓</span> {timestamp}
                </p>
                <p className="detail-item">
                    <span role="img" aria-label="value">📊</span> Value: {value}
                </p>
            </div>
            
            {isResolved && (
                <p className="resolved-status">
                    <span role="img" aria-label="resolved-check">✅</span> Resolved on {resolvedTime}
                </p>
            )}
        </div>
    );
};


/**
 * Renders the main Alerts Management page content.
 */
const AlertsPage = () => {
    // --- Sample Alerts Data based on provided images ---
    const alertsData = [
        { type: 'High', title: 'HEAVY METAL DETECTED', message: 'Lead concentration approaching EPA limit - immediate investigation recommended', location: 'bathroom', timestamp: 'Jan 10, 2025 18:10', value: '12.5', isResolved: true, resolvedTime: 'Oct 26, 2025 13:40' },
        { type: 'High', title: 'HEAVY METAL DETECTED', message: 'Lead concentration approaching EPA limit - immediate investigation recommended', location: 'bathroom', timestamp: 'Jan 10, 2025 18:10', value: '12.5', isResolved: false },
        { type: 'High', title: 'TDS ANOMALY', message: 'TDS level exceeded safe threshold - water quality degradation detected', location: 'bathroom', timestamp: 'Jan 10, 2025 18:00', value: '1150', isResolved: false },
        { type: 'Critical', title: 'LEAK DETECTED', message: 'Sudden pressure drop detected in kitchen sensor - potential pipe leak', location: 'kitchen', timestamp: 'Jan 10, 2025 15:15', value: '28.3', isResolved: false },
        { type: 'Critical', title: 'LEAK DETECTED', message: 'Sudden pressure drop detected in kitchen sensor - potential pipe leak', location: 'kitchen', timestamp: 'Jan 10, 2025 15:45', value: '28.3', isResolved: true, resolvedTime: 'Oct 28, 2025 15:39' }
    ];

    const totalAlerts = alertsData.length;

    return (
        <div className="alerts-page">
            
            {/* Header and Filter Bar */}
            <div className="alerts-header-row">
                <header className="dashboard-header">
                    <h1>Alert Management</h1>
                    <p>Monitor and respond to system alerts</p>
                </header>
                <div className="alert-filters">
                    <button className="filter-btn active">All Alerts</button>
                    <button className="filter-btn">Active</button>
                    <button className="filter-btn">Resolved</button>
                </div>
            </div>

            {/* Alert History Section */}
            <div className="alert-history-section">
                <div className="alert-history-title">
                    <p>Alert History</p>
                    <span className="alert-count">{totalAlerts} alerts</span>
                </div>

                {/* List of Alert Cards */}
                <div className="alert-list">
                    {alertsData.map((alert, index) => (
                        <AlertCardItem key={index} {...alert} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;