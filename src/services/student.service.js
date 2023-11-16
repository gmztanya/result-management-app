const Student = require("../models/student.model");

const createStudent = async (req) => {
  return Student.create(req);
};

const getAllStudents = async () => {
  return Student.findAll({ raw: true });
};

const getStudentByRollNo = async (rollNumber) => {
  return Student.findOne({
    where: { rollNumber },
  });
};

const getStudentByNameAndRollNo = async (rollNumber, name) => {
  return Student.findOne({
    where: { rollNumber, name },
    raw: true,
  });
};

module.exports = { createStudent, getAllStudents, getStudentByRollNo, getStudentByNameAndRollNo };
