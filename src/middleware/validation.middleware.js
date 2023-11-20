/**
 * reference - https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
 */
const { body, validationResult } = require("express-validator");
const STATUS_CODES = require("../constants/status-codes.constants");
const ROLE = require("../constants/user.constants");

const userRegistrationRules = function () {
  return [
    body("username").notEmpty().trim().withMessage("Username is required"),
    body("email").isEmail().normalizeEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().trim().withMessage("Password is required"),
    body("userType").isIn([ROLE.STUDENT, ROLE.TEACHER]).trim().withMessage("Enter a valid role"),
  ];
};

const studentValidationRules = function () {
  return [
    body("rollNumber").notEmpty().trim().withMessage("Roll number is required"),
    body("email").isEmail().normalizeEmail().withMessage("Enter a valid email"),
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("dateOfBirth").notEmpty().trim().withMessage("DOB is required"),
    body("score").isNumeric().trim().withMessage("Enter a valid score"),
  ];
};

const validate = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [ err.path ]: err.msg }));

    return res.status(STATUS_CODES.BAD_REQUEST).json({
      error: extractedErrors,
    });
  }
  next();
};

module.exports = {
  userRegistrationRules,
  studentValidationRules,
  validate,
};
