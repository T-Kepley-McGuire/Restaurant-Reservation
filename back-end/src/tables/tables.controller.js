const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*
  Check if request body has data property
*/
function dataExists(req, res, next) {
  if (req.body.data) return next();
  next({ status: 400, message: `Missing data` });
}

/*
  Check if all fields exist in request body
  table_name, capacity
*/
function allFieldsExist(req, res, next) {
  const { data: { table_name, capacity } = {} } = req.body;
  if (table_name && capacity) return next();

  next({
    status: 400,
    message: `Missing information: ${!table_name ? "table_name" : "capacity"}`,
  });
}

/*
  Check if table from request params :table_id exists in database
*/
async function tableExists(req, res, next) {
  const tableId = Number(req.params.table_id);
  const table = await service.read(tableId);
  res.locals.table = table;
  if (table) return next();
  next({
    status: 404,
    message: `table_id ${tableId} does not correspond to table`,
  });
}

/*
  Check if retrieved table is currently occupied by reservation
  **continues to next if table IS occupied**
*/
function tableIsOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) return next();
  next({
    status: 400,
    message: `Table is not occupied. Cannot remove reservation`,
  });
}

/*
  Check if retrieved table is currently open
*/
function tableIsFree(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) return next();
  next({
    status: 400,
    message: `Table is already occupied`,
  });
}

/*
  Check if table name is valid length
  **continues to next if name length >= 2**
*/
function tableNameLongerThanTwo(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length >= 2) return next();

  next({
    status: 400,
    message: "table_name must be at least 2 characters long",
  });
}

/*
  Check if reservationId is in request body
*/
function reservationIdInBody(req, res, next) {
  const { reservation_id } = req.body.data;
  if (reservation_id) return next();
  next({ status: 400, message: `Missing reservation_id` });
}

/*
  Check if reservationId in request body corresponds to
  reservation in database
*/
async function reservationIsInDatabase(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  res.locals.reservation = reservation;
  if (reservation) return next();
  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist`,
  });
}

/*
  Check if retrieved reservation is NOT seated yet (must be booked)
*/
function reservationNotSeated(req, res, next) {
  if (res.locals.reservation.status === "booked") return next();
  next({
    status: 400,
    message: `Reservation may not be seated if already ${res.locals.reservation.status}`,
  });
}

/*
  Check if retrieved reservation size is less than or 
  equal to capacity of retrieved table
*/
function reservationLessThanCapacity(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  if (table.capacity >= reservation.people) return next();
  next({
    status: 400,
    message:
      "Reservation must have no more people than the capacity of the table",
  });
}

/**
 * Returns function that PUTs updated status to reservation database
 * @param {String} status 
 * @returns {Function}
 */
function updateResConfig(status) {
  return async function updateReservation(req, res, next) {
    // Use reservation_id from either reservation or from
    // table to update the status. Prefer to use reservation
    const reservationId = res.locals.reservation
      ? res.locals.reservation.reservation_id
      : res.locals.table.reservation_id;
    await reservationService.updateStatus(reservationId, status);
    next();
  };
}

/*
  Check if capacity in request body is a number
*/
function capacityIsNumber(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity === "number") return next();
  next({
    status: 400,
    message: `capacity must be a number`,
  });
}

/**
 * Sends list of all tables
 * @responds array of table objects
 */
async function list(req, res, next) {
  const tables = await service.list();
  res.json({ data: tables });
}

/**
 * Posts a new table
 * @request table data
 * @responds table object containing copy of posted table
 */
async function post(req, res, next) {
  const table = req.body.data;
  const postedTable = await service.post(table);
  res.status(201).json({ data: postedTable });
}

/**
 * Updates a table with reservation information
 * @request table_id, reservation_id
 * @responds table object containing copy of updated table 
 */
async function update(req, res, next) {
  const tableId = Number(req.params.table_id);
  const { reservation_id } = req.body.data;
  const updatedTable = await service.update(tableId, reservation_id);
  res.json({ data: updatedTable });
}

/**
 * Removes any reservations listed under table_id
 * @request table_id
 * @reponds status 201
 */
async function removeReservation(req, res, next) {
  await service.removeReservation(Number(req.params.table_id));
  res.status(200).json({ data: "Well its gone. What more do you want?" });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  update: [
    dataExists,
    reservationIdInBody,
    asyncErrorBoundary(reservationIsInDatabase),
    asyncErrorBoundary(tableExists),
    tableIsFree,
    reservationLessThanCapacity,
    reservationNotSeated,
    asyncErrorBoundary(updateResConfig("seated")),
    asyncErrorBoundary(update),
  ],
  post: [
    allFieldsExist,
    tableNameLongerThanTwo,
    capacityIsNumber,
    asyncErrorBoundary(post),
  ],
  removeReservation: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(updateResConfig("finished")),
    asyncErrorBoundary(removeReservation),
  ],
};
