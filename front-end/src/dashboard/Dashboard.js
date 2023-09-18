import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  cancelReservation,
  listReservations,
  listTables,
  removeReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";

import "./Dashboard.css";
import ReservationDisplay from "../reservations/ReservationDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  // const query = useQuery();
  // const date = query.get("date");

  const history = useHistory();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);
  
  // useEffect(() => {
    
  //   async function waitThenQuery() {
  //     await setTimeout(() => null, 1000);
  //     const allButtons = await Array.from(document.querySelectorAll("[data-here]"));
  //     console.log(allButtons);
  //   }

  //   waitThenQuery();
  // }, [])

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  function moveDates(toDate) {
    history.push(`/dashboard?date=${toDate}`);
  }

  async function unSeatTable(tableId) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      await removeReservation(tableId, abortController.signal);
      listTables(abortController.signal).then(setTables).catch(setTablesError);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
    }
  }

  const handleCancel = async (event, reservationId) => {
    if (
      !window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    )
      return;
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await cancelReservation(reservationId, abortController.signal);
      const res = await listReservations({ date }, abortController.signal);
      await setReservations(res);
    } catch (error) {
      setReservationsError(error);
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <div className="btn-container navigate">
        <button
          onClick={() => moveDates(previous(date))}
          className="btn btn-secondary"
        >
          Previous
        </button>
        <button onClick={() => moveDates(today())} className="btn btn-success">
          Today
        </button>
        <button
          onClick={() => moveDates(next(date))}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ReservationDisplay
        reservations={reservations}
        handleCancel={handleCancel}
      />
      {/* <ReservationList reservations={reservations} date={date}/> */}
      {/* <div className="table">
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
                    {res.status === "booked" ? (<td className="btn-container">
                      <a
                        className="btn btn-primary"
                        href={`/reservations/${res.reservation_id}/seat`}
                      >
                        Seat
                      </a>
                    </td>) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">
                  <p>No reservations for date {date}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
      <br />
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Table</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {tables.length ? (
              tables.map((table, index) => {
                return (
                  <tr key={index}>
                    <td>{table.table_name}</td>
                    <td>{table.capacity}</td>
                    <td>
                      {table.reservation_id ? (
                        <div data-table-id-status={table.table_id}>
                          Occupied
                        </div>
                      ) : (
                        <div data-table-id-status={table.table_id}>
                          Free
                        </div>
                      )}
                    </td>
                    <td>
                      {table.reservation_id ? (
                        <button
                          className="btn btn-primary"
                          data-table-id-finish={table.table_id}
                          
                          onClick={() => unSeatTable(table.table_id)}
                        >
                          Finish
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>No tables found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
