const mongoose = require("mongoose");
const stsVehicleSchema = new mongoose.Schema({
  stsId: {
    type: String,
    required: true,
    unique: true,
  },
  vehicles: {
    type: [
      {
        type: String,
      },
    ],
    ref: "Vehicle",
  },
});

const STSVehicle = mongoose.model("STSVehicle", stsVehicleSchema);
module.exports = STSVehicle;
