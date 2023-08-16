import React from "react";
import { formatAsTime } from "../utils/date-time";

function ReservationList({ reservations, date, mobile_number }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Seat Table</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length ? (
            reservations.map((res, index) => {
              return (
                <tr key={index}>
                  <td>
                    {res.first_name} {res.last_name}
                  </td>
                  <td>{res.mobile_number}</td>
                  <td>{res.reservation_date}</td>
                  <td>{formatAsTime(res.reservation_time)}</td>
                  <td data-reservation-id-status={res.reservation_id}>
                    {res.status}
                  </td>
                  {res.status === "booked" ? (
                    <td className="btn-container">
                      <a
                        className="btn btn-primary"
                        href={`/reservations/${res.reservation_id}/seat`}
                      >
                        Seat
                      </a>
                    </td>
                  ) : null}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4">
                <p>{date ? `No reservations for date ${date}` : mobile_number ? `No reservations for ${mobile_number}` : ""}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationList;
