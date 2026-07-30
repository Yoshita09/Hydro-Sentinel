// src/components/SensorData.js

import React, { useState, useEffect } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from "firebase/database";
import { database } from '../firebase-config'; // Adjust path if needed

// This MUST match the path from the ESP32 code
const DB_PATH = "sensor_readings/water-management-app"; 

function SensorData() {
  const [latestData, setLatestData] = useState({
    flow_rate_lpm: 'Loading...',
    tds_ppm: 'Loading...',
    total_liters: 'Loading...',
    timestamp: 'Loading...'
  });

  useEffect(() => {
    // Query to get the last (most recent) data point
    const latestReadingQuery = query(
      ref(database, DB_PATH),
      orderByChild('timestamp'), 
      limitToLast(1)            
    );

    // Set up the real-time listener
    const unsubscribe = onValue(latestReadingQuery, (snapshot) => {
      if (snapshot.exists()) {
        // Snapshot contains the unique key and the data object
        const data = snapshot.val();
        const latestKey = Object.keys(data)[0];
        const latestValues = data[latestKey];

        setLatestData({
          ...latestValues,
          // Convert the Firebase timestamp (milliseconds) to a readable format
          timestamp: new Date(latestValues.timestamp).toLocaleString()
        });

      } else {
        console.log("No data available.");
      }
    });

    // Cleanup function to stop listening when the component unmounts
    return () => unsubscribe();
  }, []); 

  return (
    <div>
      <h2>Current Water Metrics</h2>
      <p>Flow Rate: **{latestData.flow_rate_lpm} L/min**</p>
      <p>TDS: **{latestData.tds_ppm} PPM**</p>
      <p>Total Volume: **{latestData.total_liters} Liters**</p>
      <p>Last Update: *{latestData.timestamp}*</p>
    </div>
  );
}

export default SensorData;