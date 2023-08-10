const router = require("express").Router();
const controller = require("./tables.controller");

// router.use((req, res, next) => {
//     console.log(req.url, req.path, req.method);
//     next();
// })

router.route("/:table_id/seat").put(controller.update).delete(controller.delete);
router.route("/").get(controller.list).post(controller.post);

module.exports = router;