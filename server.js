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

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
