const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/statistics", dashboardController.dashboardStatistics);

module.exports = router;
