const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
var cors = require('cors');

var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const auth = require('../../middleware/auth');
const Input = require('../../models/Input');
const Workout = require('../../models/Workout');
const Exercise = require('../../models/Exercise');

const User = require('../../models/User');

const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/exercise
// @desc     get all exercises
// @access   Private
router.get('/', cors(corsOptions), [auth], async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user.id })
      .populate({ path: 'inputs', model: Input })
      .sort({
        date: -1,
      });

    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/exercise
// @desc     create an exercise
// @access   Private
router.post('/', cors(corsOptions), [auth], async (req, res) => {
  try {
    const exercise = new Exercise({
      name: req.body.name,
      user: req.user.id,
      inputs: [],
    });

    const input = new Input({
      weight: req.body.weight,
      sets: req.body.sets,
      reps: req.body.reps,
      type: req.body.type,
      date: req.body.date,
      user: req.user.id,
      exercise: exercise._id,
    });

    exercise.inputs.push(input._id);

    const inp = await input.save();
    const ex = await exercise.save();

    res.json({ ...ex, inputs: [inp] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/exercise/:id
// @desc     Get the data of a specific exercise
// @access   Private
router.get(
  '/:id',
  cors(corsOptions),
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const exercise = await Exercise.findById(req.params.id)
        .populate({
          path: 'workouts',
          model: Workout,
        })
        .populate({ path: 'inputs', model: Input });

      res.json(exercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/exercise/:id
// @desc     DELETE the data of a specific exercise
// @access   Private
router.delete(
  '/:id',
  cors(corsOptions),
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const exercise = await Exercise.findById(req.params.id);

      await Workout.updateMany(
        { _id: { $in: exercise.workouts } },
        { $pull: { exercises: req.params.id } }
      );

      await Input.deleteMany({ _id: { $in: exercise.workouts } });

      await exercise.delete();

      res.json({ _id: req.params.id });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route PUT api/exercise/change-name/:id
// @desc change a name of the exercise
// @access Private
router.put(
  '/change-name/:id',
  cors(corsOptions),
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
