const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
    maxlength: 300,
  },
});

module.exports = mongoose.model("User", userSchema);
