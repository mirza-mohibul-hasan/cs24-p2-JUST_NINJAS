const express = require("express");
const router = express.Router();
const landfillController = require("../controllers/landfillController");
router.post("/add", landfillController.createLandfill);
router.get("/all-landfill", landfillController.allLandfill);
router.get(
  "/all-landfill-manager",
  landfillController.assignedLandfillManagers
);
router.get(
  "/assigned-landfill-manager/:landfillId",
  landfillController.specificLandfillManagers
);
router.get(
  "/available-landfill-manager",
  landfillController.availailableLandfillManager
);
router.post("/assign-manager", landfillController.assignLandfillManager);
router.delete("/remove-manager", landfillController.removeLandfillManager);
module.exports = router;
