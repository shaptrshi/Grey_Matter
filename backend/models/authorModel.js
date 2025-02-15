const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
});

authorSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
    next();
  }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

authorSchema.methods.matchPassword = async function (enteredPassword)  {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
