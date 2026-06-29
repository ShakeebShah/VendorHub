const Vendor = require('../models/vendor.model');
const Quotation = require('../models/quotation.model');
const mongoose = require('mongoose');
const fallbackStore = require('../data/fallbackStore');

exports.getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: fallbackStore.dashboardStats() });
    }

    const [
      totalVendors,
      activeVendors,
      totalQuotations,
      pendingQuotations,
      approvedQuotations,
      underReviewQuotations,
      receivedQuotations,
      rejectedQuotations,
      recentQuotations,
      recentVendors,
      topVendorsByQuotations,
      monthlyData,
    ] = await Promise.all([
      Vendor.countDocuments(),
      Vendor.countDocuments({ status: 'Active' }),
      Quotation.countDocuments(),
      Quotation.countDocuments({ status: 'Pending' }),
      Quotation.countDocuments({ status: 'Approved' }),
      Quotation.countDocuments({ status: 'Under Review' }),
      Quotation.countDocuments({ status: 'Received' }),
      Quotation.countDocuments({ status: 'Rejected' }),
      Quotation.find().populate('vendor', 'vendorName companyName').sort({ createdAt: -1 }).limit(5),
      Vendor.find().sort({ createdAt: -1 }).limit(5),
      Quotation.aggregate([
        { $group: { _id: '$vendor', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'vendors', localField: '_id', foreignField: '_id', as: 'vendor' } },
        { $unwind: '$vendor' },
        { $project: { 'vendor.vendorName': 1, 'vendor.companyName': 1, count: 1, totalAmount: 1 } },
      ]),
      Quotation.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 6 },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalVendors,
          activeVendors,
          totalQuotations,
          pendingQuotations,
          approvedQuotations,
          underReviewQuotations,
          receivedQuotations,
          rejectedQuotations,
        },
        recentQuotations,
        recentVendors,
        topVendorsByQuotations,
        monthlyData,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
