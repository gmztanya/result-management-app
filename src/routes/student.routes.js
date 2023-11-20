const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/auth-token.middleware");
const { checkUserRole } = require("../middleware/user-guard.middleware");

const ROLE = require("../constants/user.constants");
const studentController = require("../controllers/student.controller");

router.get(
  "/search",
  [authenticateToken, checkUserRole(ROLE.STUDENT)],
  studentController.getStudentByNameAndRollNo,
);

router.post(
  "/send-mail",
  [authenticateToken, checkUserRole(ROLE.STUDENT)],
  studentController.sendMail,
);

module.exports = router;
