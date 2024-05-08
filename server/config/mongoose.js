// mongoose.js
const mongoose = require("mongoose");
const logger = require("./logger");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
async function connectToMongoDB() {
  try {
    const conection = await mongoose.connect(`${process.env.DB_URL}`);
    // console.log(conection);
    console.log("MongoDB Connected");
    logger.info("MongoDB Connected");

    const adminUser = await User.findOne({
      email: "ecosyncninjas@gmail.com",
      role: "sysadmin",
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("Asdfg", 10);
      const newAdminUser = new User({
        name: "Admin",
        email: "ecosyncninjas@gmail.com",
        nid: "1901191901017",
        address: "Dept. of CSE, JUST",
        password: hashedPassword,
        role: "sysadmin",
        avatar: "admin.jpg",
      });

      await newAdminUser.save();
      console.log("Admin user created");
      logger.info("Admin user created");
    }
  } catch (error) {
    logger.error("MongoDB Connection Error:");
    console.error("MongoDB Connection Error:", error);

    process.exit(1);
  }
}

module.exports = connectToMongoDB;
