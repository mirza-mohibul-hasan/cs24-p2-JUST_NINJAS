const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const transporter = require("../utils/nodeMailer");
const generateOTP = require("../utils/generateOTP");
const logger = require("../config/logger");
const WORKFORCE = require("../models/workforceModel");
const saltRound = 10;
const CONTRACTORMANAGER = require("../models/contractorManagerModel");
const WORKFORCEWORKINGTRACK = require("../models/workforceWorkingSchema");
// Login
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    const existingContractor = await CONTRACTORMANAGER.findOne({ email });
    const existingWorkforce = await WORKFORCE.findOne({ email });
    const user = existingUser || existingContractor || existingWorkforce;
    if (user?.role === "unassigned") {
      return res.json({
        success: false,
        message: "You don't have permission to Login",
      });
    }
    if (user) {
      bcrypt.compare(password, user.password, async (error, response) => {
        if (error) {
          console.log("Login error in bcrypt", error);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (response) {
          const id = user._id.toString();
          const token = jwt.sign({ id }, "jwtSecret", {
            expiresIn: "24h",
          });
          req.session.user = user;
          if (user?.role === "workforce") {
            // console.log(user);
            const currentDate = new Date();
            const dateOnly = new Date(currentDate.toDateString());
            const existingTrack = await WORKFORCEWORKINGTRACK.findOne({
              employeeId: user?.employeeId,
              date: dateOnly,
            });
            if (existingTrack) {
              existingTrack.logInTime.push(Date.now());
              (existingTrack.finishWorking = null), await existingTrack.save();
            } else {
              const newTrack = new WORKFORCEWORKINGTRACK({
                employeeId: user?.employeeId,
                date: dateOnly,
                absences: false,
                logInTime: [Date.now()],
              });
              await newTrack.save();
            }
          }
          logger.info("Login Successfull");
          res.status(200).json({
            success: true,
            token: token,
            message: "User Login successfully",
          });
        } else {
          res.json({
            success: false,
            message: "Wrong password",
          });
        }
      });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    logger.error("Error logging in user:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Logout
const handleLogout = async (req, res) => {
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
    if (existingTrack.startWorking) {
      existingTrack.finishWorking = Date.now();
      existingTrack.startWorking = null;
    }
  }
  existingTrack?.logOutTime.push(Date.now());
  await existingTrack?.save();

  req.session.destroy((err) => {
    if (err) {
      res.send({ success: false, message: "Logout Failed" });
    } else {
      res.clearCookie("userId");
      res.json({ success: true, message: "Logout successful" });
    }
  });
};
const handleResetInitiate = async (req, res) => {
  const email = req.body?.email;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.json({ success: false, message: "User not found" });
  }
  const { otp, otpTimestamp } = generateOTP();
  // console.log(otp, otpTimestamp);
  req.session.resetEmail = email;
  req.session.otp = otp;
  req.session.otpTimestamp = otpTimestamp;
  // console.log(req.session);
  const mailOptions = {
    from: "ecosyncninjas@gmail.com",
    to: email,
    subject: "EcoSync Password Reset OTP",
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #007bff;
          }
          p {
            margin-bottom: 20px;
          }
          .otp-code {
            background-color: #007bff;
            color: #fff;
            font-size: 24px;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hi there!</h1>
          <p>We received a request to reset your EcoSync password. To proceed, please use the OTP provided below:</p>
          <div class="otp-code">${otp}</div>
          <p>If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
          <p>Thank you,<br/>The EcoSync Team</p>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send OTP email" });
    } else {
      console.log("Email sent: " + info.response);
      // console.log(req.session);
      res.json({ success: true, message: "OTP sent successfully" });
    }
  });
};
const handleResetConfirm = async (req, res) => {
  const { resetEmail, otp: storedOTP, otpTimestamp } = req.session;
  const newPassword = req.body?.newpassword;
  const currentTime = Date.now(); // Current time in milliseconds
  const timeDifference = currentTime - otpTimestamp;
  const timeThreshold = 60 * 1000;
  if (timeDifference > timeThreshold) {
    delete req.session.resetEmail;
    delete req.session.otp;
    delete req.session.otpTimestamp;
    return res.json({ success: false, message: "OTP has expired" });
  }
  //   console.log(
  //     resetEmail,
  //     req.body?.email,
  //     storedOTP,
  //     req.body?.otp,
  //     newPassword
  //   );
  if (resetEmail === req.body?.email && storedOTP === req.body?.otp) {
    try {
      const hash = await bcrypt.hash(newPassword, saltRound);
      const result = await User.updateOne(
        { email: resetEmail },
        { $set: { password: hash } }
      );

      if (result.modifiedCount === 0) {
        return res.json({
          success: false,
          message: "Password reset failed",
        });
      }

      delete req.session.resetEmail;
      delete req.session.otp;

      return res
        .status(200)
        .json({ success: true, message: "Password reset successful" });
    } catch (error) {
      console.error("Error updating password:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error updating password" });
    }
  } else {
    return res.json({ success: false, message: "Invalid email or OTP" });
  }
};
const handleChangePassword = async (req, res) => {
  try {
    const oldpassword = req.body?.oldpassword;
    const newpassword = req.body?.newpassword;
    const email = req.session?.user?.email;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const match = await bcrypt.compare(oldpassword, existingUser.password);
      if (match) {
        const hash = await bcrypt.hash(newpassword, saltRound);
        const result = await User.updateOne(
          { email: email },
          { $set: { password: hash } }
        );

        if (result.modifiedCount === 0) {
          return res.json({
            success: false,
            message: "Password change failed",
          });
        }
        req.session.user.password = hash;
        return res
          .status(200)
          .json({ success: true, message: "Password change successful" });
      } else {
        return res.json({
          success: false,
          message: "Old password is incorrect",
        });
      }
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleResetInitiate,
  handleResetConfirm,
  handleChangePassword,
};
