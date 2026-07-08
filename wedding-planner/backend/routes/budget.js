const express = require('express');
const BudgetItem = require('../models/BudgetItem');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const items = await BudgetItem.find({ owner: req.userId })
    .populate('vendor', 'name')
    .sort({ createdAt: -1 });
  const user = await User.findById(req.userId);

  const totals = items.reduce(
    (acc, item) => {
      acc.estimated += item.estimatedCost || 0;
      acc.actual += item.actualCost || 0;
      acc.paid += item.amountPaid || 0;
      return acc;
    },
    { estimated: 0, actual: 0, paid: 0 }
  );

  res.json({
    items,
    summary: {
      totalBudget: user.totalBudget || 0,
      estimatedSpend: totals.estimated,
      actualSpend: totals.actual,
      amountPaid: totals.paid,
      remaining: (user.totalBudget || 0) - totals.actual,
    },
  });
});

router.post('/', async (req, res) => {
  try {
    const item = await BudgetItem.create({ ...req.body, owner: req.userId });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Could not add budget item.', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const item = await BudgetItem.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Budget item not found.' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const item = await BudgetItem.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!item) return res.status(404).json({ message: 'Budget item not found.' });
  res.json({ message: 'Budget item removed.' });
});

module.exports = router;
