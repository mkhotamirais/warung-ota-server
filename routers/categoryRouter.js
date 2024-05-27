const {
  getCategories,
  getCategoryById,
  postCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { isLogin, isAdmin } = require("../helper/middleware");

const router = require("express").Router();

router.route("/").get(getCategories).post(isLogin, isAdmin, postCategory);
router.route("/:id").get(getCategoryById).patch(isLogin, isAdmin, updateCategory).delete(isLogin, isAdmin, deleteCategory);

module.exports = router;
