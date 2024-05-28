const { ok, err } = require("../helper/utils");
const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const { skip = 0, limit = 0, q = "", category = "", tag = [], sort = "name" } = req.query;
    let criteria;
    if (q.length) criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
    if (category.length) criteria = { ...criteria, category };
    if (tag.length) criteria = { ...criteria, tag: { $in: tag } };
    // const options = { sort: [["group.name", "asc"]] };
    const count = await Product.countDocuments(criteria);
    const data = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort(sort)
      .populate({ path: "category", select: "name" })
      .populate({ path: "tag", select: ["name"] })
      .populate({ path: "user", select: ["username"] });
    res.status(200).json({ message: `getProducts`, data, count });
  } catch (error) {
    err(res, 400, error);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Product.findById(id)
      .populate({ path: "category", select: ["name"] })
      .populate({ path: "tag", select: ["name"] })
      .populate({ path: "user", select: ["username"] });
    if (!data) return err(res, 404, `data id not found`);
    ok(res, 200, `message`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const postProduct = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const data = await Product.create(req.body);
    ok(res, 200, `post ${data?.name} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Product.findById(id);
    if (!match) return err(res, 404, `data id not found`);
    const data = await await Product.findByIdAndUpdate(match._id, req.body, { new: true });
    ok(res, 200, `update ${data?.name} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Product.findById(id);
    if (!match) return err(res, 404, `data id not found`);
    const data = await Product.findByIdAndDelete(match?._id);
    ok(res, 200, `delete ${data.name} success`, data);
  } catch (error) {
    err(res, 400, error);
  }
};

module.exports = { getProducts, getProductById, updateProduct, deleteProduct, postProduct };
