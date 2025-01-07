const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

exports.createAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};
