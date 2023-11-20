const env = {
  PORT: 3000,
  JWT_SECRET: "5dc94d8d68952b487ef5bb397888d142bf488f17f45526a2423bcdea5e9906ca",
  JWT_TOKEN_EXPIRES_IN: "5h",
  DB_PASSWORD: "12345",
  DB_USER: "upskill_user",
  DB_NAME: "upskilling_sessions",
  HOST: "localhost",
  DB_DIALECT: "mysql",
  EMAIL: {
    USERNAME: "utest01012000@gmail.com", // can be replaced with any gmail account.
    PASS: "ltnrcqgmiudkhqtw", // set app password for the gmail account
  },
};

module.exports = env;
