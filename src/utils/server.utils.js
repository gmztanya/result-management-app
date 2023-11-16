const express = require("express");
const app = express();

const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const teacherRoutes = require("../routes/teacher.routes");
const studentRoutes = require("../routes/student.routes");

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);

module.exports = app; // Export the Express app instance
