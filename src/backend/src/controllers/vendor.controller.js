const Vendor = require('../models/vendor.model');
const mongoose = require('mongoose');
const fallbackStore = require('../data/fallbackStore');

const useFallback = () => mongoose.connection.readyState !== 1;

// GET all vendors with search + filter
exports.getVendors = async (req, res) => {
  try {
    if (useFallback()) {
      const { data, pagination } = fallbackStore.listVendors(req.query);
      return res.json({ success: true, data, pagination });
    }

    const { search, status, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { vendorName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Vendor.countDocuments(query);
    const vendors = await Vendor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: vendors,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single vendor
exports.getVendor = async (req, res) => {
  try {
    if (useFallback()) {
      const vendor = fallbackStore.getVendor(req.params.id);
      if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
      return res.json({ success: true, data: vendor });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE vendor
exports.createVendor = async (req, res) => {
  try {
    if (useFallback()) {
      const vendor = fallbackStore.addVendor(req.body);
      return res.status(201).json({ success: true, data: vendor, message: 'Vendor created successfully' });
    }

    const vendor = new Vendor(req.body);
    const saved = await vendor.save();
    res.status(201).json({ success: true, data: saved, message: 'Vendor created successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A vendor with this email already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE vendor
exports.updateVendor = async (req, res) => {
  try {
    if (useFallback()) {
      const vendor = fallbackStore.editVendor(req.params.id, req.body);
      if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
      return res.json({ success: true, data: vendor, message: 'Vendor updated successfully' });
    }

    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor, message: 'Vendor updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE vendor
exports.deleteVendor = async (req, res) => {
  try {
    if (useFallback()) {
      const vendor = fallbackStore.removeVendor(req.params.id);
      if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
      return res.json({ success: true, message: 'Vendor deleted successfully' });
    }

    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all vendors (no pagination, for dropdowns)
exports.getAllVendorsList = async (req, res) => {
  try {
    if (useFallback()) {
      return res.json({ success: true, data: fallbackStore.vendorList() });
    }

    const vendors = await Vendor.find({ status: 'Active' }).select('vendorName companyName email').sort({ companyName: 1 });
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
