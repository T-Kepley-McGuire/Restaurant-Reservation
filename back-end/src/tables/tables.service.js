const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(tableId) {
  return knex("tables").select("*").where({table_id: tableId}).first();
}

function post(data) {
  return knex("tables")
    .insert(data)
    .returning("*")
    .then((created) => created[0]);
}

function update(tableId, reservationId) {
  return knex("tables")
    .returning(["table_id", "capacity", "reservation_id"])
    .where({ table_id: tableId })
    .update({ reservation_id: reservationId });
}

module.exports = {
  post,
  update,
  list,
  read
};
