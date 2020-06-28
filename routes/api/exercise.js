const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Workout = require('../../models/Workout');
const Exercise = require('../../models/Exercise');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/exercise
// @desc     get all exercises
// @access   Private
router.get('/', [auth], async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user.id }).sort({
      date: -1,
    });

    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/exercise/:id
// @desc     Get the data of a specific exercise
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/exercise/:id
// @desc     DELETE the data of a specific exercise
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    await Workout.updateMany(
      { _id: { $in: exercise.workouts } },
      { $pull: { exercises: req.params.id } }
    );

    exercise.delete();

    res.json({ _id: req.params.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
