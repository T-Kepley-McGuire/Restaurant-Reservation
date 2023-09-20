/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Route PUT, DELETE /tables/:table_id/seat
router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.removeReservation)
  .all(methodNotAllowed);

// Route GET, POST /tables
router
  .route("/")
  .get(controller.list)
  .post(controller.post)
  .all(methodNotAllowed);

module.exports = router;
