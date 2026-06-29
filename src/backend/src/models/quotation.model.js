const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quotation title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Quotation amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    submissionDate: {
      type: Date,
      required: [true, 'Submission date is required'],
    },
    validUntil: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'Received', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    items: [
      {
        name: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    attachments: [{ name: String, url: String }],
  },
  { timestamps: true }
);

quotationSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Quotation', quotationSchema);