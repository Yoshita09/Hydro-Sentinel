// src/components/SystemMonitorCard.js

import React from "react";
import {
  Activity,
  Gauge,
  MapPin,
  Radio,
  Circle
} from "lucide-react";

const SystemMonitorCard = ({ monitorData }) => {

  const {
    flow,
    pressure,
    location,
    status,
    timestamp
  } = monitorData;

  const statusClass = status.toLowerCase();

  return (
    <div className="system-monitor-card-container">

      {/* Header */}

      <div
        className="monitor-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Radio size={18} color="#2563eb" />
          <span>Live System Monitor</span>
        </div>

        <span
          className={`monitor-status ${statusClass}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Circle
            size={10}
            fill={status === "NORMAL" ? "#22c55e" : "#ef4444"}
            color={status === "NORMAL" ? "#22c55e" : "#ef4444"}
          />
          {status}
        </span>

      </div>

      {/* Metrics */}

      <div className="monitor-metrics-row">

        {/* Flow */}

        <div className="monitor-metric">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px"
            }}
          >
            <Activity size={18} color="#2563eb" />
            <p className="metric-title">FLOW RATE</p>
          </div>

          <p className="metric-value">
            {flow.value}
            <span className="metric-unit">
              {" "}
              {flow.unit}
            </span>
          </p>

          <p className="metric-subtext">
            Current flow
          </p>

          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginTop: "10px"
            }}
          >
            Last Updated: {timestamp}
          </p>

        </div>

        {/* Pressure */}

        <div className="monitor-metric">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px"
            }}
          >
            <Gauge size={18} color="#2563eb" />
            <p className="metric-title">PRESSURE</p>
          </div>

          <p className="metric-value">
            {pressure.value}
            <span className="metric-unit">
              {" "}
              {pressure.unit}
            </span>
          </p>

          <p className="metric-subtext">
            System pressure
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="monitor-footer">

        <div className="monitor-location">

          <p className="footer-label">
            LOCATION
          </p>

          <p
            className="footer-value"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <MapPin size={14} />
            {location}
          </p>

        </div>

        <div className="monitor-status-detail">

          <p className="footer-label">
            STATUS
          </p>

          <p
            className={`footer-value status-${statusClass}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Circle
              size={10}
              fill={status === "NORMAL" ? "#22c55e" : "#ef4444"}
              color={status === "NORMAL" ? "#22c55e" : "#ef4444"}
            />
            {status}
          </p>

        </div>

      </div>

    </div>
  );
};

export default SystemMonitorCard;