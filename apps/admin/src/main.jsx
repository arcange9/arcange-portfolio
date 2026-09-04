import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './v3.css';
import './v3Enhancements.js';
import './v4Enhancements.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
