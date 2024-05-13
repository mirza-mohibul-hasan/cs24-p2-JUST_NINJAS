const ThirdpartyCompany = require("../models/thirdpartyCompanySchema");
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const saltRound = 10;
const CONTRACTORMANAGER = require("../models/contractorManagerModel");
const addThirdpartyCompany = async (req, res) => {
  try {
    const data = req.body;
    const query = { registrationId: data?.registrationId };
    const existing = await ThirdpartyCompany.findOne(query);
    if (existing) {
      return res.json({
        success: false,
        message: "Comapny already exists",
      });
    } else {
      const result = new ThirdpartyCompany(data);
      const response = await result.save();
      console.log(response);
      res.status(201).json({
        success: true,
        message: "Added Successfully",
      });
    }
  } catch (error) {
    console.error("Error Adding Thirdparty Company:", error);
    logger.error(error.message);
    res.status(500).json({
      success: true,
      message: "An error occurred while Adding Thirdparty Company",
    });
  }
};
const allThirdpartyCompany = async (req, res) => {
  try {
    const result = await ThirdpartyCompany.find();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error Finding all thirdparty:", error);
    logger.error(error.message);
  }
};
/* Create Contractor Manager */
const addContractorManager = async (req, res) => {
  try {
    const name = req.body?.fullName;
    const email = req.body?.email;
    const contact = req.body?.contact;
    const assignedCompany = req.body?.assignedCompany;
    const accessLevel = req.body?.accessLevel;
    const userName = req.body?.userName;
    const password = req.body?.password;
    const query = { $or: [{ email: email }, { userName: userName }] };
    const existingUser = await CONTRACTORMANAGER.findOne(query);
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    } else {
      const userId =
        userName + Math.floor(10000 + Math.random() * 90000).toString();
      const hashPassword = await bcrypt.hash(password, saltRound);
      const filename = req.file ? req.file.filename : null;
      const user = {
        fullName: fullName,
        userId: userId,
        email: email,
        createdAt: new Date(),
        contact: contact,
        assignedCompany: assignedCompany,
        accessLevel: accessLevel,
        userName: userName,
        password: hashPassword,
        role: "contractormanager",
        avatar: filename,
      };
      await CONTRACTORMANAGER.create(user);
      res.status(201).json({
        success: true,
        message: "Contractor Manager created successfully",
      });
    }
  } catch (error) {
    console.error("Error creating contractor manager:", error);
    logger.error("Error creating contractor manager:", error.message);
    res.status(500).json({
      success: true,
      message: "An error occurred while creating the user",
    });
  }
};
module.exports = {
  addThirdpartyCompany,
  allThirdpartyCompany,
  addContractorManager,
};
