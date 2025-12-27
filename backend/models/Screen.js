const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  screenNumber: { type: Number, required: true },
  capacity: { type: Number, required: true },
  seats: [{ row: String, number: Number, type: { type: String, enum: ['standard', 'premium'], default: 'standard' } }],
});

module.exports = mongoose.model('Screen', screenSchema);
