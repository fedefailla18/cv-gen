import { jsx as _jsx } from "react/jsx-runtime";
import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ResumeProvider } from './context/ResumeContext';
createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(ResumeProvider, { children: _jsx(App, {}) }) }));
