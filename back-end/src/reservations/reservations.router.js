/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

// router.use((req, res, next) => {
//     console.log(req.originalUrl, req.url, req.query);
//     next();
// })

router.route("/:reservationId/status").put(controller.update);
router.route("/:reservationId").get(controller.read);
router.route("/").get(controller.list).post(controller.post);

module.exports = router;
