const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ owner: req.userId }).sort({ dueDate: 1 });
  const summary = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length,
  };
  res.json({ tasks, summary });
});

router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Could not add task.', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task removed.' });
});

module.exports = router;
