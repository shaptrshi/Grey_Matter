const mongoose = require("mongoose");

const connectDb = async (req, res) => {
  try {
    await mongoose.connect(process.env);
  } catch (error) {}
};
