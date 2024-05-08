const express = require("express");
const router = express.Router();
const stsController = require("../controllers/stsController");
router.get("/", stsController.allSTS);
router.post("/add", stsController.createSTS);
router.get(
  "/assignedstsmanager/:stsId",
  stsController.specificSTSAssignedManagers
);
router.get("/availablestsmanager", stsController.availablSTSManager);
router.get("/manager-info/:managerId", stsController.isSTSManager);
// SINGLE STS Details
router.get("/single-info/:stsId", stsController.specificSTSDetails);
router.post("/assign-manager", stsController.assignSTSManager);
router.delete("/remove-manager", stsController.removeManagerFromSTS);

// STS Vehicle management
router.post("/assign-vehicle", stsController.assignVehicleToSTS);
router.get("/vehicles", stsController.allSTSAssignedVehicles);
router.get("/assigned-vehicle/:stsId", stsController.specificSTSVehicle);
router.get("/available-vehicles", stsController.availableVehicle);
router.delete("/remove-vehicle", stsController.removeVehicleFromSTS);
module.exports = router;
