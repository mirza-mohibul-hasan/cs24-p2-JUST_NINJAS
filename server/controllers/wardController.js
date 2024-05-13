const ThirdpartyCompany = require("../models/thirdpartyCompanySchema");
const logger = require("../config/logger");
const WARD = require("../models/wardModel");
const STS = require("../models/stsModel");
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
// Specific Ward
const specificWard = async (req, res) => {
  try {
    const assignedCompanyRegistrationId = req.params?.assignedCompany;
    const assignedCompanyDetails = await ThirdpartyCompany.findOne(
      { registrationId: assignedCompanyRegistrationId || null },
      { designatedSts: 1 }
    ).lean();
    const stsInfo = await STS.findOne(
      { stsId: assignedCompanyDetails?.designatedSts },
      { ward_num: 1 }
    ).lean();
    const wardInfo = await WARD.findOne(
      { wardNumber: stsInfo?.ward_num },
      { _id: 0 }
    ).lean();

    res.status(200).json(wardInfo);
  } catch (error) {
    console.error("Error Finding all wards:", error);
    logger.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  allWards,
  specificWard,
};
