import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

import App from './App';
import store from './store';
import theme from './theme';
import './index.css';

const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Configure axios base URL and credentials
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
axios.defaults.withCredentials = true;

// Add token to all requests from localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add token to all requests from localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          ) : (
            <App />
          )}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// Scroll-reveal animations
try {
  let io;
  const ensureObserver = () => {
    if (!('IntersectionObserver' in window)) return null;
    if (!io) {
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in');
            io.unobserve(e.target);
          }
        }
      }, { threshold: 0.12 });
    }
    return io;
  };

  const observeAll = (root = document) => {
    const obs = ensureObserver();
    if (!obs) return;
    const els = root.querySelectorAll('[data-reveal]:not(.reveal-in)[data-reveal]');
    els.forEach((el) => obs.observe(el));
  };

  const init = () => {
    observeAll(document);
    // Observe DOM changes to catch SPA route updates
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes && m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('[data-reveal]') && !node.classList.contains('reveal-in')) {
              ensureObserver()?.observe(node);
            }
            if (node.querySelectorAll) observeAll(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
} catch (_) {}





