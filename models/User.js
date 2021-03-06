const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  firebaseToken: {
    type: String,
    required: true,
  },
});

module.exports = user = mongoose.model("user", UserSchema);
