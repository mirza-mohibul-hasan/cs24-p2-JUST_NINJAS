const mongoose = require("mongoose");
const workForceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  dateOfHire: {
    type: Date,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  paymentPerHour: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  wardNumber: {
    type: Number,
  },
  managerId: {
    type: String,
  },
  collectionRoute: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "contractormanager",
  },
  avatar: {
    type: String,
  },
});

module.exports = mongoose.model("Workforce", workForceSchema);
