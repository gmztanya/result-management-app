const User = require("../models/user.model");

const createUser = async (req) => {
  try {
    return User.create(req);
  } catch (e) {
    throw new Error(e);
  }
};

const findUserByUsername = async (username) => {
  try {
    return User.findOne({ where: { username } });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { createUser, findUserByUsername };
