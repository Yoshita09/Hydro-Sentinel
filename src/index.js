// src/index.js
import React from 'react';
// Import the createRoot method for modern React (React 18+)
import { createRoot } from 'react-dom/client'; 

// Import your main dashboard component and styling
import App from './App'; 
import './styles/App.css'; 

// 1. Get the container element using the ID defined in index.html
const container = document.getElementById('root');

// 2. Create the root object using the container
const root = createRoot(container);

// 3. Render the App component into the root
root.render(
  // React.StrictMode enables extra checks and warnings for development
  <React.StrictMode>
    <App />
  </React.StrictMode>
);