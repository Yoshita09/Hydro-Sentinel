// src/components/Sidebar.js

import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Droplets,
  Bell,
  Settings,
  ShieldCheck
} from "lucide-react";

const Sidebar = ({ activePage, onNavigate }) => {
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Consumption",
      icon: BarChart3,
    },
    {
      name: "Quality Monitor",
      icon: Droplets,
    },
    {
      name: "Alerts",
      icon: Bell,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Droplets size={26} strokeWidth={2.2} />
          </div>

          <div>
            <h3>HydroSentinel</h3>
            <p className="logo-subtitle">
              IoT Water Intelligence
            </p>
          </div>
        </div>

        <nav>
          <h4 className="nav-heading">NAVIGATION</h4>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.name}
                className={`nav-item ${
                  item.name === activePage ? "active" : ""
                }`}
                onClick={() => onNavigate(item.name)}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="user-profile">
        <div className="user-avatar">
          <ShieldCheck size={22} />
        </div>

        <div className="user-details">
          <p>Water Manager</p>
          <p>System Administrator</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;