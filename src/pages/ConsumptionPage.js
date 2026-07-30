import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { database } from '../firebase-config';

const DB_PATH = "SensorData";

const ConsumptionPage = () => {
  const [leakDetected, setLeakDetected] = useState(false);
  const [leakTimestamp, setLeakTimestamp] = useState(null);
  const [liveFlowRate, setLiveFlowRate] = useState(0);

  // 🔹 Firebase Live Flow Detection
  useEffect(() => {
    const sensorRef = ref(database, DB_PATH);
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const flowRate = parseFloat(data.Flow_L_per_min || 0);
      setLiveFlowRate(flowRate);

      // Leak condition (flow between 0.1 and 0.5 L/min)
      if (flowRate >= 0.1 && flowRate <= 0.5) {
        if (!leakDetected) {
          setLeakTimestamp(new Date().toLocaleString());
        }
        setLeakDetected(true);
      } else {
        setLeakDetected(false);
      }
    });

    return () => unsubscribe();
  }, [leakDetected]);

  // 🔹 Top Metric Cards
  const consumptionMetrics = [
    { title: 'TOTAL CONSUMPTION', value: '1385', unit: 'Liters', subText: '1.0% vs last hour', icon: '💧', type: 'total' },
    { title: 'AVERAGE FLOW', value: '21.9', unit: 'L/min', subText: 'Mean flow rate', icon: '🌊', type: 'average' },
    { title: 'ACTIVE SENSORS', value: '3', unit: 'locations', subText: 'Monitoring points', icon: '📊', type: 'active' },
  ];

  // 🔹 Leak Report Data
  const leakReport = {
    location: 'Kitchen',
    flowRate: `${liveFlowRate.toFixed(2)} L/min`,
    pressure: '28.3 PSI',
    timestamp: leakTimestamp || 'No recent leak detected',
  };

  // 🔹 Chart Component
  const ConsumptionChartPlaceholder = () => {
    const [hoverData, setHoverData] = useState(null);
    const width = 800;
    const height = 300;
    const padding = 35;
    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;

    const toX = (x) => padding + (x / 100) * innerWidth;
    const toY = (y) => padding + innerHeight - (y / 32) * innerHeight;

    const curvePoints = [
      { x: 0, y: 25, time: '13:30' },
      { x: 20, y: 23, time: '14:30' },
      { x: 50, y: 8.5, time: '15:30' },
      { x: 80, y: 30, time: '16:30' },
      { x: 100, y: 24, time: '17:30' },
    ];

    const d_line = `M ${toX(0)},${toY(25)} 
      C ${toX(15)},${toY(22)},${toX(30)},${toY(15)},${toX(50)},${toY(8.5)}
      C ${toX(60)},${toY(10)},${toX(70)},${toY(28)},${toX(80)},${toY(30)}
      C ${toX(90)},${toY(28)},${toX(95)},${toY(26)},${toX(100)},${toY(24)}`;

    const d_area = `${d_line} L ${toX(100)},${toY(0)} L ${toX(0)},${toY(0)} Z`;

    const xAxisLabels = [
      { label: '13:30', xPercent: 0 },
      { label: '14:30', xPercent: 20 },
      { label: '15:30', xPercent: 50 },
      { label: '16:30', xPercent: 80 },
      { label: '17:30', xPercent: 100 },
    ];

    const handleMouseMove = (e) => {
      const svgRect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left;
      let closest = null;
      let minDist = Infinity;
      curvePoints.forEach(pt => {
        const xCoord = toX(pt.x);
        const dist = Math.abs(mouseX - xCoord);
        if (dist < minDist) {
          minDist = dist;
          closest = pt;
        }
      });
      if (closest) {
        setHoverData({
          x: toX(closest.x),
          y: toY(closest.y),
          time: closest.time,
          value: closest.y.toFixed(1),
        });
      }
    };

    return (
      <div className="chart-placeholder">
        <p className="chart-title">24-Hour Consumption Pattern</p>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width, height, overflow: "visible" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverData(null)}
        >
          {/* Grid + Y Labels */}
          {[0, 8, 16, 24, 32].map((v) => (
            <g key={v}>
              {v > 0 && v < 32 && (
                <line x1={padding} y1={toY(v)} x2={width - padding} y2={toY(v)} stroke="#ddd" strokeWidth="0.5" strokeDasharray="2 2" />
              )}
              <text x={padding - 8} y={toY(v) + 3} textAnchor="end" fontSize="11" fill="#777">{v}</text>
            </g>
          ))}

          {/* X-Axis */}
          <line x1={padding} y1={toY(0)} x2={width - padding} y2={toY(0)} stroke="#ccc" strokeWidth="1" />

          {/* X-Axis Labels (below chart) */}
          {xAxisLabels.map((item) => (
            <text
              key={item.label}
              x={toX(item.xPercent)}
              y={height - 8}
              textAnchor="middle"
              fontSize="12"
              fill="#555"
            >
              {item.label}
            </text>
          ))}

          {/* Area + Line */}
          <path d={d_area} fill="rgba(0, 123, 255, 0.15)" />
          <path d={d_line} fill="none" stroke="#007bff" strokeWidth="2" />

          {/* Hover Tooltip */}
          {hoverData && (
            <g>
              <line x1={hoverData.x} y1={toY(0)} x2={hoverData.x} y2={toY(32)} stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx={hoverData.x} cy={hoverData.y} r="4" fill="#007bff" stroke="#fff" strokeWidth="2" />
              <rect x={hoverData.x + 10} y={hoverData.y - 25} width="90" height="30" fill="#333" rx="4" ry="4" />
              <text x={hoverData.x + 15} y={hoverData.y - 15} fontSize="10" fill="#fff">{hoverData.time}</text>
              <text x={hoverData.x + 15} y={hoverData.y - 5} fontSize="10" fill="#fff">{hoverData.value} Liters</text>
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="consumption-page">
      <header className="dashboard-header">
        <div>
          <h1>Consumption Analytics</h1>
          <p>Monitor usage patterns and detect anomalies</p>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="metric-row consumption-metrics">
        {consumptionMetrics.map((metric, i) => (
          <div className={`metric-card ${metric.type}`} key={i}>
            <div className="metric-card-header">
              <p className="metric-title">{metric.title}</p>
              <div className="icon-box">{metric.icon}</div>
            </div>
            <p className="metric-value">
              {metric.value} <span className="metric-unit">{metric.unit}</span>
            </p>
            <p className="metric-subtext">{metric.subText}</p>
          </div>
        ))}
      </div>

      {/* Chart + Leak Report */}
      <div className="chart-report-row">
        <div className="consumption-chart-box">
          <ConsumptionChartPlaceholder />
        </div>

        <div className={`leak-detection-report ${leakDetected ? 'blink-alert' : ''}`}>
          <p className="report-header">
            <span className="title-icon">⚠️</span> Leak Detection Report
          </p>
          <div className="report-card">
            <span className="location-icon">📍</span>
            <p className="report-location">{leakReport.location}</p>
            <p className="report-detail">Flow Rate: <strong>{leakReport.flowRate}</strong></p>
            <p className="report-detail">Pressure: <strong>{leakReport.pressure}</strong></p>

            {/* ✅ Timestamp shown dynamically when leak is detected */}
            <p className="report-date">
              {leakDetected ? `Detected at: ${leakReport.timestamp}` : 'No leaks detected'}
            </p>
            <button className="close-btn">×</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionPage;
