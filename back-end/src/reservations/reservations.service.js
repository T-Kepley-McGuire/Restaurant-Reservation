const knex = require("../db/connection");

function listDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function listNumber(number) {
  return knex("reservations")
    .select("*")
    .where("mobile_number", "like", `%${number}%`)
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

function update(reservationId, updatedInfo) {
  return knex("reservations")
    .returning("*")
    .where({ reservation_id: reservationId })
    .update(updatedInfo);
}

function updateStatus(reservationId, status) {
  return knex("reservations")
    .returning("*")
    .where({ reservation_id: reservationId })
    .update({ status: status });
}

module.exports = {
  post,
  listDate,
  listNumber,
  read,
  update,
  updateStatus,
};
