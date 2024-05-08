const { Role, Permission } = require("../models/rbacModel");
const createRole = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Please provide a role name" });
  }

  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const role = new Role({ name });
    await role.save();
    res.status(201).json({
      success: true,
      message: "Role created successfully",
    });
  } catch (err) {
    console.error("Error creating role:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (err) {
    console.error("Error getting roles:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const createPermission = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ message: "Please provide a permission name" });
  }

  try {
    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(409).json({ message: "Permission already exists" });
    }

    const permission = new Permission({ name, description });
    await permission.save();
    res.json(permission);
  } catch (err) {
    console.error("Error creating permission:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const assignPermissions = async (req, res) => {
  const { roleId } = req.params;
  const permissionIds = req.body;
  if (!roleId || !permissionIds || !permissionIds.length) {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  try {
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length !== permissionIds.length) {
      return res.status(400).json({ message: "Some permissions not found" });
    }

    const existingPermissionIds = role.permissions.map((p) => p._id.toString());
    const newPermissions = permissions.filter(
      (p) => !existingPermissionIds.includes(p._id.toString())
    );

    if (!newPermissions.length) {
      return res
        .status(409)
        .json({ message: "All permissions already exist in the role" });
    }

    role.permissions.push(...newPermissions);
    await role.save();
    res.json({ success: true, message: "Successfully Assigned", role: role });
  } catch (err) {
    console.error("Error assigning permission to role:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRole,
  getRoles,
  createPermission,
  getPermissions,
  assignPermissions,
};
