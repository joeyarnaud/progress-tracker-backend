const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Workout = require('../../models/Workout');
const Exercise = require('../../models/Exercise');
const Input = require('../../models/Input');
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

      const newWorkout = new Workout({
        name: req.body.name,
        exercises: [],
        user: req.user.id,
      });

      console.log(newWorkout);

      for (exercise in req.body.exercises) {
        const newExercise = new Exercise({
          name: req.body.exercises[exercise].name,
          user: req.user.id,
          inputs: [],
          workouts: [newWorkout._id],
        });

        const newInput = new Input({
          weight: req.body.exercises[exercise].weight,
          sets: req.body.exercises[exercise].sets,
          reps: req.body.exercises[exercise].reps,
          type: req.body.exercises[exercise].type,
          date: req.body.exercises[exercise].date,
          user: req.user.id,
          exercise: newExercise._id,
        });

        const inp = await newInput.save();

        newExercise.inputs.push(newInput._id);

        const ex = await newExercise.save();

        newWorkout.exercises.push(ex._id);
      }

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
    const workouts = await Workout.find({ user: req.user.id })
      .populate({ path: 'exercises', model: Exercise })
      .sort({
        date: -1,
      });

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
    const workout = await Workout.findById(req.params.id).populate({
      path: 'exercises',
      model: Exercise,
      populate: {
        path: 'inputs',
        model: Input,
      },
    });

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/workout/:id
// @desc Delete the data of a workout
// @access Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    await Exercise.updateMany(
      { _id: { $in: workout.exercises } },
      { $pull: { workouts: req.params.id } }
    );

    workout.delete();

    res.json({ _id: req.params.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/workout/:id
// @desc add an exercise to a workout
// @access Private
router.put(
  '/add-exercise/:id',
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const exercise = new Exercise({
        name: req.body.name,
        user: req.user.id,
        inputs: [
          {
            weight: req.body.weight,
            sets: req.body.sets,
            reps: req.body.reps,
            type: req.body.type,
            date: req.body.date,
          },
        ],
        workouts: [req.params.id],
      });

      const workout = await Workout.findByIdAndUpdate(req.params.id, {
        $push: { exercises: exercise._id },
      });

      workout.save();
      exercise.save();

      res.json(exercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route PUT api/workout/change-name/:id
// @desc change a name of the workout
// @access Private
router.put(
  '/change-name/:id',
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const workout = await Workout.findByIdAndUpdate(req.params.id, {
        $set: { name: req.body.name },
      }).populate({ path: 'exercises', model: Exercise });

      res.json({ ...workout._doc, name: req.body.name });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
