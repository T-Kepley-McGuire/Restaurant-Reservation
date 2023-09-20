const knex = require("../db/connection");

/**
 * Returns a list of reservations filtered by date
 * @param {Date} date 
 * @returns {Promise}
 */
function listDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

/**
 * Returns a list of reservations filtered by mobile_number
 * @param {String} number 
 * @returns {Promise}
 */
function listNumber(number) {
  return knex("reservations")
    .select("*")
    .where("mobile_number", "like", `%${number}%`)
    .orderBy("reservation_time");
}

/**
 * Returns a single reservation matching reservationId
 * @param {Number} reservationId 
 * @returns {Promise}
 */
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

/**
 * Creates a new reservation and returns a copy
 * @param {Object} data 
 * @returns {Promise}
 */
function post(data) {
  return knex("reservations")
    .insert(data)
    .returning("*")
    .then((created) => created[0]);
}

/**
 * Updates a reservation matching reservation Id and
 * returns a copy of updated reservation
 * @param {Number} reservationId 
 * @param {Object} updatedInfo 
 * @returns {Promise}
 */
function update(reservationId, updatedInfo) {
  return knex("reservations")
    .returning("*")
    .where({ reservation_id: reservationId })
    .update(updatedInfo);
}

/**
 * Updates status of reservation matching reservationId
 * and returns a copy of updated status
 * @param {Number} reservationId 
 * @param {String} status 
 * @returns {Promise}
 */
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
