// src/components/apiConfig.js

/**
 * 🚀 RYTHU MITRA - CLOUD DEPLOYMENT CONFIGURATION
 * This automatically routes traffic to the live database when deployed,
 * but keeps local testing fast and easy on your laptop.
 */
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  // 1. If running locally on your laptop (npm start)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // 2. If running on the internet (Vercel Cloud Deployment)
  return 'https://rythu-mitra-ak36.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();