const service = require("./tables.service");

function allFieldsExist(req, res, next) {
  const { data: { table_name, capacity } = {} } = req.body;

  if (table_name && capacity) return next();

  next({
    status: 400,
    message: `Missing information: ${!table_name ? "table name" : "capacity"}`,
  });
}

function tableNameLongerThanTwo(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length >= 2) return next();

  next({
    status: 400,
    message: "Table name must be at least 2 characters long",
  });
}

async function list(req, res, next) {
  const tables = await service.list();
  res.json({ data: tables });
}

async function post(req, res, next) {
  res.json({ data: "YOU POSTED IT" });
}

module.exports = {
  list: [list],
  post: [allFieldsExist, tableNameLongerThanTwo, post],
};
