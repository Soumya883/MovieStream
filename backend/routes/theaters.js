const express = require('express');
const Theater = require('../models/Theater');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all theaters with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const location = req.query.location || '';
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Get total count for pagination
    const total = await Theater.countDocuments(query);

    // Get theaters with pagination and sorting
    const theaters = await Theater.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('screens');

    res.json({
      theaters,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTheaters: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get theater by ID
router.get('/:id', async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id).populate('screens');
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json(theater);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add theater (admin only)
router.post('/', auth, async (req, res) => {
  const { name, location, capacity, screens } = req.body;
  try {
    const theater = new Theater({ name, location, capacity, screens });
    await theater.save();
    res.json(theater);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update theater (admin only)
router.put('/:id', auth, async (req, res) => {
  const { name, location, capacity, screens } = req.body;
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, { name, location, capacity, screens }, { new: true });
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json(theater);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete theater (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json({ message: 'Theater deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
