const STS = require("../models/stsModel");
const STSManager = require("../models/stsmanagerModel");
const STSVehicle = require("../models/stsVehicleModel");
const User = require("../models/userModel");
const Vehicle = require("../models/vehicleModel");
const createSTS = async (req, res) => {
  try {
    const stsId = req.body?.stsId;
    const addedBy = req.body?.addedBy;
    const capacity = req.body?.capacity;
    const latitude = req.body?.latitude;
    const longitude = req.body?.longitude;
    const fineRate = req.body?.fineRate;
    const ward_num = req.body?.ward_num;
    const sts = {
      stsId: stsId,
      capacity: capacity,
      latitude: latitude,
      longitude: longitude,
      fineRate: fineRate,
      ward_num: ward_num,
      addedBy: addedBy,
      regAt: new Date(),
    };
    const newSTS = new STS(sts);
    const result = await newSTS.save();
    res.status(201).json({
      success: true,
      message: "Added Successfully",
      result: result,
    });
    // }
  } catch (error) {
    console.error("Error Adding STS:", error);
    res.status(500).json({
      success: true,
      message: "An error occurred while creating the STS",
    });
  }
};
const allSTS = async (req, res) => {
  try {
    const sts = await STS.find();
    res.send(sts);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// All assigned Managers
const specificSTSAssignedManagers = async (req, res) => {
  try {
    const result = await STSManager.findOne({
      stsId: req.params.stsId,
    });

    if (!result) {
      return res.send([]);
    }
    const managerIds = result?.managers?.map((managerId) =>
      managerId.toString()
    );
    const managersInfo = await User.find({ _id: { $in: managerIds } });
    res.send(managersInfo);
  } catch (error) {
    console.error("Error fetching manager information:", error);
    res.status(500).send("Internal server error");
  }
};
const availablSTSManager = async (req, res) => {
  try {
    let managerIds = [];
    const stsManagers = await STSManager.find();
    stsManagers.forEach((doc) => {
      managerIds = [...managerIds, ...doc.managers];
    });
    const managerObjectIds = managerIds.map((managerId) =>
      managerId.toString()
    );
    const managersNotInStsManager = await User.find({
      _id: { $nin: managerObjectIds },
      role: "stsmanager",
    });

    res.send(managersNotInStsManager);
  } catch (error) {
    console.error("Error fetching stsmanagers not in sts manager:", error);
    res.status(500).send("Internal server error");
  }
};

// check manager or not
const isSTSManager = async (req, res) => {
  const managerId = req.params.managerId;
  try {
    const managerExists = await STSManager.findOne({
      managers: managerId,
    });
    res.send(managerExists);
  } catch (error) {
    console.error("Error checking manager ID:", error);
    res.status(500).send("Internal server error");
  }
};
// SINGLE STS Details
const specificSTSDetails = async (req, res) => {
  const stsId = req.params.stsId;
  try {
    const result = await STS.findOne({
      stsId: stsId,
    });
    res.send(result);
  } catch (error) {
    console.error("Error checking manager ID:", error);
    res.status(500).send("Internal server error");
  }
};
// assign manager to sts
const assignSTSManager = async (req, res) => {
  try {
    const { stsId, managerId } = req.body;
    if (!stsId || typeof stsId !== "string") {
      return res.status(400).send({
        success: false,
        message: "Invalid",
      });
    }

    if (!managerId || typeof managerId !== "string") {
      return res.status(400).send({
        success: false,
        message: "Invalid",
      });
    }
    const query = { stsId: stsId };
    const result = await STSManager.findOneAndUpdate(
      query,
      { $addToSet: { managers: managerId } },
      { upsert: true, new: true }
    );

    res.send({
      success: true,
      message: "Manager added successfully.",
      result,
    });
  } catch (error) {
    console.error("Error assigning STS manager:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while assigning STS manager.",
      error: error.message,
    });
  }
};
// Remove a manager from sts
const removeManagerFromSTS = async (req, res) => {
  const { stsId, managerId } = req.body;
  try {
    const stsExists = await STSManager.findOne({ stsId: stsId });
    if (!stsExists) {
      return res.send({ success: false, message: "STS not found." });
    }
    const updatedSTS = await STSManager.updateOne(
      { stsId: stsId },
      { $pull: { managers: managerId } }
    );
    if (updatedSTS.modifiedCount > 0) {
      res.status(200).send({
        success: true,
        message: "Manager removed successfully.",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Manager does not exists",
      });
    }
  } catch (error) {
    console.error("Error removing manager ID:", error);
    res.status(500).send("Internal server error");
  }
};

/* Dataentry Endpoints => STS Vehicle Mangement */
// assign Vehicle to sts
const assignVehicleToSTS = async (req, res) => {
  const { stsId, vehicleId } = req.body;
  const existingSTS = await STSVehicle.findOne({ stsId });
  if (existingSTS && existingSTS.vehicles.includes(vehicleId)) {
    return res.status(400).send({
      success: false,
      message: "Vehicle is already assigned to the STS.",
    });
  }
  const query = { stsId: stsId };
  const result = await STSVehicle.findOneAndUpdate(
    query,
    { $addToSet: { vehicles: vehicleId } },
    { upsert: true, new: true }
  );
  res.send({
    success: true,
    message: "Vehicle added successfully.",
    result,
  });
};
// STS Assigned Vehicles
const allSTSAssignedVehicles = async (req, res) => {
  try {
    const result = await STSVehicle.find();
    res.send(result);
  } catch (error) {
    console.error("Error retrieving STS assigned vehicles:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while retrieving STS assigned vehicles.",
      error: error.message,
    });
  }
};

// Specific STS Vehicles
const specificSTSVehicle = async (req, res) => {
  try {
    const result = await STSVehicle.findOne({
      stsId: req.params.stsId,
    });
    if (!result) {
      return res.send([]);
    }
    const vehivleIds = result.vehicles;
    const vehiclesInfo = await Vehicle.find({
      vehicleId: { $in: vehivleIds },
    });

    res.send(vehiclesInfo);
  } catch (error) {
    console.error("Error fetching Vehicle information:", error);
    res.status(500).send("Internal server error");
  }
};
// Available Vehicles for assigning to sts
const availableVehicle = async (req, res) => {
  try {
    let vehiclesIds = [];
    const stsVehicles = await STSVehicle.find();
    for (const doc of stsVehicles) {
      vehiclesIds.push(...doc.vehicles);
    }
    const vehiclessNotInStsVehicles = await Vehicle.find({
      vehicleId: { $nin: vehiclesIds },
    });

    res.send(vehiclessNotInStsVehicles);
  } catch (error) {
    console.error(
      "Error fetching vehicles not in sts vehicle assigned:",
      error
    );
    res.status(500).send("Internal server error");
  }
};

// Remove a vehicle from sts
const removeVehicleFromSTS = async (req, res) => {
  const { stsId, vehicleId } = req.body;
  try {
    const stsExists = await STSVehicle.findOne({ stsId: stsId });
    if (!stsExists) {
      return res.send({ message: "STS not found." });
    }
    const updatedSTS = await STSVehicle.updateOne(
      { stsId: stsId },
      { $pull: { vehicles: vehicleId } }
    );
    if (updatedSTS.modifiedCount > 0) {
      res.status(200).send({
        success: true,
        message: "Vehicle removed successfully.",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Vehicle does not exists",
      });
    }
  } catch (error) {
    console.error("Error removing manager ID:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  createSTS,
  allSTS,
  specificSTSAssignedManagers,
  availablSTSManager,
  isSTSManager,
  specificSTSDetails,
  assignSTSManager,
  removeManagerFromSTS,
  assignVehicleToSTS,
  allSTSAssignedVehicles,
  specificSTSVehicle,
  availableVehicle,
  removeVehicleFromSTS,
};
