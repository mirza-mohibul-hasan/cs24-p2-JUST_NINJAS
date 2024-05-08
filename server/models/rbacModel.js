const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Permission",
    },
  ],
});
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
});
const Role = mongoose.model("Role", roleSchema);
const Permission = mongoose.model("Permission", permissionSchema);

module.exports = { Role, Permission };
