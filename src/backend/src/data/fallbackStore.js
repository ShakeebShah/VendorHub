const { randomUUID } = require('crypto');

const now = () => new Date();

const createVendor = (vendor) => ({
  _id: randomUUID(),
  status: 'Active',
  category: 'Other',
  createdAt: now(),
  updatedAt: now(),
  ...vendor,
});

const vendors = [
  createVendor({ vendorName: 'Sarah Johnson', companyName: 'TechPro Solutions', email: 'sarah@techpro.com', contactNumber: '+1 (555) 101-2030', businessAddress: '100 Silicon Ave, San Francisco, CA 94105', category: 'Technology' }),
  createVendor({ vendorName: 'Michael Chen', companyName: 'BuildRight Construction', email: 'mchen@buildright.com', contactNumber: '+1 (555) 202-3040', businessAddress: '200 Builder Blvd, Austin, TX 78701', category: 'Construction' }),
  createVendor({ vendorName: 'Amanda Rivera', companyName: 'SwiftLog Logistics', email: 'arivera@swiftlog.com', contactNumber: '+1 (555) 303-4050', businessAddress: '300 Freight Lane, Chicago, IL 60601', category: 'Logistics' }),
  createVendor({ vendorName: 'David Kumar', companyName: 'PrimeParts Manufacturing', email: 'dkumar@primeparts.com', contactNumber: '+1 (555) 404-5060', businessAddress: '400 Factory Rd, Detroit, MI 48201', category: 'Manufacturing' }),
  createVendor({ vendorName: 'Lisa Thompson', companyName: 'Apex Services Group', email: 'lthompson@apexsg.com', contactNumber: '+1 (555) 505-6070', businessAddress: '500 Corporate Dr, New York, NY 10001', category: 'Services' }),
  createVendor({ vendorName: 'Robert Martinez', companyName: 'NextGen IT', email: 'rmartinez@nextgenit.com', contactNumber: '+1 (555) 606-7080', businessAddress: '600 Tech Park, Seattle, WA 98101', category: 'Technology', status: 'Inactive' }),
];

const createQuotation = (quotation) => ({
  _id: randomUUID(),
  status: 'Pending',
  priority: 'Medium',
  currency: 'USD',
  items: [],
  attachments: [],
  createdAt: now(),
  updatedAt: now(),
  ...quotation,
});

const quotations = [
  createQuotation({ title: 'Office Supplies Q3 2026', description: 'Stationery, printer paper, pens, folders and misc office items', vendor: vendors[0]._id, amount: 4500, submissionDate: new Date('2026-06-01'), status: 'Approved' }),
  createQuotation({ title: 'Office Supplies Q3 2026', description: 'Paper reams, binders, desk accessories', vendor: vendors[4]._id, amount: 5200, submissionDate: new Date('2026-06-02'), status: 'Received' }),
  createQuotation({ title: 'Office Supplies Q3 2026', description: 'Bulk office supplies package', vendor: vendors[2]._id, amount: 4800, submissionDate: new Date('2026-06-03'), status: 'Received' }),
  createQuotation({ title: 'Server Infrastructure Upgrade', description: 'New rack servers, UPS, networking gear for data center', vendor: vendors[0]._id, amount: 125000, submissionDate: new Date('2026-05-15'), status: 'Under Review', priority: 'Critical' }),
  createQuotation({ title: 'Server Infrastructure Upgrade', description: 'Enterprise server hardware + 3yr support', vendor: vendors[5]._id, amount: 118500, submissionDate: new Date('2026-05-18'), status: 'Under Review', priority: 'Critical' }),
  createQuotation({ title: 'Warehouse Construction Phase 1', description: 'Site prep, foundation, steel frame structure for 50k sqft', vendor: vendors[1]._id, amount: 850000, submissionDate: new Date('2026-04-01'), status: 'Approved', priority: 'High' }),
  createQuotation({ title: 'Freight Services Annual Contract', description: 'Nationwide freight and last-mile delivery services', vendor: vendors[2]._id, amount: 72000, submissionDate: new Date('2026-06-10'), status: 'Pending', priority: 'High' }),
  createQuotation({ title: 'Machine Parts Supply', description: 'CNC machine parts, bearings, belts for Q3 production run', vendor: vendors[3]._id, amount: 34200, submissionDate: new Date('2026-06-05'), status: 'Pending' }),
  createQuotation({ title: 'IT Support Contract', description: 'Managed IT helpdesk, on-site support, 24/7 monitoring', vendor: vendors[4]._id, amount: 48000, submissionDate: new Date('2026-05-20'), status: 'Rejected', priority: 'Low' }),
  createQuotation({ title: 'Security System Installation', description: 'CCTV, access control, alarm systems for HQ', vendor: vendors[0]._id, amount: 22000, submissionDate: new Date('2026-06-18'), status: 'Received', priority: 'High' }),
];

const includes = (value, search) => String(value || '').toLowerCase().includes(String(search || '').toLowerCase());
const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
const paginate = (items, page = 1, limit = 10) => {
  const currentPage = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);
  const start = (currentPage - 1) * pageLimit;
  return {
    data: items.slice(start, start + pageLimit),
    pagination: { total: items.length, page: currentPage, limit: pageLimit, pages: Math.ceil(items.length / pageLimit) },
  };
};

const populateVendor = (quotation) => ({
  ...quotation,
  vendor: vendors.find((vendor) => vendor._id === quotation.vendor) || quotation.vendor,
});

function listVendors(query = {}) {
  const filtered = vendors
    .filter((vendor) => !query.search || includes(vendor.vendorName, query.search) || includes(vendor.companyName, query.search) || includes(vendor.email, query.search))
    .filter((vendor) => !query.status || vendor.status === query.status)
    .filter((vendor) => !query.category || vendor.category === query.category)
    .sort(byNewest);
  return paginate(filtered, query.page, query.limit);
}

function getVendor(id) {
  return vendors.find((vendor) => vendor._id === id);
}

function addVendor(payload) {
  if (vendors.some((vendor) => vendor.email === payload.email)) {
    const err = new Error('A vendor with this email already exists');
    err.status = 400;
    throw err;
  }
  const vendor = createVendor(payload);
  vendors.unshift(vendor);
  return vendor;
}

function editVendor(id, payload) {
  const index = vendors.findIndex((vendor) => vendor._id === id);
  if (index === -1) return null;
  vendors[index] = { ...vendors[index], ...payload, updatedAt: now() };
  return vendors[index];
}

function removeVendor(id) {
  const index = vendors.findIndex((vendor) => vendor._id === id);
  if (index === -1) return null;
  return vendors.splice(index, 1)[0];
}

function vendorList() {
  return vendors
    .filter((vendor) => vendor.status === 'Active')
    .sort((a, b) => a.companyName.localeCompare(b.companyName))
    .map(({ _id, vendorName, companyName, email }) => ({ _id, vendorName, companyName, email }));
}

function listQuotations(query = {}) {
  const filtered = quotations
    .filter((quotation) => !query.search || includes(quotation.title, query.search) || includes(quotation.description, query.search))
    .filter((quotation) => !query.status || quotation.status === query.status)
    .filter((quotation) => !query.priority || quotation.priority === query.priority)
    .filter((quotation) => !query.vendor || quotation.vendor === query.vendor)
    .sort(byNewest)
    .map(populateVendor);
  return paginate(filtered, query.page, query.limit);
}

function getQuotation(id) {
  const quotation = quotations.find((item) => item._id === id);
  return quotation ? populateVendor(quotation) : null;
}

function addQuotation(payload) {
  const quotation = createQuotation(payload);
  quotations.unshift(quotation);
  return populateVendor(quotation);
}

function editQuotation(id, payload) {
  const index = quotations.findIndex((quotation) => quotation._id === id);
  if (index === -1) return null;
  quotations[index] = { ...quotations[index], ...payload, updatedAt: now() };
  return populateVendor(quotations[index]);
}

function removeQuotation(id) {
  const index = quotations.findIndex((quotation) => quotation._id === id);
  if (index === -1) return null;
  return quotations.splice(index, 1)[0];
}

function compareQuotations(title) {
  return quotations
    .filter((quotation) => !title || includes(quotation.title, title))
    .sort((a, b) => a.amount - b.amount)
    .map(populateVendor);
}

function recentQuotations() {
  return quotations.sort(byNewest).slice(0, 5).map(populateVendor);
}

function dashboardStats() {
  const statuses = ['Pending', 'Approved', 'Under Review', 'Received', 'Rejected'];
  const statusCounts = Object.fromEntries(statuses.map((status) => [status, quotations.filter((item) => item.status === status).length]));
  const topVendorsByQuotations = vendors
    .map((vendor) => {
      const vendorQuotations = quotations.filter((quotation) => quotation.vendor === vendor._id);
      return {
        _id: vendor._id,
        count: vendorQuotations.length,
        totalAmount: vendorQuotations.reduce((sum, quotation) => sum + Number(quotation.amount || 0), 0),
        vendor: { vendorName: vendor.vendorName, companyName: vendor.companyName },
      };
    })
    .filter((vendor) => vendor.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const monthlyMap = quotations.reduce((months, quotation) => {
    const date = new Date(quotation.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    months[key] = months[key] || { _id: { year: date.getFullYear(), month: date.getMonth() + 1 }, count: 0, totalAmount: 0 };
    months[key].count += 1;
    months[key].totalAmount += Number(quotation.amount || 0);
    return months;
  }, {});

  return {
    stats: {
      totalVendors: vendors.length,
      activeVendors: vendors.filter((vendor) => vendor.status === 'Active').length,
      totalQuotations: quotations.length,
      pendingQuotations: statusCounts.Pending,
      approvedQuotations: statusCounts.Approved,
      underReviewQuotations: statusCounts['Under Review'],
      receivedQuotations: statusCounts.Received,
      rejectedQuotations: statusCounts.Rejected,
    },
    recentQuotations: recentQuotations(),
    recentVendors: vendors.sort(byNewest).slice(0, 5),
    topVendorsByQuotations,
    monthlyData: Object.values(monthlyMap).slice(-6),
  };
}

module.exports = {
  listVendors,
  getVendor,
  addVendor,
  editVendor,
  removeVendor,
  vendorList,
  listQuotations,
  getQuotation,
  addQuotation,
  editQuotation,
  removeQuotation,
  compareQuotations,
  recentQuotations,
  dashboardStats,
};
