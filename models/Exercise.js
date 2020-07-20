const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  inputs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Input',
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('exercise', ExerciseSchema);
