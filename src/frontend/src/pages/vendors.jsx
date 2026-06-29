import React, { useState, useEffect, useCallback } from 'react';
import { vendorApi } from '../utils/api';
import { formatDate, getInitials, statusColors, categoryColors } from '../utils/helpers';
import VendorModal from '../components/VendorModal';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Building2, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [modal, setModal] = useState({ open: false, vendor: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [view, setView] = useState('table'); // table | cards

  const fetchVendors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const r = await vendorApi.getAll({ search, status: filterStatus, category: filterCategory, page, limit: 10 });
      setVendors(r.data.data);
      setPagination(r.data.pagination);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterCategory]);

  useEffect(() => {
    const t = setTimeout(() => fetchVendors(1), 300);
    return () => clearTimeout(t);
  }, [fetchVendors]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (modal.vendor) {
        await vendorApi.update(modal.vendor._id, formData);
        toast.success('Vendor updated successfully');
      } else {
        await vendorApi.create(formData);
        toast.success('Vendor added successfully');
      }
      setModal({ open: false, vendor: null });
      fetchVendors(pagination.page);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await vendorApi.delete(confirmDelete.id);
      toast.success('Vendor deleted');
      setConfirmDelete({ open: false, id: null });
      fetchVendors(1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Vendors</h1>
          <p>{pagination.total} vendor{pagination.total !== 1 ? 's' : ''} registered</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ open: true, vendor: null })}>
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input className="form-input" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select className="form-select" style={{ width: 160 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {['Technology','Manufacturing','Services','Logistics','Construction','Other'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : vendors.length === 0 ? (
          <div className="empty-state">
            <Building2 size={40} />
            <h3>No vendors found</h3>
            <p>Add your first vendor to get started</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Contact</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar">{getInitials(v.companyName)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{v.companyName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.vendorName}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
                          <Mail size={12} /> {v.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                          <Phone size={12} /> {v.contactNumber}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${categoryColors[v.category] || 'badge-gray'}`}>{v.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${statusColors[v.status] || 'badge-gray'}`}>{v.status}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(v.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost" title="Edit" onClick={() => setModal({ open: true, vendor: v })}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn btn-ghost" title="Delete" onClick={() => setConfirmDelete({ open: true, id: v._id })}
                          style={{ color: 'var(--red)' }}>
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

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <div className="pagination">
              <span>Showing {vendors.length} of {pagination.total}</span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={pagination.page <= 1} onClick={() => fetchVendors(pagination.page - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`pagination-btn ${p === pagination.page ? 'active' : ''}`} onClick={() => fetchVendors(p)}>{p}</button>
                ))}
                <button className="pagination-btn" disabled={pagination.page >= pagination.pages} onClick={() => fetchVendors(pagination.page + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <VendorModal isOpen={modal.open} onClose={() => setModal({ open: false, vendor: null })} onSubmit={handleSubmit} vendor={modal.vendor} loading={saving} />
      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete Vendor"
        message="This will permanently remove this vendor and cannot be undone. Are you sure?"
      />
    </div>
  );
}