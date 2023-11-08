const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db.utils");

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
    type: DataTypes.ENUM("teacher", "student"),
    allowNull: false,
  },
});

module.exports = User;
