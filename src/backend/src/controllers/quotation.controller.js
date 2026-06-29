const Quotation = require('../models/quotation.model');
const mongoose = require('mongoose');
const fallbackStore = require('../data/fallbackStore');

const useFallback = () => mongoose.connection.readyState !== 1;

// GET all quotations
exports.getQuotations = async (req, res) => {
  try {
    if (useFallback()) {
      const { data, pagination } = fallbackStore.listQuotations(req.query);
      return res.json({ success: true, data, pagination });
    }

    const { search, status, priority, vendor, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (vendor) query.vendor = vendor;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Quotation.countDocuments(query);
    const quotations = await Quotation.find(query)
      .populate('vendor', 'vendorName companyName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: quotations,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single quotation
exports.getQuotation = async (req, res) => {
  try {
    if (useFallback()) {
      const quotation = fallbackStore.getQuotation(req.params.id);
      if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
      return res.json({ success: true, data: quotation });
    }

    const quotation = await Quotation.findById(req.params.id).populate('vendor');
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data: quotation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE quotation
exports.createQuotation = async (req, res) => {
  try {
    if (useFallback()) {
      const quotation = fallbackStore.addQuotation(req.body);
      return res.status(201).json({ success: true, data: quotation, message: 'Quotation created successfully' });
    }

    const quotation = new Quotation(req.body);
    const saved = await quotation.save();
    const populated = await saved.populate('vendor', 'vendorName companyName email');
    res.status(201).json({ success: true, data: populated, message: 'Quotation created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE quotation
exports.updateQuotation = async (req, res) => {
  try {
    if (useFallback()) {
      const quotation = fallbackStore.editQuotation(req.params.id, req.body);
      if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
      return res.json({ success: true, data: quotation, message: 'Quotation updated successfully' });
    }

    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('vendor', 'vendorName companyName email');
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data: quotation, message: 'Quotation updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE quotation
exports.deleteQuotation = async (req, res) => {
  try {
    if (useFallback()) {
      const quotation = fallbackStore.removeQuotation(req.params.id);
      if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
      return res.json({ success: true, message: 'Quotation deleted successfully' });
    }

    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, message: 'Quotation deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE status only
exports.updateStatus = async (req, res) => {
  try {
    if (useFallback()) {
      const quotation = fallbackStore.editQuotation(req.params.id, { status: req.body.status });
      if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
      return res.json({ success: true, data: quotation, message: 'Status updated successfully' });
    }

    const { status } = req.body;
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('vendor', 'vendorName companyName');
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data: quotation, message: 'Status updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// COMPARE quotations by vendor for the same item/title
exports.compareQuotations = async (req, res) => {
  try {
    if (useFallback()) {
      return res.json({ success: true, data: fallbackStore.compareQuotations(req.query.title) });
    }

    const { title } = req.query;
    const query = title ? { title: { $regex: title, $options: 'i' } } : {};
    const quotations = await Quotation.find(query)
      .populate('vendor', 'vendorName companyName email')
      .sort({ amount: 1 });
    res.json({ success: true, data: quotations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET recent quotations (for dashboard)
exports.getRecentQuotations = async (req, res) => {
  try {
    if (useFallback()) {
      return res.json({ success: true, data: fallbackStore.recentQuotations() });
    }

    const quotations = await Quotation.find()
      .populate('vendor', 'vendorName companyName')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ success: true, data: quotations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
