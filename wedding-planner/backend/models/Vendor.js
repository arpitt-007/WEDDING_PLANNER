const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'venue',
        'catering',
        'photography',
        'decor',
        'music',
        'attire',
        'transport',
        'other',
      ],
      default: 'other',
    },
    contactName: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    cost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['researching', 'contacted', 'booked', 'paid'],
      default: 'researching',
    },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
