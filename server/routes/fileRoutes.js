const express = require("express");
const router = express.Router();
const { getProfileImage } = require("../controllers/fileController");

router.get("/profilepic/:imageName", getProfileImage);

module.exports = router;
