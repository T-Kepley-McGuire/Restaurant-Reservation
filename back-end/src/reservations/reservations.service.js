const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function post(data) {
  return knex("reservations")
    .insert(data)
    .returning("*")
    .then((created) => created[0]);
}

function update(reservationId, status) {
  return knex("reservations")
    .returning("*")
    .where({ reservation_id: reservationId })
    .update({ status: status });
}

module.exports = {
  post,
  list,
  read,
  update,
};
