const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    businessAddress: {
      type: String,
      required: [true, 'Business address is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technology', 'Manufacturing', 'Services', 'Logistics', 'Construction', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

vendorSchema.index({ vendorName: 'text', companyName: 'text', email: 'text' });

module.exports = mongoose.model('Vendor', vendorSchema);