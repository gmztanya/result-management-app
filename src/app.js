const config = require("config");
const app = require("./utils/server.utils");
const sequelize = require("./utils/db.utils");

const PORT = config.get("PORT");
app.listen(PORT, () => {
  console.log(`App listening on Port ${PORT}`);
});

sequelize
  .sync()
  .then(() => {
    console.info("Database initialization success");
  })
  .catch(err => {
    console.error("Database initialization error:", err.name);
  });
