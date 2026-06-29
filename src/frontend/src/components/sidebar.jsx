import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, BarChart2, Settings, TrendingUp,
} from 'lucide-react';

const navItems = [
  { group: 'Main', items: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  ]},
  { group: 'Vendor', items: [
    { label: 'Vendors', icon: Users, path: '/vendors' },
  ]},
  { group: 'Quotations', items: [
    { label: 'All Quotations', icon: FileText, path: '/quotations' },
    { label: 'Compare Quotes', icon: BarChart2, path: '/compare' },
  ]},
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">VH</div>
          <div className="logo-text">Vendor<span>Hub</span></div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.group}>
            <div className="nav-section-label">{group.group}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="nav-icon" />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar">AD</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Procurement Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}