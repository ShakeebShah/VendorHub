import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';

const initialState = {
  vendorName: '', companyName: '', email: '', contactNumber: '',
  businessAddress: '', category: 'Other', status: 'Active', notes: '',
};

export default function VendorModal({ isOpen, onClose, onSubmit, vendor, loading }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vendor) setForm({ ...initialState, ...vendor });
    else setForm(initialState);
    setErrors({});
  }, [vendor, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.vendorName.trim()) e.vendorName = 'Vendor name is required';
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.contactNumber.trim()) e.contactNumber = 'Contact number is required';
    if (!form.businessAddress.trim()) e.businessAddress = 'Business address is required';
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
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} color="var(--accent)" />
            </div>
            <span className="modal-title">{vendor ? 'Edit Vendor' : 'Add New Vendor'}</span>
          </div>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Vendor Name</label>
              <input className="form-input" name="vendorName" value={form.vendorName} onChange={handleChange} placeholder="John Smith" />
              {errors.vendorName && <div className="form-error">{errors.vendorName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Company Name</label>
              <input className="form-input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Corp" />
              {errors.companyName && <div className="form-error">{errors.companyName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@acme.com" />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label required">Contact Number</label>
              <input className="form-input" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              {errors.contactNumber && <div className="form-error">{errors.contactNumber}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label required">Business Address</label>
            <input className="form-input" name="businessAddress" value={form.businessAddress} onChange={handleChange} placeholder="123 Main St, City, State, ZIP" />
            {errors.businessAddress && <div className="form-error">{errors.businessAddress}</div>}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                {['Technology','Manufacturing','Services','Logistics','Construction','Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes about this vendor..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : vendor ? 'Save Changes' : 'Add Vendor'}
          </button>
        </div>
      </div>
    </div>
  );
}