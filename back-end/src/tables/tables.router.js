const router = require("express").Router();
const controller = require("./tables.controller");

// router.use((req, res, next) => {
//     console.log(req.url, req.path, req.method);
//     next();
// })

router.route("/new").post(controller.post);
router.route("/:table_id/seat").put(controller.update);
router.route("/").get(controller.list);

module.exports = router;