const mongoose = require("mongoose");

const workforceWorkingSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    ref: "Workforce",
    required: true,
  },
  date: { type: Date, required: true },
  logInTime: [Date],
  logOutTime: [Date],
  startWorking: Date,
  finishWorking: Date,
  totalHoursWorked: {
    type: Number,
    default: 0,
  },
  dutyHours: {
    type: Number,
    default: 0,
  },
  overtimeHours: {
    type: Number,
    default: 0,
  },
  absences: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model(
  "WorkforceWorkingTrack",
  workforceWorkingSchema
);
