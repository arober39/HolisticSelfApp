import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { initializeLaunchDarkly } from './services/launchdarkly';

// Get LaunchDarkly client-side ID from environment variable
const LAUNCHDARKLY_CLIENT_ID = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID || '';

// Initialize LaunchDarkly before React renders
// This ensures session replay starts as early as possible
if (LAUNCHDARKLY_CLIENT_ID) {
  initializeLaunchDarkly(
    LAUNCHDARKLY_CLIENT_ID,
    null, // User context (null = anonymous user)
    {
      manualStart: false,
      privacySetting: 'default',
      startSessionReplay: true,
    }
  ).catch((error) => {
    console.error('Failed to initialize LaunchDarkly:', error);
  });
} else {
  console.warn('LaunchDarkly client-side ID not configured. Set VITE_LAUNCHDARKLY_CLIENT_ID environment variable.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

