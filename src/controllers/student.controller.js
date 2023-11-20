const config = require("config");
const studentService = require("../services/student.service");

const EMAIL_CREDENTIALS = config.get("EMAIL");
const STATUS_CODES = require("../constants/status-codes.constants");

const { nodeMailer, emailConfig } = require("../utils/nodemailer.utils");

const getStudentByNameAndRollNo = async (req, res) => {
  try {
    const { rollNumber, name } = req.body;
    const student = await studentService.getStudentByNameAndRollNo(rollNumber, name);
    if (!student) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: `No records found for ${rollNumber} - ${name}` });
    }
    console.table(student);
    res.status(STATUS_CODES.SUCCESS).json(student);
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: "Failed to fetch student." });
  }
};

const sendMail = async (req, res) => {
  try {
    const student = await studentService.getStudentByEmail(req.user.email);

    if (!student) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({
          error: `No records found for ${req.user.email}.
        Kindly add the student details in the student table.`,
        });
    }

    const emailMessage = { ...emailConfig };
    emailMessage.html = emailMessage.html
      .replace("%studentName%", student.name)
      .replace("%studentScore%", student.score);

    /** should be replaced with logged in student's email id.
     * passing the same test gamil account id here for testing as student email ids are dummy ids.
    */
    emailMessage.to = EMAIL_CREDENTIALS.USERNAME;

    await nodeMailer.sendMail(emailMessage);
    return res.status(STATUS_CODES.SUCCESS).json(`Email is successfully sent to ${emailMessage.to}.`);
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: "Failed to send email" });
  }
};

module.exports = { getStudentByNameAndRollNo, sendMail };
