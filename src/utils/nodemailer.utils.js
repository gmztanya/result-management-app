/**
 * reference - https://www.youtube.com/watch?v=lBRnLXwjLw0&t=7s
 */
const config = require("config");
const nodemailer = require("nodemailer");
const EMAIL_CREDENTIALS = config.get("EMAIL");

/**
 * nodemailer configuration
 */
const nodemailerConfig = {
  service: "gmail",
  secure: true,
  auth: {
    user: EMAIL_CREDENTIALS.USERNAME, // sender gmail id
    pass: EMAIL_CREDENTIALS.PASS, // sender gmail password
  },
};

const nodeMailer = nodemailer.createTransport(nodemailerConfig);

/**
 * email message configuration
 */
const emailConfig = {
  from: EMAIL_CREDENTIALS.USERNAME, // sender email id
  to: EMAIL_CREDENTIALS.USERNAME, // recepient email id.
  subject: "Your test score",
  html: `<b>Hello %studentName%,</b><br>
  <p>Your test score is here!</p>
  <p>You have scored %studentScore% in the latest test.</p>
  <p>Thanks</p>,
  <p>Result Management System</p>`,
};

module.exports = { nodeMailer, emailConfig };
