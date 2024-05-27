const jwt = require("jsonwebtoken");
const { at } = require("../config/constants");
const { err } = require("./utils");
const User = require("../models/userModel");

const isLogin = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return err(res, 401, `unauthorized: not logged in`);
  jwt.verify(token, at, async (error, decoded) => {
    if (error) return err(res, 403, `forbidden: token invalid`);
    req.user = await User.findById(decoded.id).select(["-__v", "-password"]);
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return err(res, 403, `admin only`);
  next();
};

module.exports = { isLogin, isAdmin };
