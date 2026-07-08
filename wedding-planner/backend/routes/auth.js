const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, partner1Name, partner2Name, weddingDate, venue, totalBudget } =
      req.body;

    if (!email || !password || !partner1Name) {
      return res
        .status(400)
        .json({ message: 'Email, password, and at least one partner name are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      email,
      password,
      partner1Name,
      partner2Name,
      weddingDate: weddingDate || null,
      venue,
      totalBudget,
    });

    res.status(201).json({ token: signToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: 'Could not create account.', error: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    res.json({ token: signToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Account not found.' });
  res.json(user);
});

// @route   PUT /api/auth/me
router.put('/me', auth, async (req, res) => {
  try {
    const allowed = ['partner1Name', 'partner2Name', 'weddingDate', 'venue', 'totalBudget'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Could not update profile.', error: err.message });
  }
});

module.exports = router;
