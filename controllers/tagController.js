const { err, ok } = require("../helper/utils");
const Tag = require("../models/tagModel");

const getTags = async (req, res) => {
  try {
    const data = await Tag.find().sort("name");
    ok(res, 200, `getTags`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Tag.findById(id);
    if (!data) return err(res, 404, `tag id not found`);
    ok(res, 200, `getTagById`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const postTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name === "") return err(res, 400, `tag name is required`);
    const dup = await Tag.findOne({ name });
    if (dup) return err(res, 409, `tag name listed, input another`);
    const data = await Tag.create(req.body);
    ok(res, 200, `post ${data.name} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Tag.findById(id);
    if (!match) return err(res, 404, `tag id not found`);
    const { name } = req.body;
    if (!name || name === "") return err(res, 400, `tag name is required`);
    const dup = await Tag.findOne({ name });
    if (dup && name !== match.name) return err(res, 409, `tag name listed, input another`);
    const data = await Tag.findByIdAndUpdate(match._id, req.body, { new: true });
    ok(res, 200, `update ${data.name} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Tag.findById(id);
    if (!match) return err(res, 404, `tag id not found`);
    const data = await Tag.findByIdAndDelete(match._id);
    ok(res, 200, `delete ${data.name} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

module.exports = { getTags, getTagById, postTag, updateTag, deleteTag };
