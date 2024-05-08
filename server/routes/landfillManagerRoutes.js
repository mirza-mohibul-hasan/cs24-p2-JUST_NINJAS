const express = require("express");
const router = express.Router();
const landfillManagerController = require("../controllers/landfillManagerController");

router.get(
  "/landfill-info/:managerId",
  landfillManagerController.landfillInfoSpecificManager
);
router.post("/add-entry", landfillManagerController.addVehicleEntry);
router.get(
  "/billing/:landfillId",
  landfillManagerController.specidficLandfillBills
);
module.exports = router;
