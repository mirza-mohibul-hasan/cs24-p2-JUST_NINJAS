const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  nid: String,
  address: String,
  password: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  avatar: String,
});

module.exports = mongoose.model("User", userSchema);
