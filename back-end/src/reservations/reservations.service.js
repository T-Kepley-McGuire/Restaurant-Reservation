const knex = require("../db/connection");

function list(date) {
  return knex("reservations").select("*").where({ reservation_date: date }).orderBy("reservation_time");
}

function post(data) {
  return knex("reservations")
    .insert(data)
    .returning("*")
    .then((created) => created[0]);
}

module.exports = {
  post,
  list,
};
