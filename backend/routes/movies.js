const express = require('express');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const { validateMovieId } = require('../middleware/validation');

const router = express.Router();

// Get all movies with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const sortBy = req.query.sortBy || 'title';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { genre: { $in: [new RegExp(search, 'i')] } },
        { cast: { $in: [new RegExp(search, 'i')] } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    // Get total count for pagination
    const total = await Movie.countDocuments(query);

    // Get movies with pagination and sorting
    const movies = await Movie.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      movies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMovies: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie (admin only)
router.post('/', async (req, res) => {
  const { title, description, genre, duration, releaseDate, posterUrl, trailer, cast, director, rating } = req.body;
  try {
    const movie = new Movie({ title, description, genre, duration, releaseDate, posterUrl, trailer, cast, director, rating });
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
