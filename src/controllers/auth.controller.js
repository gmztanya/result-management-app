const config = require("config");
const jwtUtils = require("../utils/jwt.utils");
const STATUS_CODES = require("../constants/status-codes.constants");
const userService = require("../services/user.service");

const tokenExpiry = config.get("JWT_TOKEN_EXPIRES_IN");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.findUserByUsername(username);

    if (!user) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Invalid username or password" });
    }

    if (user.password !== password) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ error: "Invalid username or password" });
    }

    const token = jwtUtils.signJwt({ userType: user.userType }, tokenExpiry);

    res.status(STATUS_CODES.SUCCESS).json({ token });
  } catch (error) {
    // console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({ error: "Login failed" });
  }
};

const logout = async (req, res) => {
  // remove token
  res
    .status(STATUS_CODES.SUCCESS)
    .json({ message: "Logged out successfully" });
};

module.exports = { login, logout };
