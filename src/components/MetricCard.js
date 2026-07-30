// src/components/MetricCard.js
import React from 'react';

/**
 * Renders a key metric with its value, unit, and an icon.
 * @param {string} title - The title of the metric (e.g., 'FLOW RATE').
 * @param {string} value - The main numerical value.
 * @param {string} unit - The unit of measurement (e.g., 'L/min', 'PSI').
 * @param {string} type - A class name for specific styling (e.g., 'flow-rate').
 * @param {string} icon - An emoji or icon representing the metric.
 * @param {string} [subText] - Optional text for trends or additional info.
 * @param {boolean} [isAlert] - Special flag for the Leak Detection card.
 */
const MetricCard = ({ title, value, unit, type, icon, subText, isAlert = false }) => {
  return (
    <div className={`metric-card ${type}`}>
      <div className="metric-card-header">
        <p>{title}</p>
        <div className="icon-box">
          {icon}
        </div>
      </div>
      {!isAlert ? (
        <>
          <span className="metric-value">{value}</span>
          <span className="metric-unit">{unit}</span>
          {subText && <p className="metric-subtext">{subText}</p>}
        </>
      ) : (
        <>
          <span className="metric-value">{value}</span>
          <span className="metric-unit">{unit}</span>
          <p style={{color: '#dc3545', fontWeight: 'bold'}}>Active warnings</p>
        </>
      )}
    </div>
  );
};

export default MetricCard;