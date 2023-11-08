const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/auth-token.middleware");
const { teacherGuard } = require("../middleware/teacher-guard.middleware");

const teacherController = require("../controllers/teacher.controller");

router.post(
  "/add-student",
  [authenticateToken, teacherGuard],
  teacherController.addStudent
);

router.get(
  "/list-students",
  [authenticateToken, teacherGuard],
  teacherController.listStudents
);

router.delete(
  "/delete-student/:rollNumber",
  [authenticateToken, teacherGuard],
  teacherController.deleteStudent
);

router.put(
  "/edit-student/:rollNumber",
  [authenticateToken, teacherGuard],
  teacherController.editStudent
);

module.exports = router;
