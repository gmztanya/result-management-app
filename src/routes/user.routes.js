const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { userRegistrationRules, validate } = require("../middleware/validation.middleware");

router.post(
  "/register",
  [userRegistrationRules(), validate],
  userController.registerUser,
);

module.exports = router;
