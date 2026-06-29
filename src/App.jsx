import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Quotations from './pages/Quotations';
import Compare from './pages/Compare';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/vendors': 'Vendors',
  '/quotations': 'Quotations',
  '/compare': 'Compare Quotations',
};

function AppLayout() {
  const path = window.location.pathname;
  const title = PAGE_TITLES[path] || 'VendorHub';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: 14,
            fontFamily: 'var(--font-body)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
          error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
        }}
      />
    </BrowserRouter>
  );
}