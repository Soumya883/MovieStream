const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie to favorites
router.post('/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.favorites.includes(req.params.movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    user.favorites.push(req.params.movieId);
    await user.save();

    await user.populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove movie from favorites
router.delete('/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== req.params.movieId);
    await user.save();

    await user.populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if movie is in favorites
router.get('/:movieId/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavorite = user.favorites.includes(req.params.movieId);
    res.json({ isFavorite });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
