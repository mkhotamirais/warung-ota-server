const { signup, signin, getMe, updateMe, deleteMe, signout } = require("../controllers/authController");
const { isLogin, isAdmin } = require("../helper/middleware");
const router = require("express").Router();

router.post("/signup", signup);
router.patch("/signin", signin);
router.use(isLogin);
router.patch("/signout", signout);
router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);

module.exports = router;
