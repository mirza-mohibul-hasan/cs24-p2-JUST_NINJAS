const mongoose = require("mongoose");
const landfillSchema = new mongoose.Schema({
  landfillId: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  starttime: {
    type: String,
    required: true,
  },
  endtime: {
    type: String,
    required: true,
  },
  addedBy: {
    type: String,
  },
  regAt: {
    type: Date,
  },
  areaName: {
    type: String,
  },
});

const Landfill = mongoose.model("Landfill", landfillSchema);
module.exports = Landfill;
