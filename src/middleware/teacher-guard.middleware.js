const statusCodes = require("../constants/status-codes.constants");

const teacherGuard = function (req, res, next) {
  const userType = req.user.userType;

  // Check the user's role
  if (userType !== "teacher") {
    return res.status(statusCodes.FORBIDDEN).json({ error: "Forbidden resource" });
  }
  next();
};

module.exports = { teacherGuard };
