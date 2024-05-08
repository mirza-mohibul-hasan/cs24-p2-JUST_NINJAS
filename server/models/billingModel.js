const mongoose = require("mongoose");
const billingSchema = new mongoose.Schema({
  billTime: {
    type: Date,
    required: true,
  },
  vehicleInfo: {
    vehicleId: {
      type: String,
      required: true,
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
  },
  weightOfWaste: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  costPerKm: {
    type: Number,
    required: true,
  },
  fuelAllocation: {
    type: Number,
    required: true,
  },
  stsId: {
    type: String,
    required: true,
  },
  landfillId: {
    type: String,
    required: true,
  },
  billedBy: {
    type: String,
    required: true,
  },
  areaName: {
    type: String,
    required: true,
  },
});

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;
