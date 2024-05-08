const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

router.get(
  "/all-bills",
  /* verifyJWT, verifyAdmin, */ billingController.allBills
);

module.exports = router;
