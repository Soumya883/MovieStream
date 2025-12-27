const express = require('express');
const Screen = require('../models/Screen');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all screens
router.get('/', async (req, res) => {
  try {
    const screens = await Screen.find().populate('theater');
    res.json(screens);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get screens by theater
router.get('/theater/:theaterId', async (req, res) => {
  try {
    const screens = await Screen.find({ theater: req.params.theaterId });
    res.json(screens);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get screen by ID
router.get('/:id', async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id).populate('theater');
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }
    res.json(screen);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add screen (admin only)
router.post('/', auth, async (req, res) => {
  const { theater, screenNumber, capacity, seats } = req.body;
  try {
    const screen = new Screen({ theater, screenNumber, capacity, seats });
    await screen.save();
    res.json(screen);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update screen (admin only)
router.put('/:id', auth, async (req, res) => {
  const { screenNumber, capacity, seats } = req.body;
  try {
    const screen = await Screen.findByIdAndUpdate(req.params.id, { screenNumber, capacity, seats }, { new: true });
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }
    res.json(screen);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete screen (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const screen = await Screen.findByIdAndDelete(req.params.id);
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }
    res.json({ message: 'Screen deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
