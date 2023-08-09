const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

function allFieldsExist(req, res, next) {
  const { table: { table_name, capacity } = {} } = req.body.data;

  if (table_name && capacity) return next();

  next({
    status: 400,
    message: `Missing information: ${!table_name ? "table name" : "capacity"}`,
  });
}

function tableNameLongerThanTwo(req, res, next) {
  const { table_name } = req.body.data.table;
  if (table_name.length >= 2) return next();

  next({
    status: 400,
    message: "Table name must be at least 2 characters long",
  });
}

async function reservationLessThanCapacity(req, res, next) {
  const table_id = Number(req.params.table_id);
  const { reservation_id } = req.body.data;
  const table = await service.read(table_id);
  const reservation = await reservationService.read(reservation_id);
  if (table.capacity >= reservation.people) return next();
  next({
    status: 400,
    message:
      "Reservation must have no more people than the capacity of the table",
  });
}

async function list(req, res, next) {
  const tables = await service.list();
  res.json({ data: tables });
}

async function post(req, res, next) {
  const { table } = req.body.data;
  const postedTable = await service.post(table);
  res.status(201).json({ data: postedTable });
}

async function update(req, res, next) {
  const table_id = Number(req.params.table_id);
  const { reservation_id } = req.body.data;
  const updatedTable = await service.update(table_id, reservation_id);
  res.json({ data: updatedTable });
}

module.exports = {
  list: [list],
  update: [reservationLessThanCapacity, update],
  post: [allFieldsExist, tableNameLongerThanTwo, post],
};
