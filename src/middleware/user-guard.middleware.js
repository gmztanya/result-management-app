const STATUS_CODES = require("../constants/status-codes.constants");

const checkUserRole = (role) => (req, res, next) => {
  const userType = req.user.userType;
  // Check the user's role
  if (userType !== role) {
    return res.status(STATUS_CODES.FORBIDDEN).json({ error: "Forbidden resource" });
  }
  next();
};

module.exports = { checkUserRole };
