import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { initAnalytics } from './analytics.js';

initAnalytics();
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
