const { authenticateToken } = require("../../middleware/auth-token.middleware");
const { checkUserRole } = require("../../middleware/user-guard.middleware");
const { verifyJwt } = require("../../utils/jwt.utils");

const STATUS_CODES = require("../../constants/status-codes.constants");

const req = {
  headers: {
    authorization: "Bearer xxxxxxxxxx",
  },
  user: {
    userType: "",
  },
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

    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED);
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

    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("checkUserRole middleware", () => {
  test("should call the next() if usertype is teacher", () => {
    const next = jest.fn();
    req.user.userType = "teacher";

    const middleware = checkUserRole("teacher");
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("should return 403 if usertype is not teacher", () => {
    req.user.userType = "student";

    const next = jest.fn();
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    const middleware = checkUserRole("teacher");
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.FORBIDDEN);
    expect(next).not.toHaveBeenCalled();
  });
});
