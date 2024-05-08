const Landfill = require("../models/landfillModel");
const User = require("../models/userModel");
const LandfillManager = require("../models/landfillmanagerModel");
const LandfillVehicleEntry = require("../models/landfillVehicleEntryModel");
const Billing = require("../models/billingModel");
const Vehicle = require("../models/vehicleModel");
const STS = require("../models/stsModel");
const STSManager = require("../models/stsmanagerModel");
const STSVehicle = require("../models/stsVehicleModel");
// utils
const calculateCostPerKm = require("../utils/calculateCostPerKm");
const calculateGPSDistance = require("../utils/calculateGPSDistance");

//landfill info for manger
const landfillInfoSpecificManager = async (req, res) => {
  const managerId = req.params.managerId;
  try {
    const managerInfo = await LandfillManager.findOne({
      managers: managerId,
    });
    const landfillInfo = await Landfill.findOne({
      landfillId: managerInfo?.landfillId,
    });
    const trucks = await Vehicle.find();
    res.send({ managerInfo, landfillInfo, trucks });
  } catch (error) {
    console.error("Error checking manager ID:", error);
    res.status(500).send("Internal server error");
  }
};
const addVehicleEntry = async (req, res) => {
  try {
    const landfillId = req.body?.landfillId;
    const vehicleId = req.body?.vehicleId;
    const timeOfArrival = req.body?.timeOfArrival;
    const timeOfDeparture = req.body?.timeOfDeparture;
    const weightOfWaste = req.body?.weightOfWaste;
    const landfillEntryId = req.body?.landfillEntryId;
    const addedBy = req.body?.addedBy;
    const newEntry = {
      landfillId: landfillId,
      vehicleId: vehicleId,
      timeOfArrival: timeOfArrival,
      timeOfDeparture: timeOfDeparture,
      weightOfWaste: weightOfWaste,
      landfillEntryId: landfillEntryId,
      addedBy: addedBy,
      regAt: new Date(),
    };
    // console.log(newEntry);
    const targetSTS = await STSVehicle.findOne({ vehicles: vehicleId });
    const stsInfo = await STS.findOne({ stsId: targetSTS?.stsId });
    const landfillInfo = await Landfill.findOne({ landfillId: landfillId });
    const vehicleInfo = await Vehicle.findOne({ vehicleId: vehicleId });
    // console.log("TaRGET sts Informat", targetSTS);
    // console.log("STS Informat", stsInfo);
    // console.log("landfill info", landfillInfo);
    // console.log("VehicleInfo info", vehicleInfo);
    const distance = await calculateGPSDistance(
      stsInfo?.latitude,
      stsInfo?.longitude,
      landfillInfo?.latitude,
      landfillInfo?.longitude
    );
    const costPerKm = await calculateCostPerKm(
      weightOfWaste,
      vehicleInfo?.capacity,
      vehicleInfo?.fuel_cost_loaded,
      vehicleInfo?.fuel_cost_unloaded
    );
    const fuelAllocation = costPerKm * distance;
    // console.log("Distance", distance);
    // console.log("Cost Per KM", costPerKm);
    // console.log("Oil Allocation TK", fuelAllocation);
    // const { _id, ...vehicleInfoWithoutId } = vehicleInfo;
    // console.log("VehicleInfo", vehicleInfoWithoutId);
    const bill = {
      billTime: Date.now(),
      weightOfWaste,
      vehicleInfo,
      distance,
      costPerKm,
      fuelAllocation,
      stsId: stsInfo?.stsId,
      landfillId: landfillId,
      billedBy: addedBy,
      areaName: landfillInfo?.areaName,
    };
    await LandfillVehicleEntry.create(newEntry);
    await Billing.create(bill);
    res.status(201).json({
      success: true,
      message: "Added Successfully with Billing",
    });
  } catch (error) {
    console.error("Error Adding vehicle:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating",
    });
  }
};
const specidficLandfillBills = async (req, res) => {
  try {
    const landfillId = req.params.landfillId;
    const bills = await Billing.find({ landfillId: landfillId });
    res.send(bills);
  } catch (error) {
    console.error("Error Adding vehicle:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating",
    });
  }
};
module.exports = {
  landfillInfoSpecificManager,
  addVehicleEntry,
  specidficLandfillBills,
};
