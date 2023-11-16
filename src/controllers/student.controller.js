const studentService = require("../services/student.service");
const STATUS_CODES = require("../constants/status-codes.constants");

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
    // console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: "Failed to fetch student." });
  }
};


module.exports = { getStudentByNameAndRollNo };
