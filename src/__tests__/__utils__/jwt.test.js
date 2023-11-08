const config = require("config");
const jwt = require("jsonwebtoken");
const { TokenExpiredError } = require("jsonwebtoken");

const { signJwt, verifyJwt } = require("../../utils/jwt.utils");
const { user } = require("../../__mocks__/user.mocks");

const secretKey = config.get("JWT_SECRET");
const tokenExpiry = config.get("JWT_TOKEN_EXPIRES_IN");
const mockToken = "xxxxxxxxxx";

jest.mock("jsonwebtoken");
describe("db utils", () => {
  describe("signJwt", () => {
    test("should return a signed token", () => {
      const payload = { userType: user.userType };
      const expiresIn = tokenExpiry;

      jwt.sign.mockReturnValue(mockToken);

      const token = signJwt(payload, expiresIn);

      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey, { expiresIn });
    });
  });

  describe("verifyJwt", () => {
    test("should verify a token and return decoded token if valid", () => {
      const token = mockToken;
      const decodedToken = { userType: user.userType };

      jwt.verify.mockReturnValue({ ...decodedToken });

      const result = verifyJwt(token);

      expect(result.valid).toBe(true);
      expect(result.decodedToken).toEqual(decodedToken);
      expect(jwt.verify).toHaveBeenCalledWith(token, secretKey);
    });

  });
});
