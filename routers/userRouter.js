const { getUserById, updateUser, deleteUser, getUsers, postUser } = require("../controllers/userController");
const { isLogin, isAdmin } = require("../helper/middleware");
const router = require("express").Router();

router.use(isLogin, isAdmin);
router.route("/").get(getUsers).post(postUser);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
