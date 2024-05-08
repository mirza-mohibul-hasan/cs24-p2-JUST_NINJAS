const express = require("express");
const router = express.Router();
const rbacController = require("../controllers/rbacController");
router.post("/roles", /* verifyJWT*/ rbacController.createRole);
router.get("/roles", /* verifyJWT, verifyAdmin */ rbacController.getRoles);
router.post("/permissions", /* verifyJWT*/ rbacController.createPermission);
router.get(
  "/permissions",
  /* verifyJWT, verifyAdmin */ rbacController.getPermissions
);
router.put(
  "/roles/:roleId/permissions",
  /* verifyJWT, verifyAdmin */ rbacController.assignPermissions
);
module.exports = router;
