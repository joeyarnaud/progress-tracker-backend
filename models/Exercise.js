const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
  },
  inputs: {
    type: [
      {
        weight: {
          type: Number,
          required: true,
          default: 0,
        },
        sets: {
          type: Number,
          required: true,
          default: 1,
        },
        reps: {
          type: Number,
          required: true,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        difficulty: {
          type: Number,
        },
      },
    ],
  },
  user: { type: mongoose.Schema.Types.ObjectId },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('exercise', ExerciseSchema);
