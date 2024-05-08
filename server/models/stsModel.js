const mongoose = require("mongoose");
const stsSchema = new mongoose.Schema({
  stsId: {
    type: String,
    required: true,
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
  ward_num: {
    type: Number,
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

const STS = mongoose.model("Sts", stsSchema);
module.exports = STS;
