const mongoose = require("mongoose");

const connectDB = () => {
  try {
    const connection = mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
