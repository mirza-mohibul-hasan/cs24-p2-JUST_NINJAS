const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  fuel_cost_loaded: {
    type: Number,
    required: true,
  },
  fuel_cost_unloaded: {
    type: Number,
    required: true,
  },
  registration_number: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  addedBy: {
    type: String,
  },
  regAt: {
    type: Date,
    default: Date.now(),
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
