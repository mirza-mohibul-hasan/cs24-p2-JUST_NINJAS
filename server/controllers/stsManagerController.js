const STSVehicleEntry = require("../models/stsVehicleEntryModel");
const STS = require("../models/stsModel");
const STSVehicle = require("../models/stsVehicleModel");
const STSManager = require("../models/stsmanagerModel");
const ThirdpartyCompany = require("../models/thirdpartyCompanySchema");
const Vehicle = require("../models/vehicleModel");
const fleetOptimizer = require("../utils/fleetOptimizer");
const STSWasteCollection = require("../models/stsWasteCollectionSchema");
const findFleetVehicles = require("../utils/findFleetVehicles");
const calculateGPSDistance = require("../utils/calculateGPSDistance");
const Landfill = require("../models/landfillModel");
const STSBill = require("../models/stsBillSchema");
const { Worker } = require("worker_threads");
const path = require("path");
const logger = require("../config/logger");
const addVehicleExit = async (req, res) => {
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
      vehicleId: { $in: targetSTS?.vehicles },
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
const getDetailsForVehicleEntry = async (req, res) => {
  try {
    const managerId = req.params.managerId;

    const { stsId } = await STSManager.findOne({ managers: managerId })
      .select("stsId")
      .lean();
    const [stsInfo, contractorsInfo] = await Promise.all([
      STS.findOne({ stsId }).lean(),
      ThirdpartyCompany.find({ designatedSts: stsId }).lean(),
    ]);

    res.send({ stsInfo, contractorsInfo });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
const addVehicleEntry = async (req, res) => {
  try {
    const result = await STSWasteCollection(req.body).save();
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
const calculateBills = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split("T")[0];
    const result = await STSWasteCollection.find({
      contractorId: req.params.contractorId,
      timeDate: {
        $gte: new Date(currentDateStr),
        $lt: new Date(currentDateStr + "T23:59:59Z"),
      },
    });
    const Wc =
      result?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.wasteCollectedKg;
      }, 0) / 1000;
    const contractorDetails = await ThirdpartyCompany.findOne({
      registrationId: req.params.contractorId,
    });
    const stsDetails = await STS.findOne({
      stsId: contractorDetails?.designatedSts,
    });
    const reqAmountWastePerDay = contractorDetails?.reqAmountWastePerDay;
    const paymentPerTonWaste = contractorDetails?.paymentPerTonWaste;
    const fineRate = stsDetails.fineRate;
    const basicPay = Wc * paymentPerTonWaste;
    const deficit = Math.max(0, reqAmountWastePerDay - Wc);
    const contractorFine = deficit * fineRate;
    const totalBill = basicPay - contractorFine;
    await STSBill.create({
      stsId: stsDetails?.stsId,
      contractorId: req.params.contractorId,
      fineRate,
      basicPay,
      deficit,
      contractorFine,
      totalBill,
      date: new Date(),
    });
    res.json({
      stsId: stsDetails?.stsId,
      contractorId: req.params.contractorId,
      fineRate,
      basicPay,
      deficit,
      contractorFine,
      totalBill,
      date: new Date(),
    });
  } catch (error) {
    console.error("Error generating Bills:", error);
    logger.error(error.message);
  }
};
module.exports = {
  addVehicleExit,
  optimizedFleet,
  routeView,
  getDetailsForVehicleEntry,
  addVehicleEntry,
  calculateBills,
};
