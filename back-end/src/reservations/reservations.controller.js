/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

function hasDate(req, res, next) {
  if (req.query.date) return next();
  next({
    status: 400,
    message: `Please supply a date`,
  });
}

function allFieldsExist(req, ignore, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = {},
  } = req.body;
  if (
    first_name &&
    last_name &&
    mobile_number &&
    reservation_date &&
    reservation_time &&
    people
  )
    return next();
  next({
    status: 400,
    message: `Missing information: ${
      !first_name
        ? "first name"
        : !last_name
        ? "last name"
        : !mobile_number
        ? "phone number"
        : !reservation_date
        ? "reservation date"
        : !reservation_time
        ? "reservation time"
        : "people"
    }`,
  });
}

function dateNotInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  let [hour, minute] = reservation_time.split(":");
  const today = new Date(Date.now());
  const date = convertToDate(reservation_date);
  date.setHours(hour, minute);
  console.log(date);
  if (date.valueOf() >= today.valueOf()) {
    return next();
  }
  next({
    status: 400,
    message: `Date must be in future. Supplied date: ${reservation_date} ${reservation_time}`,
  });
}

function convertToDate(date) {
  let [year, month, day] = date.split("-");
  month -= 1;
  return new Date(year, month, day);
}

function dateNotTuesday(req, res, next) {
  const { reservation_date: date } = req.body.data;
  if (convertToDate(date).getDay() !== 2) return next();
  next({
    status: 400,
    message: `Reservation must be for open day`,
  });
}

function peopleAboveZero(req, res, next) {
  const { people } = req.body.data;
  if (people >= 1) return next();
  next({
    status: 400,
    message: `Number of people must be greater than 0. Recieved ${people}`,
  });
}

async function list(req, res) {
  const reservationList = await service.list(req.query.date);

  res.json({ data: reservationList });
}

async function post(req, res) {
  const newReservation = await service.post(req.body.data);

  res.status(201).json({ data: newReservation });
}

module.exports = {
  list: [hasDate, list],
  post: [allFieldsExist, dateNotInPast, dateNotTuesday, peopleAboveZero, post],
};
