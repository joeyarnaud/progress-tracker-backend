require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
const port = 8080;

// Init Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/workout', require('./routes/api/workout'));
app.use('/api/exercise', require('./routes/api/exercise'));
app.use('/api/input', require('./routes/api/input'));

app.get('/', (req, res) => {
  res.send('Here!!!');
});

app.listen(port, () =>
  console.log(
    `Server listening at port ${port} \nCORS_ORIGIN: ${process.env.CORS_ORIGIN} \n jwtSecret = ${process.env.jwtSecret} \n
    refreshTokenSecret=${process.env.refreshTokenSecret} \n
    tokenLife=${process.env.tokenLife} \n
    refreshTokenLife=${process.env.refreshTokenLife} \n `
  )
);
