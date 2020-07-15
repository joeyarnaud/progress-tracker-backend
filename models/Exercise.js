const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  inputs: [
    {
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
