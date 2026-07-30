// src/pages/QualityMonitorPage.js
import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase-config";

const QualityMonitorPage = () => {
  const [tdsValue, setTdsValue] = useState(0);
  const [conductivity, setConductivity] = useState(0);
  const [overallStatus, setOverallStatus] = useState("LOADING");

  // 🔹 Fetch live data from Firebase
  useEffect(() => {
    const sensorRef = ref(database, "SensorData");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      console.log("🔥 QualityMonitor Firebase Data:", data);

      if (data) {
        const tds = parseFloat(data.TDS_ppm || 0);
        setTdsValue(tds);

        // Conductivity = TDS / 0.64 (approx µS/cm)
        const ecValue = tds / 0.64;
        setConductivity(ecValue);

        // Update water quality status
        if (tds <= 500) setOverallStatus("SAFE");
        else if (tds <= 1000) setOverallStatus("WARNING");
        else setOverallStatus("DANGER");
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Mapping Conductivity to Probability & Risk ---
  const getMetalProbability = (ec) => {
    if (ec < 750) return "< 5%";
    if (ec < 1500) return "10–20%";
    if (ec < 3000) return "40–60%";
    return "> 80%";
  };

  const getContaminationRisk = (tds) => {
    if (tds < 500) return "Very Low";
    if (tds < 1000) return "Moderate";
    if (tds < 2000) return "High";
    return "Very High";
  };

  return (
    <div className="quality-monitor-page">
      <header className="dashboard-header">
        <div>
          <h1>Water Quality Monitor</h1>
          <p>Real-time quality parameters and contamination detection</p>
        </div>
      </header>

      {/* --- 1. Top Status Cards --- */}
      <div className="metric-row quality-top-cards">
        {/* Overall Status Card */}
        <div className={`quality-status-card ${overallStatus.toLowerCase()}`}>
          <div className="card-header">
            <p className="metric-title">WATER QUALITY</p>
            <span className="status-icon" role="img" aria-label="status-icon">
              {overallStatus === "SAFE"
                ? "✅"
                : overallStatus === "WARNING"
                ? "⚠️"
                : overallStatus === "DANGER"
                ? "🚨"
                : "⏳"}
            </span>
          </div>
          <p className="status-subtext">Overall status</p>
          <p className={`status-value ${overallStatus.toLowerCase()}`}>{overallStatus}</p>
        </div>

        {/* Conductivity Level Card */}
        <div className="tds-level-card">
          <div className="card-header">
            <p className="metric-title">CONDUCTIVITY</p>
            <span className="level-icon" role="img" aria-label="conductivity-icon">
              ⚡
            </span>
          </div>
          <p className="tds-subtext">Electrical Conductivity</p>
          <p className="tds-value">
            {conductivity.toFixed(2)} <span className="tds-unit">µS/cm</span>
          </p>
        </div>
      </div>

      {/* --- 2. TDS Monitor Section --- */}
      <div className="tds-monitor-section">
        <p className="section-title">
          <span role="img" aria-label="monitor-icon">🔬</span> TDS Monitor (Total Dissolved Solids)
        </p>
        <p className="tds-monitor-value">
          <span className="main-value">{tdsValue.toFixed(2)}</span>{" "}
          <span className="unit">ppm</span>
        </p>
        <p className="tds-range-status">
          {tdsValue <= 500 ? (
            <>
              <span role="img" aria-label="check-mark">✅</span> Within Safe Range
            </>
          ) : tdsValue <= 1000 ? (
            <>
              <span role="img" aria-label="warning">⚠️</span> Moderate — Check Water Filter
            </>
          ) : (
            <>
              <span role="img" aria-label="danger">🚨</span> Unsafe Water Quality!
            </>
          )}
        </p>
      </div>

      {/* --- 3. Conductivity & Metal Probability Table --- */}
      <div className="conductivity-table-section">
        <p className="section-title">
          <span role="img" aria-label="table-icon">📊</span> Conductivity & Metal Contamination Risk
        </p>

        <table className="conductivity-table">
          <thead>
            <tr>
              <th>TDS (ppm)</th>
              <th>Conductivity (µS/cm)</th>
              <th>Probability of Heavy Metals</th>
              <th>Metal Contamination Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{tdsValue.toFixed(2)}</td>
              <td>{conductivity.toFixed(2)}</td>
              <td>{getMetalProbability(conductivity)}</td>
              <td>{getContaminationRisk(tdsValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QualityMonitorPage;
