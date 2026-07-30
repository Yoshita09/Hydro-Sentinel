// src/components/AlertCard.js

import React from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Siren,
  X
} from "lucide-react";

const AlertCard = ({
  type,
  title,
  message,
  location,
  onClose,
}) => {
  let icon = <AlertTriangle size={22} color="#F59E0B" />;

  if (title.includes("HEAVY METAL")) {
    icon = <ShieldAlert size={22} color="#F59E0B" />;
  } else if (title.includes("TDS")) {
    icon = <AlertTriangle size={22} color="#EF4444" />;
  } else if (title.includes("LEAK")) {
    icon = <Siren size={22} color="#DC2626" />;
  }

  return (
    <div className={`alert-card ${type}`}>
      <div className="content">

        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          {icon}
          <span>{title}</span>
        </h3>

        <p
          style={{
            marginBottom: "12px",
            color: "#6B7280",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "#9CA3AF",
          }}
        >
          {location}
        </p>

      </div>

      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#9CA3AF",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default AlertCard;