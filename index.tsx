
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root não encontrado");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
