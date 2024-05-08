const mongoose = require("mongoose");
const landfillmanagerSchema = new mongoose.Schema({
  landfillId: String,
  managers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("LandfillManager", landfillmanagerSchema);
