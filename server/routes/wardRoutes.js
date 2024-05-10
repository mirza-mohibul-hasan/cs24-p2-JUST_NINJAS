const express = require("express");
const router = express.Router();
const wardController = require("../controllers/wardController");
// const verifyJWT = require("../middlewares/jwtMiddleware");
// const verifyAdmin = require("../middlewares/adminMiddleware");
router.get("/all-wards", /* verifyJWT, verifyAdmin, */ wardController.allWards);
module.exports = router;
