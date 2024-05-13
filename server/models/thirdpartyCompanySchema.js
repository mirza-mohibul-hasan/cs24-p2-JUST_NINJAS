const mongoose = require("mongoose");
const thirdpartyCompanySchema = new mongoose.Schema({
  areaOfCollection: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  contactDuration: {
    type: String,
    required: true,
  },
  contractId: {
    type: String,
    required: true,
  },
  designatedSts: {
    type: String,
    ref: "Sts",
    required: true,
  },
  paymentPerTonWaste: {
    type: Number,
    required: true,
  },
  reqAmountWastePerDay: {
    type: Number,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  registrationId: {
    type: String,
    required: true,
  },
  tinNumber: {
    type: Number,
    required: true,
  },
  workforceSize: {
    type: Number,
    required: true,
  },
  regAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ThirdpartyCompany", thirdpartyCompanySchema);
