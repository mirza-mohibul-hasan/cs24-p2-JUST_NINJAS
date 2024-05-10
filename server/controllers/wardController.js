const ThirdpartyCompany = require("../models/thirdpartyCompanySchema");
const logger = require("../config/logger");
const WARD = require("../models/wardModel");
// All Wards for area
const allWards = async (req, res) => {
  try {
    const result = await WARD.find();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error Finding all wards:", error);
    logger.error(error.message);
  }
};

module.exports = {
  allWards,
};
