const { authenticateToken } = require("../../middleware/auth-token.middleware");
const { teacherGuard } = require("../../middleware/teacher-guard.middleware");
const { verifyJwt } = require("../../utils/jwt.utils");

const statusCodes = require("../../constants/status-codes.constants");

const req = {
  headers: {
    authorization: "Bearer xxxxxxxxxx",
  },
  user: {
    userType: "",
  }
};

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

jest.mock("../../utils/jwt.utils", () => ({
  verifyJwt: jest.fn(),
}));

describe("auth-token middleware", () => {
  test("should call next() if a valid token is provided", () => {
    const next = jest.fn();
    verifyJwt.mockReturnValue({
      valid: true,
      decodedToken: { userType: "teacher" },
    });

    authenticateToken(req, res, next);

    expect(req.user).toEqual({ userType: "teacher" });
    expect(next).toHaveBeenCalled();
  });

  test("should give 401 if no token is provided", () => {
    const req = {
      headers: {},
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
    const next = jest.fn();

    verifyJwt.mockRejectedValue(new Error());
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(statusCodes.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });

  test("should give 401 if invalid token is provided", () => {
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
    const next = jest.fn();
    verifyJwt.mockReturnValue({
      valid: false,
      decodedToken: { userType: "teacher" },
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(statusCodes.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("teacher guard middleware", () => {

  test("should call the next() if usertype is teacher", () => {
    const next = jest.fn();
    req.user.userType = "teacher";

    teacherGuard(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("should return 403 if usertype is not teacher", () => {
    req.user.userType = "student";

    const next = jest.fn();
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    teacherGuard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(statusCodes.FORBIDDEN);
    expect(next).not.toHaveBeenCalled();
  })
})