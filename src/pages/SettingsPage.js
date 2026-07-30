// src/pages/SettingsPage.js
import React from 'react';

// ✅ Reusable input field component for thresholds
const ThresholdInput = ({ label, value, unit, type = 'number' }) => (
  <div className="threshold-input-group">
    <label>{label}</label>
    <input type={type} defaultValue={value} placeholder={unit} />
  </div>
);

// ✅ Single threshold card component (Flow Rate, Pressure, TDS, Conductivity)
const ThresholdCard = ({ title, unit, config }) => (
  <div className="threshold-card">
    <div className="card-header-row">
      <div className="card-title">
        {title} <span className="unit-label">{unit}</span>
      </div>

      {/* Toggle Switch */}
      <label className="switch">
        <input type="checkbox" defaultChecked />
        <span className="slider round"></span>
      </label>
    </div>

    <div className="threshold-inputs">
      <ThresholdInput label="Min Safe" value={config.minSafe} unit={unit} />
      <ThresholdInput label="Max Safe" value={config.maxSafe} unit={unit} />
      <ThresholdInput label="Warning" value={config.warning} unit={unit} />
      <ThresholdInput label="Critical" value={config.critical} unit={unit} />
    </div>
  </div>
);

// ✅ Main Settings Page Component
const SettingsPage = () => {
  // Configuration Data (includes new Conductivity card)
  const settingsData = [
    {
      title: 'Flow Rate',
      unit: 'L/min',
      config: { minSafe: 0, maxSafe: 0.5, warning: 3, critical: 1 },
    },
    {
      title: 'Pressure',
      unit: 'PSI',
      config: { minSafe: 20, maxSafe: 60, warning: 25, critical: 80 },
    },
    {
      title: 'TDS',
      unit: 'ppm',
      config: { minSafe: 0, maxSafe: 300, warning: 500, critical: 1000 },
    },
    {
      title: 'Conductivity',
      unit: 'µS/cm',
      config: { minSafe: 0, maxSafe: 750, warning: 750, critical: 1500 },
    },
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>System Settings</h1>
          <p>Configure monitoring thresholds and alerts</p>
        </div>
      </header>

      {/* Safety Thresholds Section */}
      <div className="safety-thresholds-section">
        <p className="section-title">
          <span role="img" aria-label="settings-icon">
            ⚙️
          </span>{' '}
          Safety Thresholds
        </p>

        {settingsData.map((data, index) => (
          <ThresholdCard
            key={index}
            title={data.title}
            unit={data.unit}
            config={data.config}
          />
        ))}

        <button className="save-settings-btn">Save Changes</button>
      </div>
    </div>
  );
};

export default SettingsPage;
