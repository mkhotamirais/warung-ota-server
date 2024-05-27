const User = require("../models/userModel");
const validator = require("validator");
const { hashPass, comparePass, setCookie, setToken, err, ok, removeCookie } = require("../helper/utils");

const signup = async (req, res) => {
  try {
    const { username, email, password, confPassword, role } = req.body;
    const dupUsername = await User.findOne({ username });
    if (dupUsername) return err(res, 409, `username registered`);
    const dupEmail = await User.findOne({ email });
    if (dupEmail) return err(res, 409, `email registered`);
    if (!validator.isEmail(email)) return err(res, 400, `email invalid`);
    if (password !== confPassword) return err(res, 400, `confirm password wrong`);
    if (role && role === "admin") req.body.role = "user";
    req.body.password = hashPass(password);
    const data = await User.create(req.body);
    ok(res, 200, `register ${data.username} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const match = await User.findOne({ username });
    if (!match) return err(res, 409, `username is not registered`);
    const matchPass = comparePass(password, match?.password);
    if (!matchPass) return err(res, 400, `wrong password`);
    const token = setToken({ id: match._id, username: match.username, role: match.role });
    setCookie(res, "accessToken", token);
    const data = await User.findByIdAndUpdate(match?._id, { $push: { token } }, { new: true });
    ok(res, 200, `login ${data?.username} success`, token);
  } catch (error) {
    err(res, 400, error);
  }
};

// required token
const signout = async (req, res) => {
  try {
    const match = await User.findOne({ token: { $in: req.cookies.accessToken } });
    if (!match) return err(res, 403, `forbidden: token tidak valid`);
    removeCookie(res, "accessToken");
    const data = await findByIdAndUpdate(match._id, { $pull: { token } }, { new: true });
    ok(res, 200, `logout ${data.username} success`);
  } catch (error) {
    err(res, 400, error);
  }
};

const getMe = async (req, res) => {
  try {
    const data = await User.findOne({ token: { $in: req.cookies.accessToken } }).select(["-__v", "-password"]);
    if (!data) return err(res, 403, `forbidden: token tidak valid`);
    ok(res, 200, `getMe`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const updateMe = async (req, res) => {
  try {
    const match = await User.findOne({ token: { $in: req.cookies.accessToken } });
    if (!match) return err(res, 403, `forbidden: token tidak valid`);
    const { password, confPassword } = req.body;
    if (password) {
      if (password !== confPassword) return err(res, 400, `confirm password wrong`);
      req.body.password = hashPass(password);
    }
    const data = await User.findByIdAndUpdate(match._id, req.body, { new: true });
    ok(res, 200, `update your data success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const deleteMe = async (req, res) => {
  try {
    const match = await User.findOne({ token: { $in: req.cookies.accessToken } });
    if (!match) return err(res, 403, `forbidden: token tidak valid`);
    if (match.role === "admin") return err(res, 400, `role admin cannot deleted, change role first`);
    const data = await User.findByIdAndDelete(match._id);
    ok(res, 200, `delete your account success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

module.exports = { signin, signup, signout, getMe, updateMe, deleteMe };
