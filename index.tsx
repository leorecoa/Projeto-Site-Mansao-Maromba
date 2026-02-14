import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Router from './Router';
import "./styles/styles.css";


const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root não encontrado");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </QueryClientProvider>
);
