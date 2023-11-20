const studentService = require("../services/student.service");
const STATUS_CODES = require("../constants/status-codes.constants");

const addStudent = async (req, res) => {
  try {
    const { rollNumber } = req.body;
    const existingStudent = await studentService.getStudentByRollNo(rollNumber);
    if (existingStudent) {
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ error: `student ${rollNumber} already exists` });
    }

    const student = await studentService.createStudent(req.body);
    console.info(
      `Student ${student.name}-${student.rollNumber} added successfully.`,
    );

    res.status(STATUS_CODES.RESOURCE_CREATED).json(student);
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: "Failed to add student." });
  }
};

const listStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    console.table(students);
    res.status(STATUS_CODES.SUCCESS).json(students);
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Failed to fetch list of students." });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await studentService.getStudentByRollNo(rollNumber);

    if (!student) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: `No records found for ${rollNumber}` });
    }

    await student.destroy();
    res
      .status(STATUS_CODES.SUCCESS)
      .json(`Student record - ${student.name}-${student.rollNumber} deleted.`);
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Failed to delete student record." });
  }
};

const editStudent = async (req, res) => {
  try {
    const editRequest = req.body;
    const { rollNumber } = req.params;
    const student = await studentService.getStudentByRollNo(rollNumber);

    if (!student) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: `No records found for ${rollNumber}` });
    }

    await student.update(editRequest);
    res
      .status(STATUS_CODES.RESOURCE_CREATED)
      .json(
        `Student record - ${student.name}-${student.rollNumber} edited successfully.`,
      );
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: "Failed to edit student record." });
  }
};

module.exports = { addStudent, listStudents, deleteStudent, editStudent };
