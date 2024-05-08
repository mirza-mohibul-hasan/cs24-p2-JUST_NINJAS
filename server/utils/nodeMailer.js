const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.HOST_MAIL_PASS,
  },
});

module.exports = transporter;
