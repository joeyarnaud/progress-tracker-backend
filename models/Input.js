const mongoose = require('mongoose');

const InputSchema = new mongoose.Schema({
  weight: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'kg',
  },
  sets: {
    type: Number,
    default: 1,
  },
  reps: {
    type: Number,
    default: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
});

module.exports = mongoose.model('input', InputSchema);
