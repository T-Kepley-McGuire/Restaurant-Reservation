const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const service = require("./reservations.service");

async function reservationExists(req, res, next) {
  const reservationId = Number(req.params.reservationId);
  const foundReservation = await service.read(reservationId);
  res.locals.reservation = foundReservation;
  if (foundReservation) return next();

  next({
    status: 404,
    message: `Reservation ID not found: ${reservationId}`,
  });
}

function reservationIsEditable(req, res, next) {
  if (res.locals.reservation.status === "booked") return next();
  next({
    status: 400,
    message: `Reservation may only be edited if it is still booked`,
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

function hasDateOrNumber(req, res, next) {
  if (
    req.query.date ||
    req.query.mobile_number ||
    req.query.mobile_number === ""
  )
    return next();
  next({
    status: 400,
    message: `Please supply a ${req.query.date ? "mobile_number" : "date"}`,
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

function dateIsValidDate(req, res, next) {
  const { reservation_date } = req.body.data;
  let date = new convertToDate(reservation_date);
  if (!Number.isNaN(date.valueOf())) return next();
  next({
    status: 400,
    message: `reservation_date must be date`,
  });
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

function dateNotTuesday(req, res, next) {
  const { reservation_date: date } = req.body.data;
  if (convertToDate(date).getDay() !== 2) return next();
  next({
    status: 400,
    message: `Reservation must be made for a day that the restaurant is open`,
  });
}

function convertToDate(date) {
  let [year, month, day] = date.split("-");
  month -= 1;
  return new Date(year, month, day);
}

function timeIsValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  let time = Date.parse(`01 Jan 1970 ${reservation_time}`);
  if (!Number.isNaN(time)) return next();
  next({
    status: 400,
    message: `reservation_time must be time`,
  });
}

function peopleIsANumber(req, res, next) {
  const { people } = req.body.data;
  if (typeof people === "number") return next();
  next({
    status: 400,
    message: `people must be a number`,
  });
}

function peopleAboveZero(req, res, next) {
  const { people } = req.body.data;
  if (typeof people === "number" && people >= 1) return next();
  next({
    status: 400,
    message: `Number of people must be greater than 0. Recieved ${people}`,
  });
}

function statusIsBooked(req, res, next) {
  const { status } = req.body.data;
  if (!status || status === "booked") return next();
  next({
    status: 400,
    message: `Status must be "booked", not ${status}`,
  });
}

function statusIsValid(req, res, next) {
  const { status } = req.body.data;
  if (["booked", "seated", "finished", "cancelled"].includes(status))
    return next();
  next({
    status: 400,
    message: `Status ${status} is not valid. Please provide "booked", "seated", or "finished"`,
  });
}

function statusIsNotFinished(req, res, next) {
  if (res.locals.reservation.status !== "finished") return next();
  next({
    status: 400,
    message: `Status of reservation must not already be finished`,
  });
}

function statusBookedToCancelled(req, res, next) {
  if (
    req.body.data.status !== "cancelled" ||
    res.locals.reservation.status === "booked"
  )
    return next();
  next({
    status: 400,
    message: `Only reservations that are currently 'booked' may be cancelled`,
  });
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function list(req, res) {
  const number = req.query.mobile_number;
  const date = req.query.date;
  const reservationList = date
    ? await service.listDate(date)
    : await service.listNumber(number);

  res.json({ data: reservationList });
}

async function post(req, res) {
  const newReservation = await service.post(req.body.data);

  res.status(201).json({ data: newReservation });
}

async function update(req, res, next) {
  const reservationId = res.locals.reservation.reservation_id;
  const newReservation = req.body.data;
  const updatedStatus = await service.update(reservationId, newReservation);
  res.status(200).json({ data: updatedStatus[0] });
}

async function updateStatus(req, res, next) {
  const reservationId = res.locals.reservation.reservation_id;
  const { status } = req.body.data;
  const updatedStatus = await service.updateStatus(reservationId, status);
  res.status(200).json({ data: { status: updatedStatus[0].status } });
}

module.exports = {
  list: [hasDateOrNumber, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  post: [
    allFieldsExist,
    dateIsValidDate,
    timeIsValidTime,
    dateNotInPast,
    dateNotTuesday,
    isCurrentlyOpen,
    peopleIsANumber,
    peopleAboveZero,
    statusIsBooked,
    asyncErrorBoundary(post),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    reservationIsEditable,
    allFieldsExist,
    dateIsValidDate,
    timeIsValidTime,
    peopleIsANumber,
    peopleAboveZero,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusIsValid,
    statusIsNotFinished,
    statusBookedToCancelled,
    asyncErrorBoundary(updateStatus),
  ],
};
