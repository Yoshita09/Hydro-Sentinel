import React, { useState } from 'react';


import Header from './Header';
import AlertCard from './AlertCard';
import MetricCard from './MetricCard';
import SystemMonitorCard from './SystemMonitorCard';

import {
  Droplets,
  Gauge,
  Activity,
  TriangleAlert,
  Waves, 
   Usb, CheckCircle2
} from "lucide-react";

const DashboardContent = () => {
  const [, setPort] = useState(null);
  const [connected, setConnected] = useState(false);
  // --- Live sensor data ---
  const [liveMetrics, setLiveMetrics] = useState({
    flow_rate_lpm: 0.0,
    tds_ppm: 0,
    total_liters: 0.0,  
    timestamp: 'N/A'
  });

  // --- Leak detection state ---
  const [isLeakDetected, setIsLeakDetected] = useState(false);
  const [leakTimestamp, setLeakTimestamp] = useState(null);
  const [tdsTimestamp, setTdsTimestamp] = useState(null);

  // --- Fetch data from Firebase ---
  const connectESP32 = async () => {
  try {
    const selectedPort = await navigator.serial.requestPort();

    await selectedPort.open({
      baudRate: 115200,
    });

    setPort(selectedPort);
    setConnected(true);

    const decoder = new TextDecoderStream();
    selectedPort.readable.pipeTo(decoder.writable);

    const reader = decoder.readable.getReader();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      if (!value) continue;

      buffer += value;

      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete JSON

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) continue;

        try {
          const data = JSON.parse(trimmed);

          const now = new Date().toLocaleString();

          const flowRate = Number(data.flow ?? 0);
          const tdsValue = Number(data.tds ?? 0);
          const volume = Number(data.total ?? 0);

          setLiveMetrics({
            flow_rate_lpm: flowRate.toFixed(2),
            tds_ppm: Math.round(tdsValue),
            total_liters: volume.toFixed(2),
            timestamp: now,
          });

          // Leak Detection
          if (flowRate >= 0.1 && flowRate <= 0.5) {
            setIsLeakDetected(true);
            setLeakTimestamp(now);
          } else {
            setIsLeakDetected(false);
          }

          // TDS Alert
          if (tdsValue > 100) {
            setTdsTimestamp(now);
          } else {
            setTdsTimestamp(null);
          }

        } catch (err) {
          console.log("Invalid JSON:", trimmed);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

  // --- TDS logic (only for water quality) ---
  const tdsValue = liveMetrics.tds_ppm;
  const isTdsSafe = tdsValue < 100 && tdsValue > 0;
  const tdsStatus = isTdsSafe ? 'NORMAL' : 'WARNING';
  const shouldBlinkTds = tdsValue > 100;

  // --- Flow logic (for leak detection / system monitor) ---
  const flowRate = liveMetrics.flow_rate_lpm;
  const isFlowSafe = flowRate > 0.5 || flowRate === 0;
  const flowStatus = isFlowSafe ? 'NORMAL' : 'WARNING'; // ✅ only system monitor uses this

  // --- Data for child components ---
  const systemMonitorData = {
  flow: { value: flowRate, unit: 'L/min' },
  pressure: { value: '45.8', unit: 'PSI' },
  location: 'bathroom',
  status: flowStatus,
  timestamp: liveMetrics.timestamp
};

  const waterQualityData = {
    status: tdsStatus, // ✅ only depends on TDS
    metric: 'TDS (Total Dissolved Solids)',
    value: `${tdsValue} ppm`
  };

  const topMetricsData = [
  {
    title: "FLOW RATE",
    value: flowRate,
    unit: "L/min",
    type: "flow-rate",
    icon: <Droplets size={22} strokeWidth={2} />,
    subText: "Current flow"
  },
  {
    title: "PRESSURE",
    value: "45.8",
    unit: "PSI",
    type: "pressure",
    icon: <Gauge size={22} strokeWidth={2} />,
    subText: "System pressure"
  },
  {
    title: "TOTAL USAGE",
    value: liveMetrics.total_liters,
    unit: "mL",
    type: "total-usage",
    icon: <Activity size={22} strokeWidth={2} />,
    subText: "Total volume"
  },
  {
    title: "LEAK DETECTION",
    value: isLeakDetected ? "1" : "0",
    unit: "alerts",
    type: "leak-detection",
    icon: <TriangleAlert size={22} strokeWidth={2} />,
    isAlert: isLeakDetected
  }

];

  // --- ALERTS SECTION ---
  const [alertsData, setAlertsData] = useState([

    {
      id: 2,
      type: 'warning',
      title: 'TDS ANOMALY',
      message: 'TDS level exceeded safe threshold - water quality degradation detected',
      timestamp: tdsTimestamp
    },
    {
      id: 3,
      type: 'danger',
      title: 'LEAK DETECTED',
      message: 'Flow rate between 0.1 – 0.5 L/min detected — possible leak',
      timestamp: leakTimestamp
    }
  ]);
  const removeAlert = (id) => {
  setAlertsData((prev) => prev.filter((alert) => alert.id !== id));
};

  return (
    <>
      <Header />
      <button
  onClick={connectESP32}
  disabled={connected}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 18px",
    margin: "20px",
    border: "none",
    borderRadius: "10px",
    background: connected ? "#DCFCE7" : "#2563EB",
    color: connected ? "#15803D" : "#FFFFFF",
    fontSize: "15px",
    fontWeight: "600",
    cursor: connected ? "default" : "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    transition: "all 0.25s ease"
  }}
  onMouseEnter={(e) => {
    if (!connected) {
      e.currentTarget.style.background = "#1D4ED8";
    }
  }}
  onMouseLeave={(e) => {
    if (!connected) {
      e.currentTarget.style.background = "#2563EB";
    }
  }}
>
  {connected ? (
    <>
      <CheckCircle2 size={18} />
      ESP32 Connected
    </>
  ) : (
    <>
      <Usb size={18} />
      Connect ESP32
    </>
  )}
</button>

      {/* --- Alerts Section --- */}
      <section className="alerts">
        {alertsData.map((alert, index) => {
          const isTdsAlert = alert.title === "TDS ANOMALY";
          const isLeakAlert = alert.title === "LEAK DETECTED";
          const shouldBlink = (isTdsAlert && shouldBlinkTds) || (isLeakAlert && isLeakDetected);

          const showTime = (isTdsAlert && tdsTimestamp) || (isLeakAlert && leakTimestamp);

          return (
            <div key={index} className={shouldBlink ? "blink-alert" : ""}>
              <AlertCard
  type={alert.type}
  title={alert.title}
  message={alert.message}
  location={
    showTime
      ? `Bathroom • ${showTime}`
      : "Bathroom • No recent alert"
  }
  onClose={() => removeAlert(alert.id)}
/>
            </div>
          );
        })}
      </section>

      {/* --- System Monitor & Water Quality --- */}
      <section className="live-monitor-row">
        <SystemMonitorCard monitorData={systemMonitorData} />
        <div className={`water-quality-card ${shouldBlinkTds ? "blink-alert" : ""}`}>
          <p
  className="quality-title"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }}
>
  <Waves size={18} />
  Water Quality
</p>
          <div className={`quality-status-box ${waterQualityData.status.toLowerCase()}`}>
            {waterQualityData.status}
          </div>
          <p className="quality-metric">{waterQualityData.metric}</p>
          <p className="quality-value">{waterQualityData.value}</p>
          <p style={{ fontSize: '0.7em', marginTop: '10px' }}>Last Updated: {liveMetrics.timestamp}</p>
        </div>
      </section>

      {/* --- Top Metrics --- */}
      <div className="metric-row top-metrics">
        {topMetricsData.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            type={metric.type}
            icon={metric.icon}
            subText={metric.subText}
            isAlert={metric.isAlert}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardContent;
