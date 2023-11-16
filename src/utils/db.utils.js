/**
 * Reference- https://www.digitalocean.com/community/tutorials/how-to-use-sequelize-with-node-js-and-mysql
 */
const config = require("config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.get("DB_NAME"),
  config.get("DB_USER"),
  config.get("DB_PASSWORD"),
  {
    host: config.get("HOST"),
    dialect: config.get("DB_DIALECT"),
    define: {
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      timestamps: false,
    },
  },
);

module.exports = sequelize;
