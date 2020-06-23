const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('workout', WorkoutSchema);
