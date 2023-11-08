const Student = require("../models/student.model");

const createStudent = async (req) => {
  try {
    return Student.create(req);
  } catch (e) {
    throw new Error(e);
  }
};

const getAllStudents = async () => {
  try {
    return Student.findAll({ raw: true });
  } catch (e) {
    throw new Error(e);
  }
};

const getStudentByRollNo = async (rollNumber) => {
  try {
    return Student.findOne({
      where: { rollNumber },
    });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { createStudent, getAllStudents, getStudentByRollNo };
