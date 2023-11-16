const supertest = require("supertest");
const config = require("config");

const { userLogin, userResponse } = require("../../__mocks__/user.mocks");
const { signJwt } = require("../../utils/jwt.utils");
const { findUserByUsername } = require("../../services/user.service");


const app = require("../../utils/server.utils");
const STATUS_CODES = require("../../constants/status-codes.constants");

const req = {
  body: userLogin,
  headers: {
    authorization: "Bearer xxxxxxxxxx",
  },
};

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

const token = "xxxxxxxxxx";
const tokenExpiry = config.get("JWT_TOKEN_EXPIRES_IN");

jest.mock("../../utils/jwt.utils", () => ({
  signJwt: jest.fn(),
}));

jest.mock("../../services/user.service", () => ({
  findUserByUsername: jest.fn(),
}));

describe("auth controller", () => {
  describe("POST/login route", () => {
    test("should return a jwt token when given valid login credentials", async () => {
      const { username } = req.body;
      findUserByUsername.mockReturnValue(userResponse);
      signJwt.mockReturnValue(token);

      const { statusCode, body } = await supertest(app)
        .post("/auth/login")
        .send(req.body);

      expect(findUserByUsername).toHaveBeenCalledWith(username);
      expect(signJwt).toHaveBeenCalledWith(
        { userType: userResponse.userType },
        tokenExpiry
      );
      expect(statusCode).toBe(STATUS_CODES.SUCCESS);
      expect(body.token).toBe(token);
    });

    test("should return 401 if the username does not exist", async () => {
      const { username } = req.body;
      findUserByUsername.mockReturnValue(null);
      signJwt.mockReturnValue(null);

      const { statusCode, body } = await supertest(app)
        .post("/auth/login")
        .send(req.body);

      expect(findUserByUsername).toHaveBeenCalledWith(username);
      expect(statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
      expect(body.error).toBe("Invalid username or password");
      expect(signJwt).not.toHaveBeenCalled();
    });

    test("should return 401 if the password does not match", async () => {
      const req = {
        body: {
          username: "john123",
          password: "test",
        },
      };
      const { username, password } = req.body;
      findUserByUsername.mockReturnValue(userResponse);
      signJwt.mockReturnValue(null);

      const { statusCode, body } = await supertest(app)
        .post("/auth/login")
        .send(req.body);

      expect(findUserByUsername).toHaveBeenCalledWith(username);
      expect(password).not.toBe(userResponse.password);
      expect(statusCode).toBe(STATUS_CODES.UNAUTHORIZED);
      expect(body.error).toBe("Invalid username or password");
      expect(signJwt).not.toHaveBeenCalled();
    });

    test("should return 500 on login failure", async () => {
      const { username } = req.body;
      findUserByUsername.mockRejectedValue(new Error());
      signJwt.mockReturnValue(null);

      const { statusCode, body } = await supertest(app)
        .post("/auth/login")
        .send(req.body);

      expect(findUserByUsername).toHaveBeenCalledWith(username);
      expect(statusCode).toBe(STATUS_CODES.SERVER_ERROR);
      expect(body.error).toBe("Login failed");
      expect(signJwt).not.toHaveBeenCalled();
    });
  });

  describe("POST/logout route", () => {
    test("should call logout", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/auth/logout")
        .send(req.body);

      expect(statusCode).toBe(STATUS_CODES.SUCCESS);
      expect(body.message).toBe("Logged out successfully");
    });
  })
});
