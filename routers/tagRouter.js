const { getTagById, updateTag, deleteTag, postTag, getTags } = require("../controllers/tagController");
const { isLogin, isAdmin } = require("../helper/middleware");
const router = require("express").Router();

router.route("/").get(getTags).post(isLogin, isAdmin, postTag);
router.route("/:id").get(getTagById).patch(isLogin, isAdmin, updateTag).delete(isLogin, isAdmin, deleteTag);

module.exports = router;
