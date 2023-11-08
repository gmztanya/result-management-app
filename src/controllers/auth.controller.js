const config = require("config");
const jwtUtils = require("../utils/jwt.utils");
const statusCodes = require("../constants/status-codes.constants");
const userService = require("../services/user.service");

const tokenExpiry = config.get("JWT_TOKEN_EXPIRES_IN");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.findUserByUsername(username);

    if (!user) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ error: "Invalid username or password" });
    }

    if (user.password !== password) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ error: "Invalid username or password" });
    }

    const token = jwtUtils.signJwt({ userType: user.userType }, tokenExpiry);

    res.status(statusCodes.SUCCESS).json({ token });
  } catch (error) {
    // console.error(error);
    res.status(statusCodes.SERVER_ERROR).json({ error: "Login failed" });
  }
};

const logout = async (req, res) => {
  try {
    // remove token
    res
      .status(statusCodes.SUCCESS)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    // console.error(error);
    res.status(statusCodes.SERVER_ERROR).json({ error: "Logout failed" });
  }
};

module.exports = { login, logout };
