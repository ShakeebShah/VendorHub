import React, { useState, useEffect, useCallback } from 'react';
import { quotationApi, vendorApi } from '../utils/api';
import { formatCurrency, formatDate, getInitials, statusColors, priorityColors } from '../utils/helpers';
import QuotationModal from '../components/QuotationModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight,
  FileText, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Received', 'Under Review', 'Approved', 'Rejected'];

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [modal, setModal] = useState({ open: false, quotation: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [statusDropdown, setStatusDropdown] = useState(null);

  const fetchQuotations = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const r = await quotationApi.getAll({ search, status: filterStatus, priority: filterPriority, page, limit: 10 });
      setQuotations(r.data.data);
      setPagination(r.data.pagination);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterPriority]);

  useEffect(() => {
    const t = setTimeout(() => fetchQuotations(1), 300);
    return () => clearTimeout(t);
  }, [fetchQuotations]);

  useEffect(() => {
    vendorApi.getList().then((r) => setVendors(r.data.data)).catch(() => {});
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = () => setStatusDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (modal.quotation) {
        await quotationApi.update(modal.quotation._id, formData);
        toast.success('Quotation updated');
      } else {
        await quotationApi.create(formData);
        toast.success('Quotation created');
      }
      setModal({ open: false, quotation: null });
      fetchQuotations(pagination.page);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await quotationApi.delete(confirmDelete.id);
      toast.success('Quotation deleted');
      setConfirmDelete({ open: false, id: null });
      fetchQuotations(1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await quotationApi.updateStatus(id, status);
      toast.success('Status updated');
      setStatusDropdown(null);
      fetchQuotations(pagination.page);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Quotations</h1>
          <p>{pagination.total} quotation{pagination.total !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ open: true, quotation: null })}>
          <Plus size={16} /> Create Quotation
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input className="form-input" placeholder="Search quotations..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 160 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ width: 140 }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="">All Priority</option>
          {['Low','Medium','High','Critical'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : quotations.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} />
            <h3>No quotations found</h3>
            <p>Create your first quotation to get started</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => (
                  <tr key={q._id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{q.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {q.description}
                        </div>
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
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        {formatCurrency(q.amount, q.currency)}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${priorityColors[q.priority] || 'badge-gray'}`}>{q.priority}</span>
                    </td>
                    <td>
                      <div style={{ position: 'relative' }}>
                        <button
                          className={`badge ${statusColors[q.status] || 'badge-gray'}`}
                          style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          onClick={(e) => { e.stopPropagation(); setStatusDropdown(statusDropdown === q._id ? null : q._id); }}
                        >
                          {q.status}
                          <ChevronDown size={10} />
                        </button>
                        {statusDropdown === q._id && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', zIndex: 50, minWidth: 140, boxShadow: 'var(--shadow)', overflow: 'hidden' }}
                            onClick={(e) => e.stopPropagation()}>
                            {STATUS_OPTIONS.map(s => (
                              <button key={s} style={{ display: 'block', width: '100%', padding: '8px 14px', fontSize: 13, color: q.status === s ? 'var(--accent)' : 'var(--text-secondary)', background: q.status === s ? 'var(--accent-muted)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                onClick={() => handleStatusChange(q._id, s)}>
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(q.submissionDate)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost" title="Edit" onClick={() => setModal({ open: true, quotation: q })}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn btn-ghost" title="Delete" style={{ color: 'var(--red)' }}
                          onClick={() => setConfirmDelete({ open: true, id: q._id })}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.pages > 1 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <div className="pagination">
              <span>Showing {quotations.length} of {pagination.total}</span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={pagination.page <= 1} onClick={() => fetchQuotations(pagination.page - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`pagination-btn ${p === pagination.page ? 'active' : ''}`} onClick={() => fetchQuotations(p)}>{p}</button>
                ))}
                <button className="pagination-btn" disabled={pagination.page >= pagination.pages} onClick={() => fetchQuotations(pagination.page + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuotationModal isOpen={modal.open} onClose={() => setModal({ open: false, quotation: null })} onSubmit={handleSubmit} quotation={modal.quotation} vendors={vendors} loading={saving} />
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete Quotation"
        message="This will permanently delete this quotation. This action cannot be undone."
      />
    </div>
  );
}