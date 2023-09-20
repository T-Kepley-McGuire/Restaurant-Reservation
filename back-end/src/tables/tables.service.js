const knex = require("../db/connection");

/**
 * Returns a list of all tables sorted by table_name
 * @returns {Promise}
 */
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

/**
 * Returns a single table matching tableId
 * @param {Number} tableId 
 * @returns {Promise}
 */
function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

/**
 * Creates a new table from data and returns a copy
 * @param {Object} data 
 * @returns {Promise}
 */
function post(data) {
  return knex("tables")
    .insert(data)
    .returning("*")
    .then((created) => created[0]);
}

/**
 * Updates a table matching tableId to include reservationId
 * as the occupying reservation
 * @param {String} tableId 
 * @param {String} reservationId 
 * @returns {Promise}
 */
function update(tableId, reservationId) {
  return knex("tables")
    .returning(["table_id", "capacity", "reservation_id"])
    .where({ table_id: tableId })
    .update({ reservation_id: reservationId });
}

/**
 * Removes a reservation from a table matching tableId 
 * @param {String} tableId 
 * @returns {Promise}
 */
function removeReservation(tableId) {
  return knex("tables").where({ table_id: tableId }).update({ reservation_id: null});
}

module.exports = {
  post,
  update,
  list,
  read,
  removeReservation
};
