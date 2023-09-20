/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Route PUT /reservations/:reservationId/status
router
  .route("/:reservationId/status")
  .put(controller.updateStatus)
  .all(methodNotAllowed);

// Route GET, PUT /reservations/:reservationId
router
  .route("/:reservationId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

// Route GET, POST /reservations
router
  .route("/")
  .get(controller.list)
  .post(controller.post)
  .all(methodNotAllowed);

module.exports = router;
