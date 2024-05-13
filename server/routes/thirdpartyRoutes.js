const express = require("express");
const verifyJWT = require("../middlewares/jwtMiddleware");
const router = express.Router();
const thirdpartyController = require("../controllers/thirdpartyController");
const { upload } = require("../utils/multerUtils");
router.post(
  "/add-thirdparty",
  verifyJWT,
  thirdpartyController.addThirdpartyCompany
);
router.get("/all-thirdparty", thirdpartyController.allThirdpartyCompany);
router.post(
  "/add-contractor-manager",
  upload.single("avatar"),
  thirdpartyController.addContractorManager
);
module.exports = router;
