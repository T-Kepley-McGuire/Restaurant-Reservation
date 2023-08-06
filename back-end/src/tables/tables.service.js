const knex = require("../db/connection");

function list() {
  return knex("tables").select("*");
}

function post(data) {
  return knex("tables")
    .insert(data)
    .returning("*")
    .then((created) => created[0]);
}

module.exports = {
    post,
    list
}
