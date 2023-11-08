const Student = require("../../models/student.model");
const { student, studentResponse } = require("../../__mocks__/student.mocks");
const { createStudent, getAllStudents, getStudentByRollNo } = require("../../services/student.service");

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

    test("should throw error on failure to add new student", async () => {
      Student.create = jest
        .fn()
        .mockRejectedValue(new Error("Failed to create student"));

      const result = await expect(createStudent(req)).rejects.toThrow(
        "Failed to create student"
      );

      expect(Student.create).toHaveBeenCalledWith(req);
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
    test("should add a new student record to db", async () => {
      const { rollNumber } = req;
      Student.findOne = jest.fn().mockResolvedValue(studentResponse);

      const result = await getStudentByRollNo(rollNumber);

      expect(Student.findOne).toHaveBeenCalledWith({
        where: { rollNumber },
      });
      expect(result).toEqual(studentResponse);
    });
  });
});
