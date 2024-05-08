const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const verifyJWT = require("../middlewares/jwtMiddleware");
router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);
module.exports = router;
