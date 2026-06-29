import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../utils/api';
import { formatCurrency, formatDate, statusColors } from '../utils/helpers';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import {
  Users, FileText, Clock, CheckCircle, TrendingUp, AlertCircle, XCircle,
} from 'lucide-react';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const PIE_COLORS = ['#f59e0b', '#4f8ef7', '#a855f7', '#22c55e', '#ef4444'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner" />
    </div>
  );

  if (!data) return <div className="empty-state"><p>Failed to load dashboard data.</p></div>;

  const { stats, recentQuotations, topVendorsByQuotations, monthlyData } = data;

  const statCards = [
    { label: 'Total Vendors', value: stats.totalVendors, sub: `${stats.activeVendors} active`, icon: Users, color: 'var(--accent)', bg: 'var(--accent-muted)' },
    { label: 'Active Quotations', value: stats.totalQuotations, sub: 'All time', icon: FileText, color: 'var(--cyan)', bg: 'var(--cyan-muted)' },
    { label: 'Pending', value: stats.pendingQuotations, sub: 'Awaiting response', icon: Clock, color: 'var(--yellow)', bg: 'var(--yellow-muted)' },
    { label: 'Approved', value: stats.approvedQuotations, sub: 'Accepted quotes', icon: CheckCircle, color: 'var(--green)', bg: 'var(--green-muted)' },
    { label: 'Under Review', value: stats.underReviewQuotations, sub: 'Being evaluated', icon: AlertCircle, color: 'var(--purple)', bg: 'var(--purple-muted)' },
    { label: 'Rejected', value: stats.rejectedQuotations, sub: 'Declined quotes', icon: XCircle, color: 'var(--red)', bg: 'var(--red-muted)' },
  ];

  const pieData = [
    { name: 'Pending', value: stats.pendingQuotations },
    { name: 'Received', value: stats.receivedQuotations },
    { name: 'Under Review', value: stats.underReviewQuotations },
    { name: 'Approved', value: stats.approvedQuotations },
    { name: 'Rejected', value: stats.rejectedQuotations },
  ].filter(d => d.value > 0);

  const chartData = monthlyData.map((m) => ({
    month: `${MONTH_NAMES[m._id.month - 1]} '${String(m._id.year).slice(-2)}`,
    quotations: m.count,
    amount: m.totalAmount,
  }));

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Overview of your vendor management activity</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text-secondary)' }}>
          <TrendingUp size={14} color="var(--green)" />
          <span>Live data</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={s.label}>
              <div className="stat-info">
                <div className="label">{s.label}</div>
                <div className="value">{s.value}</div>
                <div className="sub">{s.sub}</div>
              </div>
              <div className="stat-icon" style={{ background: s.bg }}>
                <Icon size={20} color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="charts-grid">
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Quotation Activity</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly quotations over time</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="quotations" stroke="#4f8ef7" fill="url(#grad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <p>No activity data yet</p>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Quotation Status</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Distribution by status</div>
          </div>
          {pieData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <p>No quotation data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="charts-grid">
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Recent Quotations</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Latest quotation activity</div>
          </div>
          {recentQuotations.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No quotations yet</p>
            </div>
          ) : (
            <div className="activity-list">
              {recentQuotations.map((q) => (
                <div className="activity-item" key={q._id}>
                  <div className="activity-dot" style={{ background: q.status === 'Approved' ? 'var(--green)' : q.status === 'Pending' ? 'var(--yellow)' : 'var(--accent)' }} />
                  <div className="activity-content">
                    <div className="activity-title">{q.title}</div>
                    <div className="activity-meta">{q.vendor?.companyName} · {formatDate(q.createdAt)}</div>
                  </div>
                  <div>
                    <span className={`badge ${statusColors[q.status] || 'badge-gray'}`}>{q.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Top Vendors</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>By number of quotations</div>
          </div>
          {topVendorsByQuotations.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No vendor data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topVendorsByQuotations.map(v => ({ name: v.vendor.companyName.split(' ')[0], count: v.count, amount: v.totalAmount }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="#4f8ef7" radius={[4, 4, 0, 0]} name="Quotations" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}