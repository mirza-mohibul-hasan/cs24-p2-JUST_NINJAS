const Billing = require("../models/billingModel");
const LandfillVehicleEntry = require("../models/landfillVehicleEntryModel");
const STSVehicleEntry = require("../models/stsVehicleEntryModel");

const dashboardStatistics = async (req, res) => {
  try {
    const billing = await Billing.find();
    const stsWasteTransport = await STSVehicleEntry.find();
    const landfillWasteTransport = await LandfillVehicleEntry.find();

    const totalWeightOfWaste = billing.reduce(
      (total, bill) => total + bill.weightOfWaste,
      0
    );
    const totalWeightAtSTS = stsWasteTransport.reduce(
      (total, entry) => total + entry.weightOfWaste,
      0
    );
    const totalWeightAtLandfill = landfillWasteTransport.reduce(
      (total, entry) => total + entry.weightOfWaste,
      0
    );
    const totalFuelCost = billing.reduce(
      (total, bill) => total + bill.vehicleInfo.fuel_cost_loaded,
      0
    );
    const response = {
      billing,
      stsWasteTransport,
      landfillWasteTransport,
      totalWeightOfWaste,
      totalWeightAtSTS,
      totalWeightAtLandfill,
      totalFuelCost,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { dashboardStatistics };
