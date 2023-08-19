import React from "react";
import { formatAsTime } from "../utils/date-time";

import "./ReservationDisplay.css";

function ReservationDisplay({ reservations, handleCancel }) {
  // const handleCancel = (event, reservationId) => {
  //     event.preventDefault();
  //     const abortController = new AbortController();
  //     cancelReservation(reservationId, abortController.signal);
  // }

  return (
    <div className="card-container d-flex flex-wrap">
      {reservations.length ? (
        reservations.map((res, index) => {
          return (
            <div key={index} className="card m-2">
              <div className="card-header d-flex justify-content-between">
                <strong>
                  {res.reservation_date}, {formatAsTime(res.reservation_time)}
                </strong>
                <p>{res.status}</p>
              </div>
              <div className="card-body">
                <h5>
                  {res.first_name} {res.last_name}
                </h5>
                <p>{res.mobile_number}</p>
              </div>
              <div className="card-footer d-flex justify-content-between p-2">
                {res.status === "booked" ? (
                  <a
                    className="btn btn-primary on-top"
                    href={`/reservations/${res.reservation_id}/seat`}
                  >
                    Seat
                  </a>
                ) : null}
                <div className="ml-auto on-top">
                  <a
                    className={`btn btn-success ${
                      res.status === "booked" ? "" : "disabled"
                    }`}
                    href={`/reservations/${res.reservation_id}/edit`}
                  >
                    <i className="material-icons">edit</i>
                    <span>Edit</span>
                  </a>
                  <button
                    className={`btn btn-danger ${
                      res.status === "booked" ? "" : "disabled"
                    }`}
                    data-reservation-id-cancel={reservations.reservation_id}
                    onClick={(event) => handleCancel(event, res.reservation_id)}
                  >
                    <i className="material-icons">cancel</i>
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
              <a
                className={`overlay ${
                  res.status === "booked" ? "" : "disabled"
                }`}
                href={`/reservations/${res.reservation_id}/edit`}
              />
            </div>
          );
        })
      ) : (
        <p>aint nothin here</p>
      )}
    </div>
  );
}

export default ReservationDisplay;
