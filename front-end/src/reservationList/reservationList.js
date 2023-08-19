import React from "react";
import { formatAsTime } from "../utils/date-time";

function ReservationList({ reservations, date, mobile_number }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Customer Info</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length ? (
            reservations.map((res, index) => {
              return (
                <tr key={index}>
                  <td>
                    <p>{res.reservation_date}</p>
                    <p>{formatAsTime(res.reservation_time)}</p>
                  </td>
                  <td>
                    <p>
                      <strong>
                        {res.first_name} {res.last_name}
                      </strong>
                    </p>
                    <p>{res.mobile_number}</p>
                  </td>
                  <td data-reservation-id-status={res.reservation_id}>
                    <p>{res.status}</p>
                    {res.status === "booked" ? (
                      <a
                        className="btn btn-primary"
                        href={`/reservations/${res.reservation_id}/seat`}
                      >
                        Seat
                      </a>
                    ) : null}
                  </td>
                  <td>
                    {/* {res.status === "booked" ? (
                      <a
                        className="btn btn-primary"
                        href={`/reservations/${res.reservation_id}/seat`}
                      >
                        Seat
                      </a>
                    ) : null} */}
                    <a
                      className="btn btn-success"
                      href={`/reservations/${res.reservation_id}/edit`}
                    >
                      Edit
                    </a>
                    <button
                      className="btn btn-danger"
                      data-reservation-id-cancel={reservations.reservation_id}
                    >
                      Cancel
                    </button>
                  </td>
                  {/* <td>
                    {res.first_name} {res.last_name}
                  </td>
                  <td>{res.mobile_number}</td>
                  <td>{res.reservation_date}</td>
                  <td>{formatAsTime(res.reservation_time)}</td>
                  <td data-reservation-id-status={res.reservation_id}>
                    {res.status}
                  </td>
                  <td>
                    {res.status === "booked" ? (
                      <a
                        className="btn btn-primary"
                        href={`/reservations/${res.reservation_id}/seat`}
                      >
                        Seat
                      </a>
                    ) : null}
                  </td>
                  <td className="btn-container">
                    <a
                      className="btn btn-success"
                      href={`/reservations/${res.reservation_id}/edit`}
                    >
                      Edit
                    </a>
                  </td> */}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4">
                <p>
                  {date
                    ? `No reservations for date ${date}`
                    : mobile_number
                    ? `No reservations for ${mobile_number}`
                    : ""}
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationList;
