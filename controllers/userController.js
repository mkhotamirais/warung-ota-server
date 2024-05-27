const { err, ok } = require("../../mkhotami-vercel-server/helper/utils");
const { hashPass } = require("../helper/utils");
const User = require("../models/userModel");
const validator = require("validator");

const getUsers = async (req, res) => {
  try {
    const data = await User.find();
    ok(res, 200, `getUsers`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id);
    if (!data) return err(res, 404, `data id not found`);
    ok(res, 200, `getUserById`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const postUser = async (req, res) => {
  try {
    const { username, email, password, confPassword } = req.body;
    if (!username || username === "") return err(res, 400, `username required`);
    if (!email || email === "") return err(res, 400, `email required`);
    if (!password || password === "") return err(res, 400, `password required`);
    const dupUsername = await User.findOne({ username });
    if (dupUsername) return err(res, 409, `username registered`);
    const dupEmail = await User.findOne({ email });
    if (dupEmail) return err(res, 409, `email registered`);
    if (!validator.isEmail(email)) return err(res, 400, `email invalid`);
    if (password !== confPassword) return err(res, 400, `confirm password wrong`);
    req.body.password = hashPass(password);
    const data = await User.create(req.body);
    ok(res, 200, `post ${data.username} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await User.findById(id);
    if (!match) return err(res, 404, `data id not found`);
    const { username, email, password, confPassword } = req.body;
    if (!username || username === "") return err(res, 400, `username required`);
    if (!email || email === "") return err(res, 400, `email required`);
    const dupUsername = await User.findOne({ username });
    if (dupUsername && username !== match.username) return err(res, 409, `username registered`);
    const dupEmail = await User.findOne({ email });
    if (dupEmail && email !== match.email) return err(res, 409, `email registered`);
    if (!validator.isEmail(email)) return err(res, 400, `email invalid`);
    if (password) {
      if (password !== confPassword) return err(res, 400, `confirm password wrong`);
      req.body.password = hashPass(password);
    }
    const data = await User.findByIdAndUpdate(match?._id, req.body, { new: true });
    ok(res, 200, `update ${data?.username} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await User.findById(id);
    if (!match) return err(res, 404, `data id not found`);
    const data = await User.findByIdAndDelete(match?._id);
    ok(res, 200, `delete ${data.username} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

module.exports = { getUsers, getUserById, postUser, updateUser, deleteUser };
