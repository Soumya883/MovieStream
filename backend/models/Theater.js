const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  screens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Screen' }],
});

module.exports = mongoose.model('Theater', theaterSchema);
