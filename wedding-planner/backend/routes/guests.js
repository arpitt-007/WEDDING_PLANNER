const express = require('express');
const Guest = require('../models/Guest');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET all guests + summary counts
router.get('/', async (req, res) => {
  const guests = await Guest.find({ owner: req.userId }).sort({ createdAt: -1 });

  const summary = {
    total: guests.length,
    confirmed: guests.filter((g) => g.rsvpStatus === 'confirmed').length,
    declined: guests.filter((g) => g.rsvpStatus === 'declined').length,
    pending: guests.filter((g) => g.rsvpStatus === 'pending').length,
    headCount: guests.reduce((sum, g) => {
      if (g.rsvpStatus !== 'confirmed') return sum;
      return sum + 1 + (g.plusOne ? 1 : 0);
    }, 0),
  };

  res.json({ guests, summary });
});

// POST create a guest
router.post('/', async (req, res) => {
  try {
    const guest = await Guest.create({ ...req.body, owner: req.userId });
    res.status(201).json(guest);
  } catch (err) {
    res.status(400).json({ message: 'Could not add guest.', error: err.message });
  }
});

// PUT update a guest
router.put('/:id', async (req, res) => {
  const guest = await Guest.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!guest) return res.status(404).json({ message: 'Guest not found.' });
  res.json(guest);
});

// DELETE a guest
router.delete('/:id', async (req, res) => {
  const guest = await Guest.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!guest) return res.status(404).json({ message: 'Guest not found.' });
  res.json({ message: 'Guest removed.' });
});

module.exports = router;
