const express = require("express");
const router = express.Router();
const stsManagerController = require("../controllers/stsManagerController");
router.post("/add-entry", stsManagerController.addVehicleEntry);
router.get(
  "/fleet-opt/:stsId/:wasteNeedToShift",
  stsManagerController.optimizedFleet
);
router.get("/route-view/:stsId", stsManagerController.routeView);
module.exports = router;
