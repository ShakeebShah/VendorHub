const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dns = require('node:dns');
require('dotenv').config();

const vendorRoutes = require('./routes/vendor.routes');
const quotationRoutes = require('./routes/quotation.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/vendors', vendorRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// DB + Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vendor_management';

if (MONGO_URI.startsWith('mongodb+srv://')) {
  const dnsServers = (process.env.MONGO_DNS_SERVERS || '1.1.1.1,8.8.8.8')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  dns.setServers(dnsServers);
}

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.warn('Starting API with in-memory fallback data. Changes will reset when the server restarts.');
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDatabase();
});
