const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'venue',
        'catering',
        'attire',
        'photography',
        'decor',
        'invitations',
        'entertainment',
        'transport',
        'honeymoon',
        'other',
      ],
      default: 'other',
    },
    item: {
      type: String,
      required: true,
      trim: true,
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BudgetItem', budgetItemSchema);
