const express = require("express");
const router = express.Router();

const ROLE = require("../constants/user.constants");
const { authenticateToken } = require("../middleware/auth-token.middleware");
const { checkUserRole } = require("../middleware/user-guard.middleware");

const teacherController = require("../controllers/teacher.controller");

router.post(
  "/add-student",
  [authenticateToken, checkUserRole(ROLE.TEACHER)],
  teacherController.addStudent,
);

router.get(
  "/list-students",
  [authenticateToken, checkUserRole(ROLE.TEACHER)],
  teacherController.listStudents,
);

router.delete(
  "/delete-student/:rollNumber",
  [authenticateToken, checkUserRole(ROLE.TEACHER)],
  teacherController.deleteStudent,
);

router.put(
  "/edit-student/:rollNumber",
  [authenticateToken, checkUserRole(ROLE.TEACHER)],
  teacherController.editStudent,
);

module.exports = router;
