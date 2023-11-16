const app = require("../../utils/server.utils");
const supertest = require("supertest");

const STATUS_CODES = require("../../constants/status-codes.constants");

const { authenticateToken } = require("../../middleware/auth-token.middleware");

const {
  createStudent,
  getAllStudents,
  getStudentByRollNo,
  getStudentByNameAndRollNo,
} = require("../../services/student.service");
const { student, studentResponse } = require("../../__mocks__/student.mocks");

const req = {
  body: student,
  params: {
    rollNumber: student.rollNumber,
  },
};

const authorization = "Bearer xxxxxxxxxx";

jest.mock("../../middleware/auth-token.middleware", () => ({
  authenticateToken: jest.fn(),
}));
jest.mock("../../middleware/user-guard.middleware", () => ({
  checkUserRole: jest.fn((_role) => (_req, _res, next) => next()),
}));
jest.mock("../../services/student.service", () => ({
  createStudent: jest.fn(),
  getAllStudents: jest.fn(),
  getStudentByRollNo: jest.fn(),
  getStudentByNameAndRollNo: jest.fn(),
}));

describe("teacher controller", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((_req, _res, next) => next());
  });
  describe("POST/add-student route", () => {
    describe("given a student object, ", () => {
      test("should add the student and return a status code of 201", async () => {
        const { rollNumber } = req.body;

        getStudentByRollNo.mockResolvedValue(null);
        createStudent.mockResolvedValue(studentResponse);

        const { statusCode, body } = await supertest(app)
          .post("/teacher/add-student")
          .set("Authorization", authorization)
          .send(req.body);

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(createStudent).toHaveBeenCalledWith(req.body);

        expect(statusCode).toBe(STATUS_CODES.RESOURCE_CREATED);
        expect(body).toEqual(studentResponse);
      });

      test("should return 500 if student already exists", async () => {
        const { rollNumber } = req.body;

        getStudentByRollNo.mockResolvedValue(studentResponse);
        createStudent.mockResolvedValue(studentResponse);

        const { statusCode, body } = await supertest(app)
          .post("/teacher/add-student")
          .set("Authorization", authorization)
          .send(req.body);

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(createStudent).not.toHaveBeenCalledWith(req.body);

        expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
        expect(body.error).toEqual(`student ${rollNumber} already exists`);
      });
    });

    describe("given an invalid student object, ", () => {
      test("should return a status code of 500", async () => {
        getStudentByRollNo.mockRejectedValue(new Error());
        createStudent.mockRejectedValue(new Error());

        const { statusCode, body } = await supertest(app)
          .post("/teacher/add-student")
          .set("Authorization", authorization)
          .send({});

        expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
        expect(body.error).toEqual("Failed to add student.");
      });
    });
  });

  describe("GET/list-students route", () => {
    test("should get the list of all student records", async () => {
      getAllStudents.mockResolvedValue([studentResponse]);

      const { statusCode, body } = await supertest(app)
        .get("/teacher/list-students")
        .set("Authorization", authorization)
        .send();

      expect(statusCode).toBe(STATUS_CODES.SUCCESS);
      expect(body).toEqual([studentResponse]);
      expect(getAllStudents).toHaveBeenCalled();
    });

    test("should return a status code of 500 on failure to fetch student records", async () => {
      getAllStudents.mockRejectedValue(new Error());

      const { statusCode, body } = await supertest(app)
        .get("/teacher/list-students")
        .set("Authorization", authorization)
        .send();

      expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
      expect(body.error).toEqual("Failed to fetch list of students.");
    });
  });

  describe("DELETE/delete-student/:rollNumber", () => {
    describe("given a rollNumber, ", () => {
      test("should find the student record and delete student record from db", async () => {
        const studentResp = { ...student, destroy: jest.fn() };
        const { rollNumber } = req.params;

        getStudentByRollNo.mockResolvedValue(studentResp);

        const { statusCode, body } = await supertest(app)
          .delete(`/teacher/delete-student/${rollNumber}`)
          .set("Authorization", authorization)
          .send();

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(studentResp.destroy).toHaveBeenCalled();
        expect(statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(body).toEqual(
          `Student record - ${studentResp.name}-${studentResp.rollNumber} deleted.`,
        );
      });

      test("should return 404 if student record does not exist", async () => {
        const studentResp = { ...student, destroy: jest.fn() };
        const { rollNumber } = req.params;

        getStudentByRollNo.mockResolvedValue(null);

        const { statusCode, body } = await supertest(app)
          .delete(`/teacher/delete-student/${rollNumber}`)
          .set("Authorization", authorization)
          .send();

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(statusCode).toBe(STATUS_CODES.NOT_FOUND);
        expect(studentResp.destroy).not.toHaveBeenCalled();
        expect(body.error).toEqual(`No records found for ${rollNumber}`);
      });

      test("should return 500 if delete operation fails", async () => {
        const studentResp = { ...student, destroy: jest.fn() };
        const { rollNumber } = req.params;

        getStudentByRollNo.mockRejectedValue(new Error());

        const { statusCode, body } = await supertest(app)
          .delete(`/teacher/delete-student/${rollNumber}`)
          .set("Authorization", authorization)
          .send();

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
        expect(studentResp.destroy).not.toHaveBeenCalled();
        expect(body.error).toEqual("Failed to delete student record.");
      });
    });
  });

  describe("PUT/edit-student/:rollNumber", () => {
    describe("given a rollNumber, ", () => {
      test("should find the student record and update student record in db", async () => {
        const studentRespMock = { ...student, update: jest.fn() };
        const editRequest = req.body;
        const { rollNumber } = req.params;

        getStudentByRollNo.mockResolvedValue(studentRespMock);

        const { statusCode, body } = await supertest(app)
          .put(`/teacher/edit-student/${rollNumber}`)
          .set("Authorization", authorization)
          .send(req.body);

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(studentRespMock.update).toHaveBeenCalledWith(editRequest);
        expect(statusCode).toBe(STATUS_CODES.RESOURCE_CREATED);
        expect(body).toEqual(
          `Student record - ${studentRespMock.name}-${studentRespMock.rollNumber} edited successfully.`,
        );
      });

      test("should return 404 if student record does not exist", async () => {
        const studentRespMock = { ...student, update: jest.fn() };
        const { rollNumber } = req.params;

        getStudentByRollNo.mockResolvedValue(null);

        const { statusCode, body } = await supertest(app)
          .put(`/teacher/edit-student/${rollNumber}`)
          .set("Authorization", authorization)
          .send(req.body);

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(statusCode).toBe(STATUS_CODES.NOT_FOUND);
        expect(studentRespMock.update).not.toHaveBeenCalled();
        expect(body.error).toEqual(`No records found for ${rollNumber}`);
      });

      test("should return 500 if update operation fails", async () => {
        const studentRespMock = { ...student, update: jest.fn() };
        const { rollNumber } = req.params;

        getStudentByRollNo.mockRejectedValue(new Error());

        const { statusCode, body } = await supertest(app)
          .put(`/teacher/edit-student/${rollNumber}`)
          .set("Authorization", authorization)
          .send(req.body);

        expect(getStudentByRollNo).toHaveBeenCalledWith(rollNumber);
        expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
        expect(studentRespMock.update).not.toHaveBeenCalled();
        expect(body.error).toEqual("Failed to edit student record.");
      });
    });
  });
});

describe("studnt controller", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((_req, _res, next) => next());
  });
  describe("GET/search route", () => {
    describe("given a rollNumber and name", () => {
      test("should get the student record", async () => {
        getStudentByNameAndRollNo.mockResolvedValue(studentResponse);

        const { statusCode, body } = await supertest(app)
          .get("/student/search")
          .set("Authorization", authorization)
          .send();

        expect(statusCode).toBe(STATUS_CODES.SUCCESS);
        expect(body).toEqual(studentResponse);
        expect(getStudentByNameAndRollNo).toHaveBeenCalled();
      });

      test("should return 404 if student record does not exist", async () => {
        const { rollNumber, name } = req.body;

        getStudentByNameAndRollNo.mockResolvedValue(null);

        const { statusCode, body } = await supertest(app)
          .get("/student/search")
          .set("Authorization", authorization)
          .send(req.body);

        expect(getStudentByNameAndRollNo).toHaveBeenCalledWith(rollNumber, name);
        expect(statusCode).toBe(STATUS_CODES.NOT_FOUND);
        expect(body.error).toEqual(`No records found for ${rollNumber} - ${name}`);
      });

      test("should return 500 if update operation fails", async () => {
        const { rollNumber, name } = req.body;

        getStudentByNameAndRollNo.mockRejectedValue(new Error());

        const { statusCode, body } = await supertest(app)
          .get("/student/search")
          .set("Authorization", authorization)
          .send(req.body);

        expect(getStudentByNameAndRollNo).toHaveBeenCalledWith(rollNumber, name);
        expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
        expect(body.error).toEqual("Failed to fetch student.");
      });
    });
  });
});
