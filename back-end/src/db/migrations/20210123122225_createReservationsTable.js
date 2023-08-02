exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.varchar("first_name").notNullable();
    table.varchar("last_name").notNullable();
    table.varchar("mobile_number").notNullable();
    table.integer("people").notNullable();
    table.date("reservation_date").notNullable();
    table.time("reservation_time").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
