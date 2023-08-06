const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.list);
router.route("/new").post(controller.post);

module.exports = router;