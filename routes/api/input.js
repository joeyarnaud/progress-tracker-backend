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

// @route    DELETE api/input/:inputId/exercise/:id
// @desc     Delete an input of the exercise
// @access   Private
router.delete(
  '/:id',
  cors(corsOptions),
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const exercise = await Exercise.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { inputs: { _id: req.params.input_id } },
        },
        { returnOriginal: false }
      ).populate({ path: 'inputs', model: Input });

      await Input.findByIdAndDelete(req.params.inputId);

      res.json(exercise);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/input/input-exercise/:id
// @desc     add an input to an exercise
// @access   Private
router.post(
  '/input-exercise/:id',
  cors(corsOptions),
  [auth, checkObjectId('id')],
  async (req, res) => {
    try {
      const input = new Input({
        ...req.body.input,
        user: req.user.id,
        exercise: req.params.id,
      });

      await input.save();

      await Exercise.findByIdAndUpdate(req.params.id, {
        $push: { inputs: input._id },
      });

      res.json(input);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
