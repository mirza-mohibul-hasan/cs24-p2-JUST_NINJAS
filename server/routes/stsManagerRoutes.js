const express = require("express");
const router = express.Router();
const stsManagerController = require("../controllers/stsManagerController");
router.post("/add-vehicle-leave-sts", stsManagerController.addVehicleExit);

router.get(
  "/fleet-opt/:stsId/:wasteNeedToShift",
  stsManagerController.optimizedFleet
);
router.get("/route-view/:stsId", stsManagerController.routeView);

router.get(
  "/details-for-entry/:managerId",
  stsManagerController.getDetailsForVehicleEntry
);
router.post("/add-vehicle-enter-sts", stsManagerController.addVehicleEntry);
router.get(
  "/calculate-bills/:contractorId",
  stsManagerController.calculateBills
);
module.exports = router;
