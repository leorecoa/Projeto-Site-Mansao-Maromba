import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Router from './Router';
import './src/styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root não encontrado");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <Router />
  </QueryClientProvider>
);
