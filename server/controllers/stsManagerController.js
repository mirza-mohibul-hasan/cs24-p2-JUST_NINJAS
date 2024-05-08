const STSVehicleEntry = require("../models/stsVehicleEntryModel");
const STS = require("../models/stsModel");
const STSVehicle = require("../models/stsVehicleModel");
const Vehicle = require("../models/vehicleModel");
const fleetOptimizer = require("../utils/fleetOptimizer");
const findFleetVehicles = require("../utils/findFleetVehicles");
const calculateGPSDistance = require("../utils/calculateGPSDistance");
const Landfill = require("../models/landfillModel");
const { Worker } = require("worker_threads");
const path = require("path");
const logger = require("../config/logger");
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
  try {
    const stsId = req.params.stsId;
    const wasteNeedToShift = req.params.wasteNeedToShift;
    const targetSTS = await STSVehicle.findOne({ stsId: stsId });
    const vehiclesInfo = await Vehicle.find({
      vehicleId: { $in: targetSTS.vehicles },
    });
    const worker = new Worker(
      path.resolve(__dirname, "../utils/fleetOptimizerWorker.js")
    );
    worker.postMessage({
      vehicles: vehiclesInfo,
      totalWaste: wasteNeedToShift,
    });
    worker.on("message", async (usedVehicle) => {
      try {
        const usedVehicleInfo = await findFleetVehicles(usedVehicle);
        res.send(usedVehicleInfo);
      } catch (error) {
        logger.error("Error finding fleet vehicles:", error.message);
        console.error("Error finding fleet vehicles:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while finding fleet vehicles",
        });
      }
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
      res.status(500).json({
        success: false,
        message: "An error occurred while optimizing fleet",
      });
    });
  } catch (error) {
    console.error("Error calculating fleet:", error);
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
