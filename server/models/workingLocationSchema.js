const mongoose = require("mongoose");

const workingLocationSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    ref: "Workforce",
  },
  coordinates: {
    type: [
      {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});
workingLocationSchema.index({ location: "2dsphere" });

const WorkingLocation = mongoose.model(
  "WorkingLocation",
  workingLocationSchema
);

module.exports = WorkingLocation;
