const mongoose = require("mongoose");
const landfillVehicleEntrySchema = new mongoose.Schema({
  landfillId: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: String,
    required: true,
  },
  timeOfArrival: {
    type: Date,
  },
  timeOfDeparture: {
    type: Date,
  },
  weightOfWaste: {
    type: Number,
    required: true,
  },
  landfillEntryId: {
    type: String,
    required: true,
  },
  addedBy: {
    type: String,
  },
  regAt: {
    type: Date,
    default: Date.now,
  },
});

const LandfillVehicleEntry = mongoose.model(
  "LandfillVehicleEntry",
  landfillVehicleEntrySchema
);
module.exports = LandfillVehicleEntry;
