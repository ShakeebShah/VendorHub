export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export const statusColors = {
  Pending: 'badge-yellow',
  Received: 'badge-blue',
  'Under Review': 'badge-purple',
  Approved: 'badge-green',
  Rejected: 'badge-red',
  Active: 'badge-green',
  Inactive: 'badge-gray',
};

export const priorityColors = {
  Low: 'badge-gray',
  Medium: 'badge-blue',
  High: 'badge-yellow',
  Critical: 'badge-red',
};

export const categoryColors = {
  Technology: 'badge-blue',
  Manufacturing: 'badge-purple',
  Services: 'badge-cyan',
  Logistics: 'badge-yellow',
  Construction: 'badge-red',
  Other: 'badge-gray',
};