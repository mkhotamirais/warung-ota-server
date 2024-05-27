const {
  getProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { isLogin, isAdmin } = require("../helper/middleware");
const router = require("express").Router();

router.route("/").get(getProducts).post(isLogin, isAdmin, postProduct);
router.route("/:id").get(getProductById).patch(isLogin, isAdmin, updateProduct).delete(isLogin, isAdmin, deleteProduct);

module.exports = router;
