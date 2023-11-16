const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.utils");
const ROLE = require("../constants/user.constants");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM(ROLE.TEACHER, ROLE.STUDENT),
    allowNull: false,
  },
});

module.exports = User;
