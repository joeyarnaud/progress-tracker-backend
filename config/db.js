const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    // console.log(process.env.)
    console.log(`MongoDB Connected on ${process.env.mongoURI}!`);
  } catch (err) {
    console.log(`MongoDB Failed on ${process.env.mongoURI}`);
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
