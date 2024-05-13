const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wardSchema = new Schema({
  wardNumber: {
    type: Number,
    required: true,
  },
  areas: {
    type: [String],
    required: true,
    default: [],
  },
});

const Ward = mongoose.model("Ward", wardSchema);

module.exports = Ward;
