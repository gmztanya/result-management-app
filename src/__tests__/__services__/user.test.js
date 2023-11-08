const User = require("../../models/user.model");
const { user, userResponse } = require("../../__mocks__/user.mocks");
const {
  createUser,
  findUserByUsername,
} = require("../../services/user.service");
const req = user;

jest.mock("../../models/user.model");
describe("user service", () => {
  describe("createUser", () => {
    test("should add a new user record to db", async () => {
      User.create = jest.fn().mockResolvedValue(userResponse);

      const result = await createUser(req);

      expect(User.create).toHaveBeenCalledWith(req);
      expect(result).toEqual(userResponse);
    });
  });

  describe("findUserByUsername", () => {
    test("should add a new user record to db", async () => {
      const { username } = req;
      User.findOne = jest.fn().mockResolvedValue(userResponse);

      const result = await findUserByUsername(username);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(userResponse);
    });
  });
});
