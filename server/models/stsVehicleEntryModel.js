const mongoose = require("mongoose");
const stsVehicleEntrySchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
  },
  stsId: {
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
  stsEntryId: {
    type: String,
  },
  addedBy: {
    type: String,
  },
  regAt: {
    type: Date,
    default: Date.now,
  },
});

const STSVehicleEntry = mongoose.model(
  "STSVehicleEntry",
  stsVehicleEntrySchema
);
module.exports = STSVehicleEntry;
