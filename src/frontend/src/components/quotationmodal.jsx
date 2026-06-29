import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

const initialState = {
  title: '', description: '', vendor: '', amount: '', currency: 'USD',
  submissionDate: '', validUntil: '', status: 'Pending', priority: 'Medium', notes: '',
};

export default function QuotationModal({ isOpen, onClose, onSubmit, quotation, vendors, loading }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (quotation) {
      setForm({
        ...initialState, ...quotation,
        vendor: quotation.vendor?._id || quotation.vendor || '',
        submissionDate: quotation.submissionDate ? quotation.submissionDate.slice(0, 10) : '',
        validUntil: quotation.validUntil ? quotation.validUntil.slice(0, 10) : '',
      });
    } else {
      setForm({ ...initialState, submissionDate: new Date().toISOString().slice(0, 10) });
    }
    setErrors({});
  }, [quotation, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.vendor) e.vendor = 'Please select a vendor';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) < 0) e.amount = 'Valid amount is required';
    if (!form.submissionDate) e.submissionDate = 'Submission date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color="var(--accent)" />
            </div>
            <span className="modal-title">{quotation ? 'Edit Quotation' : 'Create Quotation'}</span>
          </div>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label required">Quotation Title</label>
            <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Office Supplies Q3 2026" />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label className="form-label required">Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Describe the items or services being quoted..." />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Vendor</label>
              <select className="form-select" name="vendor" value={form.vendor} onChange={handleChange}>
                <option value="">Select a vendor...</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>{v.companyName} — {v.vendorName}</option>
                ))}
              </select>
              {errors.vendor && <div className="form-error">{errors.vendor}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>$</span>
                <input className="form-input" name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" style={{ paddingLeft: 24 }} />
              </div>
              {errors.amount && <div className="form-error">{errors.amount}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Submission Date</label>
              <input className="form-input" name="submissionDate" type="date" value={form.submissionDate} onChange={handleChange} />
              {errors.submissionDate && <div className="form-error">{errors.submissionDate}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Valid Until</label>
              <input className="form-input" name="validUntil" type="date" value={form.validUntil} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                {['Pending','Received','Under Review','Approved','Rejected'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={form.priority} onChange={handleChange}>
                {['Low','Medium','High','Critical'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional notes or terms..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : quotation ? 'Save Changes' : 'Create Quotation'}
          </button>
        </div>
      </div>
    </div>
  );
}