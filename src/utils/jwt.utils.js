const config = require("config");
const jwt = require("jsonwebtoken");

const secretKey = config.get("JWT_SECRET");

const signJwt = (payload, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

const verifyJwt = (token) => {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    return {
      valid: true,
      decodedToken,
    };
  } catch (err) {
    console.error(err);
    return {
      valid: false,
      err,
    };
  }
};

module.exports = { signJwt, verifyJwt };
