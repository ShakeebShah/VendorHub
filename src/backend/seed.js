const mongoose = require('mongoose');
const dns = require('node:dns');
require('dotenv').config();

const Vendor = require('./src/models/vendor.model');
const Quotation = require('./src/models/quotation.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendor_management';

if (MONGO_URI.startsWith('mongodb+srv://')) {
  const dnsServers = (process.env.MONGO_DNS_SERVERS || '1.1.1.1,8.8.8.8')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  dns.setServers(dnsServers);
}

const vendors = [
  { vendorName: 'Sarah Johnson', companyName: 'TechPro Solutions', email: 'sarah@techpro.com', contactNumber: '+1 (555) 101-2030', businessAddress: '100 Silicon Ave, San Francisco, CA 94105', category: 'Technology', status: 'Active' },
  { vendorName: 'Michael Chen', companyName: 'BuildRight Construction', email: 'mchen@buildright.com', contactNumber: '+1 (555) 202-3040', businessAddress: '200 Builder Blvd, Austin, TX 78701', category: 'Construction', status: 'Active' },
  { vendorName: 'Amanda Rivera', companyName: 'SwiftLog Logistics', email: 'arivera@swiftlog.com', contactNumber: '+1 (555) 303-4050', businessAddress: '300 Freight Lane, Chicago, IL 60601', category: 'Logistics', status: 'Active' },
  { vendorName: 'David Kumar', companyName: 'PrimeParts Manufacturing', email: 'dkumar@primeparts.com', contactNumber: '+1 (555) 404-5060', businessAddress: '400 Factory Rd, Detroit, MI 48201', category: 'Manufacturing', status: 'Active' },
  { vendorName: 'Lisa Thompson', companyName: 'Apex Services Group', email: 'lthompson@apexsg.com', contactNumber: '+1 (555) 505-6070', businessAddress: '500 Corporate Dr, New York, NY 10001', category: 'Services', status: 'Active' },
  { vendorName: 'Robert Martinez', companyName: 'NextGen IT', email: 'rmartinez@nextgenit.com', contactNumber: '+1 (555) 606-7080', businessAddress: '600 Tech Park, Seattle, WA 98101', category: 'Technology', status: 'Inactive' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Vendor.deleteMany({});
    await Quotation.deleteMany({});
    console.log('Cleared existing data');

    const createdVendors = await Vendor.insertMany(vendors);
    console.log(`✅ Inserted ${createdVendors.length} vendors`);

    const quotations = [
      { title: 'Office Supplies Q3 2026', description: 'Stationery, printer paper, pens, folders and misc office items', vendor: createdVendors[0]._id, amount: 4500, submissionDate: new Date('2026-06-01'), status: 'Approved', priority: 'Medium', currency: 'USD' },
      { title: 'Office Supplies Q3 2026', description: 'Paper reams, binders, desk accessories', vendor: createdVendors[4]._id, amount: 5200, submissionDate: new Date('2026-06-02'), status: 'Received', priority: 'Medium', currency: 'USD' },
      { title: 'Office Supplies Q3 2026', description: 'Bulk office supplies package', vendor: createdVendors[2]._id, amount: 4800, submissionDate: new Date('2026-06-03'), status: 'Received', priority: 'Medium', currency: 'USD' },
      { title: 'Server Infrastructure Upgrade', description: 'New rack servers, UPS, networking gear for data center', vendor: createdVendors[0]._id, amount: 125000, submissionDate: new Date('2026-05-15'), status: 'Under Review', priority: 'Critical', currency: 'USD' },
      { title: 'Server Infrastructure Upgrade', description: 'Enterprise server hardware + 3yr support', vendor: createdVendors[5]._id, amount: 118500, submissionDate: new Date('2026-05-18'), status: 'Under Review', priority: 'Critical', currency: 'USD' },
      { title: 'Warehouse Construction Phase 1', description: 'Site prep, foundation, steel frame structure for 50k sqft', vendor: createdVendors[1]._id, amount: 850000, submissionDate: new Date('2026-04-01'), status: 'Approved', priority: 'High', currency: 'USD' },
      { title: 'Freight Services Annual Contract', description: 'Nationwide freight and last-mile delivery services', vendor: createdVendors[2]._id, amount: 72000, submissionDate: new Date('2026-06-10'), status: 'Pending', priority: 'High', currency: 'USD' },
      { title: 'Machine Parts Supply', description: 'CNC machine parts, bearings, belts for Q3 production run', vendor: createdVendors[3]._id, amount: 34200, submissionDate: new Date('2026-06-05'), status: 'Pending', priority: 'Medium', currency: 'USD' },
      { title: 'IT Support Contract', description: 'Managed IT helpdesk, on-site support, 24/7 monitoring', vendor: createdVendors[4]._id, amount: 48000, submissionDate: new Date('2026-05-20'), status: 'Rejected', priority: 'Low', currency: 'USD' },
      { title: 'Security System Installation', description: 'CCTV, access control, alarm systems for HQ', vendor: createdVendors[0]._id, amount: 22000, submissionDate: new Date('2026-06-18'), status: 'Received', priority: 'High', currency: 'USD' },
    ];

    const created = await Quotation.insertMany(quotations);
    console.log(`✅ Inserted ${created.length} quotations`);
    console.log('\n🎉 Seed complete! Run the app and explore.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

seed();
