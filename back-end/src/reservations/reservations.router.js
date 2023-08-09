/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/:reservationId").get(controller.read);
router.route("/").get(controller.list);
router.route("/new").post(controller.post);

module.exports = router;
