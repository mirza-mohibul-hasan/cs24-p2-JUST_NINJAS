const express = require("express");
const router = express.Router();
const workforceController = require("../controllers/workforceController");
const { upload } = require("../utils/multerUtils");
router.post(
  "/register",
  upload.single("avatar"),
  /* verifyJWT, verifyAdmin, */ workforceController.addWorkforce
);
router.post("/start-working", workforceController.startWorking);
router.post("/finish-working", workforceController.finishWorking);
router.get("/working-status", workforceController.getWorkingStatus);
router.post("/working-location", workforceController.addWorkingLocation);
module.exports = router;
