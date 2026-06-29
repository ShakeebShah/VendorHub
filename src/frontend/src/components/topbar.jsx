import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function Topbar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <button className="btn btn-ghost" title="Notifications">
          <Bell size={18} />
        </button>
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>AD</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Admin</span>
        </div>
      </div>
    </header>
  );
}