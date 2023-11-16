const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/auth-token.middleware");
const { checkUserRole } = require("../middleware/user-guard.middleware");

const studentController = require("../controllers/student.controller");

router.get(
  "/search",
  [authenticateToken, checkUserRole('student')],
  studentController.getStudentByNameAndRollNo
);

module.exports = router;
