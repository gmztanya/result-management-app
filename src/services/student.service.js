const Student = require("../models/student.model");

const createStudent = (req) => {
  return Student.create(req);
};

const getAllStudents = () => {
  return Student.findAll({ raw: true });
};

const getStudentByRollNo = (rollNumber) => {
  return Student.findOne({
    where: { rollNumber },
  });
};

const getStudentByNameAndRollNo = (rollNumber, name) => {
  return Student.findOne({
    where: { rollNumber, name },
    raw: true,
  });
};

const getStudentByEmail = (email) => {
  return Student.findOne({
    where: { email },
  });
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentByRollNo,
  getStudentByNameAndRollNo,
  getStudentByEmail,
};
