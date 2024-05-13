const Landfill = require("../models/landfillModel");
const User = require("../models/userModel");
const LandfillManager = require("../models/landfillmanagerModel");
const createLandfill = async (req, res) => {
  try {
    const landfillId = req.body?.landfillId;
    const addedBy = req.body?.addedBy;
    const capacity = req.body?.capacity;
    const latitude = req.body?.latitude;
    const longitude = req.body?.longitude;
    const starttime = req.body?.starttime;
    const endtime = req.body?.endtime;
    const areaName = req.body?.areaName;
    const landfill = {
      landfillId: landfillId,
      capacity: capacity,
      latitude: latitude,
      longitude: longitude,
      starttime: starttime,
      endtime: endtime,
      addedBy: addedBy,
      areaName: areaName,
      regAt: new Date(),
    };
    const newLandfill = new Landfill(landfill);
    const result = await newLandfill.save();
    res.status(201).json({
      success: true,
      message: "Added Successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error Adding vehicle:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user",
    });
  }
};
// All Landfill available in database
const allLandfill = async (req, res) => {
  try {
    const landfill = await Landfill.find();
    res.send(landfill);
  } catch (error) {
    console.error("Error fetching Landfill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// all assigned landfill managers
const assignedLandfillManagers = async (req, res) => {
  try {
    const result = await LandfillManager.find();
    res.send(result);
  } catch (error) {
    console.error("Error fetching assigned landfill managers:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while fetching assigned landfill managers.",
      error: error.message,
    });
  }
};
// specific landfill managers
const specificLandfillManagers = async (req, res) => {
  try {
    const result = await LandfillManager.findOne({
      landfillId: req.params.landfillId,
    });
    if (!result) {
      return res.send([]);
    }
    const managerIds = result.managers;
    const managersInfo = await User.find({ _id: { $in: managerIds } });

    res.send(managersInfo);
  } catch (error) {
    console.error("Error fetching manager information:", error);
    res.status(500).send("Internal server error");
  }
};

const availailableLandfillManager = async (req, res) => {
  try {
    let managerIds = [];
    const assignedLandfillManagers = await LandfillManager.find();
    assignedLandfillManagers.forEach((doc) => {
      managerIds = [...managerIds, ...doc.managers];
    });
    const managersNotInLandfillManager = await User.find({
      _id: { $nin: managerIds },
      role: "landmanager",
    });

    res.send(managersNotInLandfillManager);
  } catch (error) {
    console.error(
      "Error fetching landmanager not in landmanagerCollection:",
      error
    );
    res.status(500).send("Internal server error");
  }
};

// assign manager to Landfill
const assignLandfillManager = async (req, res) => {
  const landfillId = req.body.landfillId;
  const managerId = req.body.managerId;
  const query = { landfillId: landfillId };
  const existing = await LandfillManager.findOne(query);
  if (existing) {
    const result = await LandfillManager.updateOne(
      { landfillId: landfillId },
      { $addToSet: { managers: managerId } }
    );
    res.send({
      success: true,
      message: "Manager added successfully.",
      result,
    });
  } else {
    const newLandfill = new LandfillManager({
      landfillId: landfillId,
      managers: [managerId],
    });
    const result = await newLandfill.save();
    res.send({
      success: true,
      message: "Manager added successfully.",
      result,
    });
  }
};
// // Remove a manager from sts
const removeLandfillManager = async (req, res) => {
  const { landfillId, managerId } = req.body;
  try {
    const landfilExists = await LandfillManager.findOne({
      landfillId: landfillId,
    });
    if (!landfilExists) {
      return res.send({ message: "Landfill not found." });
    }
    const updatedLandfill = await LandfillManager.updateOne(
      { landfillId: landfillId },
      { $pull: { managers: managerId } }
    );
    if (updatedLandfill.modifiedCount > 0) {
      res.status(200).send({
        success: true,
        message: "Manager removed successfully.",
        result: updatedLandfill,
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
module.exports = {
  createLandfill,
  allLandfill,
  assignedLandfillManagers,
  specificLandfillManagers,
  availailableLandfillManager,
  assignLandfillManager,
  removeLandfillManager,
};
