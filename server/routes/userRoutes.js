const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middlewares/jwtMiddleware");
const verifyAdmin = require("../middlewares/adminMiddleware");
const { upload } = require("../utils/multerUtils");

router.get("/", /* verifyJWT, verifyAdmin, */ userController.allUser);

router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  upload.single("avatar"),
  userController.addUser
);

router.put("/:id", userController.updateUser);
router.delete("/:id", verifyJWT, verifyAdmin, userController.deleteUser);
router.get("/roles", /* verifyJWT, */ userController.userRoles);
router.put("/:id/roles", /* verifyJWT, verifyAdmin*/ userController.updateRole);
router.get("/:id", userController.specificUser);
module.exports = router;
