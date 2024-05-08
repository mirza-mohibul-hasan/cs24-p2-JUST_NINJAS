const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyJWT = require("../middlewares/jwtMiddleware");
/* Authentication Endpoints     */
// Login
router.post("/login", authController.handleLogin);

// Logout
router.get("/logout", authController.handleLogout);

// reset password initiate
router.post("/reset-password/initiate", authController.handleResetInitiate);

// reset password initiate
router.post("/reset-password/confirm", authController.handleResetConfirm);

// Chnage password
router.put("/change-password", verifyJWT, authController.handleChangePassword);

module.exports = router;
