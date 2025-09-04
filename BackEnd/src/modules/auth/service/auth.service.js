// src/modules/auth/service/auth.service.js

const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = {
  generateAuthToken,
};