const User = require("../models/user.model");

const createUser = async (req) => {
  return User.create(req);
};

const findUserByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

module.exports = { createUser, findUserByUsername };
