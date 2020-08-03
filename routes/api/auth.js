const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const tokenList = {};

const User = require('../../models/User');

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      const token = jwt.sign(payload, process.env.jwtSecret, {
        expiresIn: process.env.tokenLife,
      });
      const refreshToken = jwt.sign(payload, process.env.refreshTokenSecret, {
        expiresIn: process.env.refreshTokenLife,
      });

      const response = {
        status: 'Logged In',
        token: token,
        refreshToken: refreshToken,
      };

      tokenList[refreshToken] = response;

      res.status(200).json(response);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/token', (req, res) => {
  // refresh the damn token
  const token = req.body.refreshToken;
  const { user } = jwt.decode(token);

  const payload = {
    user: {
      id: user.id,
      name: user.name,
    },
  };

  // Verify token
  try {
    jwt.verify(token, process.env.refreshTokenSecret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Refresh Token is not valid' });
      } else {
        const token = jwt.sign(payload, process.env.jwtSecret, {
          expiresIn: process.env.tokenLife,
        });

        const refreshToken = jwt.sign(payload, process.env.refreshTokenSecret, {
          expiresIn: process.env.refreshTokenLife,
        });

        const response = {
          status: 'Logged In',
          token: token,
          refreshToken: refreshToken,
        };

        return res.status(201).json(response);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
