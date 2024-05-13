const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const saltRound = 10;
const WORKFORCE = require("../models/workforceModel");
const WORKFORCEWORKINGTRACK = require("../models/workforceWorkingSchema");
const WorkingLocation = require("../models/workingLocationSchema");
const addWorkforce = async (req, res) => {
  try {
    const employeeId = req.body?.employeeId;
    const name = req.body?.fullName;
    const dateOfBirth = req.body?.dateOfBirth;
    const dateOfHire = req.body?.dateOfHire;
    const jobTitle = req.body?.jobTitle;
    const paymentPerHour = parseInt(req.body?.paymentPerHour);
    const contact = req.body?.contact;
    const collectionRoute = req.body?.collectionRoute;
    const wardNumber = parseInt(req.body?.wardNumber);
    const managerId = req.body?.managerId;
    const email = req.body?.email;
    const password = req.body?.password;
    const query = { $or: [{ email: email }, { employeeId: employeeId }] };
    const existingUser = await WORKFORCE.findOne(query);
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    } else {
      const hashPassword = await bcrypt.hash(password, saltRound);
      const filename = req.file ? req.file.filename : null;
      const workForce = {
        employeeId: employeeId,
        name: name,
        dateOfBirth: dateOfBirth,
        dateOfHire: dateOfHire,
        jobTitle: jobTitle,
        paymentPerHour: paymentPerHour,
        collectionRoute: collectionRoute,
        wardNumber: wardNumber,
        managerId: managerId,
        email: email,
        contact: contact,
        password: hashPassword,
        role: "workforce",
        avatar: filename,
      };
      await WORKFORCE.create(workForce);
      res.status(201).json({
        success: true,
        message: "Workforce created successfully",
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
const startWorking = async (req, res) => {
  try {
    const user = req.session.user;
    if (user?.role === "workforce") {
      console.log(user);
      const currentDate = new Date();
      const dateOnly = new Date(currentDate.toDateString());
      const existingTrack = await WORKFORCEWORKINGTRACK.findOne({
        employeeId: user?.employeeId,
        date: dateOnly,
      });
      if (existingTrack) {
        existingTrack.startWorking = Date.now();
        existingTrack.finishWorking = null;
        await existingTrack.save();
        res.status(200).json({ message: "Working Time Started" });
      } else {
        res.status(404).json({ message: "Document not found" });
      }
    }
  } catch (error) {
    console.error("Error :", error);
    logger.error(error.message);
  }
};
const finishWorking = async (req, res) => {
  try {
    const user = req.session.user;
    const currentDate = new Date();
    const dateOnly = new Date(currentDate.toDateString());
    const existingTrack = await WORKFORCEWORKINGTRACK.findOne({
      employeeId: user?.employeeId,
      date: dateOnly,
    });

    if (existingTrack && existingTrack.startWorking) {
      const lastStartTime = existingTrack.startWorking;
      const timeDifference = currentDate.getTime() - lastStartTime.getTime();
      const totalHoursWorked =
        timeDifference / (1000 * 60 * 60) + existingTrack.totalHoursWorked;
      if (totalHoursWorked > 8) {
        existingTrack.overtimeHours = totalHoursWorked - 8;
      }
      existingTrack.dutyHours = Math.min(8, totalHoursWorked);
      existingTrack.totalHoursWorked = totalHoursWorked;
      existingTrack.finishWorking = Date.now();
      existingTrack.startWorking = null;
      await existingTrack.save();
      res.status(201).json({ message: "Break" });
    } else {
      res.status(200).json({ message: "SORRY Start First" });
    }
  } catch (error) {
    console.error("Error :", error);
    logger.error(error.message);
  }
};
const getWorkingStatus = async (req, res) => {
  try {
    const user = req.session.user;
    const currentDate = new Date();
    const dateOnly = new Date(currentDate.toDateString());
    const existingTrack = await WORKFORCEWORKINGTRACK.findOne({
      employeeId: user?.employeeId,
      date: dateOnly,
    });
    if (existingTrack?.startWorking) {
      res.json({
        isWorking: true,
        finishWorking: existingTrack.finishWorking,
        startWorking: existingTrack.startWorking,
      });
    } else {
      res.json({
        isWorking: false,
        finishWorking: existingTrack.finishWorking,
        startWorking: existingTrack.startWorking,
      });
    }
  } catch (error) {
    logger.error(error.message);
  }
};
const addWorkingLocation = async (req, res) => {
  try {
    const { employeeId, latitude, longitude } = req.body;

    const newWorkingLocation = new WorkingLocation({
      employeeId,
      coordinates: [{ latitude, longitude }],
    });

    await newWorkingLocation.save();

    res.status(201).json({ message: "Working location added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  addWorkforce,
  startWorking,
  finishWorking,
  getWorkingStatus,
  addWorkingLocation,
};
