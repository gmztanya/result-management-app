const supertest = require("supertest");

const { createUser, findUserByUsername } = require("../../services/user.service");
const { user, userResponse } = require("../../__mocks__/user.mocks");

const app = require("../../utils/server.utils");
const STATUS_CODES = require("../../constants/status-codes.constants");

const req = {
  body: user,
};

jest.mock("../../services/user.service", () => ({
  findUserByUsername: jest.fn(),
  createUser: jest.fn(),
}));

describe("user", () => {
  describe("register user route", () => {
    describe("given a user, ", () => {
      test("should register the user and return a status code of 201", async () => {
        const { username } = req.body;

        findUserByUsername.mockImplementation(() => null);
        createUser.mockImplementation(() => userResponse);

        const { statusCode, body } = await supertest(app)
          .post("/user/register")
          .send(user);

        expect(findUserByUsername).toHaveBeenCalledWith(username);
        expect(createUser).toHaveBeenCalledWith(req.body);

        expect(statusCode).toBe(STATUS_CODES.RESOURCE_CREATED);
        expect(body).toEqual(userResponse);
      });

      test("should return a status code of 500 if user already exists", async () => {
        const { username } = req.body;

        findUserByUsername.mockImplementation(() => userResponse);
        createUser.mockImplementation(() => userResponse);

        const { statusCode, body } = await supertest(app)
          .post("/user/register")
          .send(user);

        expect(findUserByUsername).toHaveBeenCalledWith(username);
        expect(createUser).not.toHaveBeenCalledWith(user);

        expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
        expect(body.error).toEqual(`user ${user.username} already exists`);
      });
    });

    describe("given an invalid user, ", () => {
      test("should return validation errors and status code of 400 if user object validation fails", async () => {
        const invalidUser = { ...user, username: "" };
        const validationError = [{ username: "Username is required" }];

        const { statusCode, body } = await supertest(app)
          .post("/user/register")
          .send(invalidUser);

        expect(statusCode).toBe(STATUS_CODES.BAD_REQUEST);
        expect(body.error).toEqual(validationError);
      });
      test("should return a status code of 500", async () => {
        createUser.mockRejectedValue(new Error("Failed to create user"));

        const { statusCode, body } = await supertest(app)
          .post("/user/register")
          .send(user);

        expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
        expect(body.error).toEqual("Failed to add user.");
      });
    });
  });
});
