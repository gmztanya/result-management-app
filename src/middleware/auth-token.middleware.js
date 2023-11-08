const jwtUtils = require("../utils/jwt.utils");
const statusCodes = require("../constants/status-codes.constants");

const authenticateToken = function (req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized User" });
  }
  token = token.replace(/^Bearer\s+/, "");
  const verifiedToken = jwtUtils.verifyJwt(token);

  if (!verifiedToken.valid) {
    return res.status(statusCodes.UNAUTHORIZED).json({
      error: verifiedToken?.err?.name,
    });
  }
  req.user = verifiedToken.decodedToken;
  next();
};

module.exports = { authenticateToken };
