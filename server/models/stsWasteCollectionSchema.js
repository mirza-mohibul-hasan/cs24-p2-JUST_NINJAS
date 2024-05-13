const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema
const stsWasteCollectionSchema = new Schema({
  contractorId: {
    type: String,
    required: true,
  },
  designatedSts: {
    type: String,
    required: true,
  },
  timeDate: {
    type: Date,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  wasteCollectedKg: {
    type: Number,
    default: 0,
  },
  wasteType: {
    type: String,
    required: true,
  },
});

// Create a model based on the schema
module.exports = mongoose.model("STSWasteCollection", stsWasteCollectionSchema);
