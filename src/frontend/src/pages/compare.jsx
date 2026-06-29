import React, { useState, useEffect } from 'react';
import { quotationApi } from '../utils/api';
import { formatCurrency, formatDate, getInitials, statusColors } from '../utils/helpers';
import { Search, Trophy, TrendingDown, BarChart3, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Compare() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTitle.trim()) {
      toast('Enter a title to compare quotations', { icon: '🔍' });
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const r = await quotationApi.compare({ title: searchTitle });
      setQuotations(r.data.data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAll = async () => {
    setLoading(true);
    setHasSearched(true);
    setSearchTitle('');
    try {
      const r = await quotationApi.compare({});
      setQuotations(r.data.data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const lowestAmount = quotations.length > 0 ? Math.min(...quotations.map(q => q.amount)) : null;
  const totalAmount = quotations.reduce((s, q) => s + q.amount, 0);
  const avgAmount = quotations.length > 0 ? totalAmount / quotations.length : 0;

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Compare Quotations</h1>
          <p>Side-by-side vendor quote comparison</p>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Search Quotations to Compare</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Search className="search-icon" />
            <input
              className="form-input"
              placeholder="e.g. Office Supplies, IT Equipment..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Compare'}
          </button>
          <button className="btn btn-secondary" onClick={handleAll} disabled={loading}>
            View All
          </button>
        </div>
      </div>

      {/* Summary stats */}
      {quotations.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-info">
              <div className="label">Quotes Found</div>
              <div className="value">{quotations.length}</div>
              <div className="sub">Across {new Set(quotations.map(q => q.vendor?._id)).size} vendors</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--accent-muted)' }}>
              <BarChart3 size={20} color="var(--accent)" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="label">Lowest Quote</div>
              <div className="value" style={{ fontSize: 22 }}>{formatCurrency(lowestAmount)}</div>
              <div className="sub">Best value</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--green-muted)' }}>
              <TrendingDown size={20} color="var(--green)" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="label">Average Quote</div>
              <div className="value" style={{ fontSize: 22 }}>{formatCurrency(avgAmount)}</div>
              <div className="sub">Across all vendors</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--yellow-muted)' }}>
              <Star size={20} color="var(--yellow)" />
            </div>
          </div>
        </div>
      )}

      {/* Comparison table */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : hasSearched && quotations.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <BarChart3 size={40} />
            <h3>No quotations found</h3>
            <p>Try a different search term or view all quotations</p>
          </div>
        </div>
      ) : !hasSearched ? (
        <div className="card">
          <div className="empty-state">
            <BarChart3 size={40} />
            <h3>Search to compare</h3>
            <p>Enter a quotation title above to compare vendor quotes side by side</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={16} color="var(--yellow)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>
              Comparison Results
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>Sorted by amount (lowest first)</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Quotation Title</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Difference</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q, index) => {
                  const isBest = q.amount === lowestAmount;
                  const diff = q.amount - lowestAmount;
                  return (
                    <tr key={q._id} className={isBest ? 'compare-highlight' : ''}>
                      <td>
                        {isBest ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Trophy size={14} color="var(--yellow)" />
                            <span className="best-badge">Best</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>#{index + 1}</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{q.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {q.description}
                        </div>
                      </td>
                      <td>
                        {q.vendor ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{getInitials(q.vendor.companyName)}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{q.vendor.companyName}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.vendor.vendorName}</div>
                            </div>
                          </div>
                        ) : '—'}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: isBest ? 'var(--green)' : 'var(--text-primary)' }}>
                          {formatCurrency(q.amount, q.currency)}
                        </span>
                      </td>
                      <td>
                        {diff === 0 ? (
                          <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>Lowest</span>
                        ) : (
                          <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>+{formatCurrency(diff)}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${statusColors[q.status] || 'badge-gray'}`}>{q.status}</span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatDate(q.submissionDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}