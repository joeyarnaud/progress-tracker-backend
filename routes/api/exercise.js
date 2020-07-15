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
    const exercise = await Exercise.findById(req.params.id).populate({
      path: 'workouts',
      model: Workout,
    });

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

// @route    PUT api/exercise/:id/input/:input_id
// @desc     Delete an input of the exercise
// @access   Private
router.put(
  '/:id/delete-input/:input_id',
  [auth, checkObjectId('id')],
  async (req, res) => {
    console.log(req.params);
    try {
      const exercise = await Exercise.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { inputs: { _id: req.params.input_id } },
        },
        { returnOriginal: false }
      );

      res.json(exercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/exercise/:id/input
// @desc     add an input to the exercise
// @access   Private
router.put('/:id/add-input', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      {
        $push: { inputs: { $each: [req.body.input], $sort: { date: 1 } } },
      },
      { returnOriginal: false }
    );

    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/exercise/change-name/:id
// @desc change a name of the exercise
// @access Private
router.put(
  '/change-name/:id',
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const exercise = await Exercise.findByIdAndUpdate(
        req.params.id,
        {
          $set: { name: req.body.name },
        },
        { returnOriginal: false }
      ).populate({ path: 'exercises', model: Exercise });

      res.json(exercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
