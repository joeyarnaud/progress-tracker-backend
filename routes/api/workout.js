const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Workout = require('../../models/Workout');
const Exercise = require('../../models/Exercise');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/workout/create
// @desc     Create a workout
// @access   Private
router.post(
  '/create',
  [
    auth,
    [
      check('name', 'Text is required').not().isEmpty(),
      check('exercises').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const exercises = [];

      for (exercise in req.body.exercises) {
        const newExercise = new Exercise({
          name: req.body.exercises[exercise].name,
          user: req.user.id,
          inputs: [
            {
              weight: req.body.exercises[exercise].weight,
              sets: req.body.exercises[exercise].sets,
              reps: req.body.exercises[exercise].reps,
            },
          ],
        });

        const ex = newExercise.save();

        exercises.push({
          name: req.body.exercises[exercise].name,
          user: req.user.id,
          inputs: [
            {
              weight: req.body.exercises[exercise].weight,
              sets: req.body.exercises[exercise].sets,
              reps: req.body.exercises[exercise].reps,
            },
          ],
        });
      }

      const newWorkout = new Workout({
        name: req.body.name,
        exercises: exercises,
        user: req.user.id,
      });

      const workout = await newWorkout.save();

      res.json(workout);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/workout
// @desc     Get all workouts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/workout/:id
// @desc     Get the data of a specific workout
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
