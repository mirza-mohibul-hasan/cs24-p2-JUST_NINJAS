const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  stsId: {
    type: String,
    required: true,
  },
  contractorId: {
    type: String,
    required: true,
  },
  fineRate: {
    type: Number,
    required: true,
  },
  basicPay: {
    type: Number,
    required: true,
  },
  deficit: {
    type: Number,
    required: true,
  },
  contractorFine: {
    type: Number,
    required: true,
  },
  totalBill: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("STSBill", billSchema);
