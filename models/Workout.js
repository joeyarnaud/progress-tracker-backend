const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId },
  date: {
    type: Date,
    default: Date.now,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('workout', WorkoutSchema);
