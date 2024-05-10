const mongoose = require("mongoose");
const contractorManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  contact: {
    type: String,
    require: true,
  },
  assignedCompany: {
    type: String,
    required: true,
  },
  accessLevel: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "contractormanager",
  },

  avatar: String,
});

module.exports = mongoose.model("CONTRACTORMANAGER", contractorManagerSchema);
