const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
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
    group: {
      type: String,
      enum: ['partner1', 'partner2', 'both'],
      default: 'both',
    },
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    rsvpStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending',
    },
    mealPreference: {
      type: String,
      enum: ['none', 'vegetarian', 'vegan', 'non-vegetarian', 'other'],
      default: 'none',
    },
    plusOne: {
      type: Boolean,
      default: false,
    },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guest', guestSchema);
