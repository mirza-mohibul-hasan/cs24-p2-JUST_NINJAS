const mongoose = require("mongoose");
const stsmanagerSchema = new mongoose.Schema({
  stsId: String,
  managers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("STSManager", stsmanagerSchema);
