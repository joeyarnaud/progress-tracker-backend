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
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('exercise', ExerciseSchema);
