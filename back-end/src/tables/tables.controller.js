const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

function allFieldsExist(req, res, next) {
  const { data: { table_name, capacity } = {} } = req.body;
  if (table_name && capacity) return next();

  next({
    status: 400,
    message: `Missing information: ${!table_name ? "table_name" : "capacity"}`,
  });
}

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

function tableIsOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) return next();
  next({
    status: 400,
    message: `Table is not occupied. Cannot remove reservation`,
  });
}

function tableNameLongerThanTwo(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length >= 2) return next();

  next({
    status: 400,
    message: "table_name must be at least 2 characters long",
  });
}

function dataExists(req, res, next) {
  if (req.body.data) return next();
  next({ status: 400, message: `Missing data` });
}

function reservationIdExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (reservation_id) return next();
  next({ status: 400, message: `Missing reservation_id` });
}

async function validReservation(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  res.locals.reservation = reservation;
  if (reservation) return next();
  next({
    status: 404,
    message: `Reservation ${reservation_id} does not exist`,
  });
}

async function tableIsFree(req, res, next) {
  const table_id = Number(req.params.table_id);
  const table = await service.read(table_id);
  res.locals.table = table;
  if (!table.reservation_id) return next();
  next({
    status: 400,
    message: `Table is already occupied`,
  });
}

function reservationLessThanCapacity(req, res, next) {
  const table_id = Number(req.params.table_id);
  const { reservation_id } = req.body.data;
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  if (table.capacity >= reservation.people) return next();
  next({
    status: 400,
    message:
      "Reservation must have no more people than the capacity of the table",
  });
}

function capacityIsNumber(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity === "number") return next();
  next({
    status: 400,
    message: `capacity must be a number`,
  });
}

function reservationNotSeated(req, res, next) {
  if (res.locals.reservation.status === "booked") return next();
  next({
    status: 400,
    message: `Reservation may not be already seated`,
  });
}
function updateResConfig(status) {
  return async function updateReservation(req, res, next) {
    const reservationId = res.locals.reservation
      ? res.locals.reservation.reservation_id
      : res.locals.table.reservation_id;
    await reservationService.updateStatus(reservationId, status);
    next();
  };
}

async function list(req, res, next) {
  const tables = await service.list();
  res.json({ data: tables });
}

async function post(req, res, next) {
  const table = req.body.data;
  const postedTable = await service.post(table);
  res.status(201).json({ data: postedTable });
}

async function update(req, res, next) {
  const tableId = Number(req.params.table_id);
  const { reservation_id } = req.body.data;
  const updatedTable = await service.update(tableId, reservation_id);
  res.json({ data: updatedTable });
}

async function destroy(req, res, next) {
  await service.delete(Number(req.params.table_id));
  res.status(200).json({ data: "Well its gone. What more do you want?" });
}

module.exports = {
  list: [list],
  update: [
    dataExists,
    reservationIdExists,
    validReservation,
    tableIsFree,
    reservationLessThanCapacity,
    reservationNotSeated,
    updateResConfig("seated"),
    update,
  ],
  post: [allFieldsExist, tableNameLongerThanTwo, capacityIsNumber, post],
  delete: [tableExists, tableIsOccupied, updateResConfig("finished"), destroy],
};
