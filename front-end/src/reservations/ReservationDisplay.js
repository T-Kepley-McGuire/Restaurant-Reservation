import React from "react";
import { formatAsTime } from "../utils/date-time";

import "./ReservationDisplay.css";


/**
 * Displays a page for viewing a list of reservations
 * @param {Array} reservations
 * An array of reservations to display
 * @param {Function} handleCancel
 * A function that handles the behavior of cancelling a reservation 
 * @returns 
 */
function ReservationDisplay({ reservations, handleReservationCancel }) {
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
                <p data-reservation-id-status={res.reservation_id}>
                  {res.status}
                </p>
              </div>
              <div className="card-body">
                <h5>
                  {res.first_name} {res.last_name}
                </h5>
                <p>{res.mobile_number}</p>
              </div>
              <div className="card-footer d-flex justify-content-between p-2">
                {res.status === "booked" ? (
                  <>
                    <a
                      className="btn btn-primary"
                      href={`/reservations/${res.reservation_id}/seat`}
                    >
                      Seat
                    </a>
                    <div className="ml-auto">
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
                        data-reservation-id-cancel={res.reservation_id}
                        className={`btn btn-danger ${
                          res.status === "booked" ? "" : "disabled"
                        }`}
                        onClick={(event) =>
                          handleReservationCancel(event, res.reservation_id)
                        }
                      >
                        <i className="material-icons">cancel</i>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                ) : <p className="note">Finalized reservations may not be altered</p>}
              </div>
            </div>
          );
        })
      ) : (
        <p>No reservations found</p>
      )}
    </div>
  );
}

export default ReservationDisplay;
