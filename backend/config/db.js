const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const connectDb = async (req, res) => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Database connected successfully");
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = connectDb;
