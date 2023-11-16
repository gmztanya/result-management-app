const Student = require("../../models/student.model");
const { student, studentResponse } = require("../../__mocks__/student.mocks");
const { createStudent, getAllStudents, getStudentByRollNo, getStudentByNameAndRollNo } = require("../../services/student.service");

const req = student;

jest.mock("../../models/student.model");
describe("student service", () => {
  describe("createStudent", () => {
    test("should add a new student record to db", async () => {
      Student.create = jest.fn().mockResolvedValue(studentResponse);

      const result = await createStudent(req);

      expect(Student.create).toHaveBeenCalledWith(req);
      expect(result).toEqual(studentResponse);
    });
  });

  describe("getAllStudents", () => {
    test("should get the list of student records", async () => {
      Student.findAll = jest.fn().mockResolvedValue([studentResponse]);

      const result = await getAllStudents();

      expect(Student.findAll).toHaveBeenCalled();
      expect(result).toEqual([studentResponse]);
    });
  });

  describe("getStudentByRollNo", () => {
    test("should get a student record by rollNumber", async () => {
      const { rollNumber } = req;
      Student.findOne = jest.fn().mockResolvedValue(studentResponse);

      const result = await getStudentByRollNo(rollNumber);

      expect(Student.findOne).toHaveBeenCalledWith({
        where: { rollNumber },
      });
      expect(result).toEqual(studentResponse);
    });
  });

  describe("getStudentByNameAndRollNo", () => {
    test("should get a student record by rollNumber and name", async () => {
      const { rollNumber, name } = req;
      Student.findOne = jest.fn().mockResolvedValue(studentResponse);

      const result = await getStudentByNameAndRollNo(rollNumber, name);

      expect(Student.findOne).toHaveBeenCalledWith({
        where: { rollNumber, name },
        raw: true,
      });
      expect(result).toEqual(studentResponse);
    });
  });
});
