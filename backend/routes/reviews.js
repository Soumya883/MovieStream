const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews for a movie
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { movieId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (movieId) {
      query.movie = movieId;
    }

    const reviews = await Review.find(query)
      .populate('user', 'username')
      .populate('movie', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'username')
      .populate('movie', 'title');

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    res.json(review);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ user: req.user.id, movie: movieId });
    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this movie' });
    }

    const review = new Review({
      user: req.user.id,
      movie: movieId,
      rating,
      comment
    });

    await review.save();
    await review.populate('user', 'username');
    await review.populate('movie', 'title');

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await review.populate('user', 'username');
    await review.populate('movie', 'title');

    res.json(review);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await review.remove();
    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
