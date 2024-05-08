const STSVehicleEntry = require("../models/stsVehicleEntryModel");
const STS = require("../models/stsModel");
const STSVehicle = require("../models/stsVehicleModel");
const Vehicle = require("../models/vehicleModel");
const fleetOptimizer = require("../utils/fleetOptimizer");
const findFleetVehicles = require("../utils/findFleetVehicles");
const calculateGPSDistance = require("../utils/calculateGPSDistance");
const Landfill = require("../models/landfillModel");
const addVehicleEntry = async (req, res) => {
  try {
    const stsId = req.body?.stsId;
    const timeOfArrival = req.body?.timeOfArrival;
    const timeOfDeparture = req.body?.timeOfDeparture;
    const vehicleId = req.body?.vehicleId;
    const weightOfWaste = req.body?.weightOfWaste;
    const stsEntryId = req.body?.stsEntryId;
    const addedBy = req.body?.addedBy;
    const newEntry = {
      vehicleId: vehicleId,
      stsId: stsId,
      timeOfArrival: timeOfArrival,
      timeOfDeparture: timeOfDeparture,
      weightOfWaste: weightOfWaste,
      stsEntryId: stsEntryId,
      addedBy: addedBy,
      regAt: new Date(),
    };
    const result = await STSVehicleEntry(newEntry).save();
    res.status(201).json({
      success: true,
      message: "Added Successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error Adding vehicle:", error);
    res.status(500).json({
      success: true,
      message: "An error occurred while creating sts vehicle entry",
    });
  }
};
const optimizedFleet = async (req, res) => {
  const stsId = req.params.stsId;
  const wasteNeedToShift = req.params.wasteNeedToShift;
  const targetSTS = await STSVehicle.findOne({
    stsId: stsId,
  });
  // console.log("TARGET STS", targetSTS);
  const stsInfo = await STS.findOne({
    stsId: stsId,
  });
  // console.log("STS ALL INFO", stsInfo);
  const vehiclesInfo = await Vehicle.find({
    vehicleId: { $in: targetSTS.vehicles },
  });
  // console.log("TARGET STS VEHICLE", vehiclesInfo);

  const vehicleUsed = fleetOptimizer(vehiclesInfo, wasteNeedToShift);
  // console.log("Vehicle USED", vehicleUsed);
  const usedVehicleInfo = await findFleetVehicles(vehicleUsed);
  // console.log("USED VEHICLES", usedVehicleInfo);
  res.send(usedVehicleInfo);
  try {
  } catch (error) {
    console.error("Errorcal;culating fleet:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while calculating",
    });
  }
};
const routeView = async (req, res) => {
  const stsInfo = await STS.findOne({ stsId: req.params.stsId });
  // console.log("STS", stsInfo);
  const allLandfill = await Landfill.find();
  // console.log("LANDFILLS", allLandfill);
  // const from = { latitude: stsInfo.latitude, longitude: stsInfo.longitude };
  // console.log(from);
  let minDistance = Number.MAX_VALUE;
  // console.log(minDistance);
  let targetLanfillId = null;
  for (const landfill of allLandfill) {
    const distance = await calculateGPSDistance(
      stsInfo?.latitude,
      stsInfo?.longitude,
      landfill?.latitude,
      landfill?.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      targetLanfillId = landfill?.landfillId;
    }
  }
  // console.log(targetLanfillId);
  const landfillInfo = await Landfill.findOne({
    landfillId: targetLanfillId,
  });
  const optRoute = {
    allLandfill: allLandfill,
    from: stsInfo,
    to: landfillInfo,
  };
  res.send(optRoute);
};
module.exports = { addVehicleEntry, optimizedFleet, routeView };
