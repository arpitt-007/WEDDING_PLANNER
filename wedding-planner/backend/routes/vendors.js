const express = require('express');
const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const vendors = await Vendor.find({ owner: req.userId }).sort({ createdAt: -1 });
  res.json(vendors);
});

router.post('/', async (req, res) => {
  try {
    const vendor = await Vendor.create({ ...req.body, owner: req.userId });
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ message: 'Could not add vendor.', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const vendor = await Vendor.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!vendor) return res.status(404).json({ message: 'Vendor not found.' });
  res.json(vendor);
});

router.delete('/:id', async (req, res) => {
  const vendor = await Vendor.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found.' });
  res.json({ message: 'Vendor removed.' });
});

module.exports = router;
