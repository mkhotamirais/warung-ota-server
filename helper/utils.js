const { compareSync, genSaltSync, hashSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { at } = require("../config/constants");

const ok = (res, status, message, data) => {
  res.status(status).json({ message, data });
};

const err = (res, status, error) => {
  res.status(status).json({ message: error?.message || error });
};

const hashPass = (pass) => {
  const salt = genSaltSync(10);
  return hashSync(pass, salt);
};

const comparePass = (pass, oldPass) => {
  return compareSync(pass, oldPass);
};

const setToken = (data) => jwt.sign(data, at, { expiresIn: "3d" });

const setCookie = (res, name, token) => {
  res.cookie(`${name}`, token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });
};

const removeCookie = (res, name) => {
  res.clearCookie(`${name}`, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    expires: new Date(0),
  });
};

module.exports = { ok, err, hashPass, comparePass, setToken, setCookie, removeCookie };
