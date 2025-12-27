const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: String }],
  duration: { type: Number, required: true }, // in minutes
  releaseDate: { type: Date, required: true },
  posterUrl: { type: String }, // URL to poster image
  trailer: { type: String }, // URL to trailer
  cast: [{ name: String, role: String }],
  director: { type: String },
  rating: { type: Number, min: 0, max: 10 }, // Average rating
  totalRatings: { type: Number, default: 0 }, // Total number of ratings
  totalReviews: { type: Number, default: 0 }, // Total number of reviews
});

module.exports = mongoose.model('Movie', movieSchema);
