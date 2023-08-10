/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function reservationExists(req, res, next) {
  const reservationId = Number(req.params.reservationId);
  const foundReservation = await service.read(reservationId);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ID not found: ${reservationId}`,
  });
}

function hasDate(req, res, next) {
  if (req.query.date) return next();
  next({
    status: 400,
    message: `Please supply a date`,
  });
}

function isCurrentlyOpen(req, res, next) {
  const { reservation_time: time } = req.body.data;
  let [hour, minute] = time.split(":");
  hour = Number(hour);
  mintue = Number(minute);
  if (
    (hour === 10 && minute < 30) ||
    hour < 10 ||
    (hour === 21 && minute > 30) ||
    hour > 21
  )
    return next({
      status: 400,
      message: `Reservations are not open for time ${time}`,
    });
  next();
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
        ? "first_name"
        : !last_name
        ? "last_name"
        : !mobile_number
        ? "mobile_number"
        : !reservation_date
        ? "reservation_date"
        : !reservation_time
        ? "reservation_time"
        : "people"
    }`,
  });
}

function dateIsValidDate(req, res, next) {
  const { reservation_date } = req.body.data;
  let date = new convertToDate(reservation_date);
  if(!Number.isNaN(date.valueOf())) return next();
  next({
    status: 400,
    message: `reservation_date must be date`
  })
}

function timeIsValidTime(req, res, next) {
  const {reservation_time} = req.body.data;
  let time = Date.parse(`01 Jan 1970 ${reservation_time}`)
  if(!Number.isNaN(time)) return next();
  next({
    status: 400,
    message: `reservation_time must be time`
  })
}

function dateNotInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  let [hour, minute] = reservation_time.split(":");
  const today = new Date(Date.now());
  const date = convertToDate(reservation_date);
  date.setUTCHours(hour, minute);
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
    message: `Reservation must be for open day. not closed lol`,
  });
}

function peopleIsANumber(req, res, next) {
  const {people} = req.body.data;
  if(typeof people === "number") return next();
  next({
    status: 400,
    message: `people must be a number`
  })
}

function peopleAboveZero(req, res, next) {
  const { people } = req.body.data;
  if (typeof people === "number" && people >= 1) return next();
  next({
    status: 400,
    message: `Number of people must be greater than 0. Recieved ${people}`,
  });
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
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
  read: [reservationExists, read],
  post: [
    allFieldsExist,
    dateIsValidDate,
    timeIsValidTime,
    dateNotInPast,
    dateNotTuesday,
    isCurrentlyOpen,
    peopleIsANumber,
    peopleAboveZero,
    post,
  ],
};
