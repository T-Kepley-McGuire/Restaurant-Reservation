import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import ErrorAlert from "../layout/ErrorAlert";
import {
  cancelReservation,
  listReservations,
  listTables,
  removeReservation,
} from "../utils/api";
import { previous, today, next } from "../utils/date-time";
import ReservationDisplay from "../reservations/ReservationDisplay";
import "./Dashboard.css";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  
  useEffect(loadDashboard, [date]);
  
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
    
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    
    return () => abortController.abort();
  }
  
  // Function to change url to new date
  const history = useHistory();
  function moveDates(toDate) {
    history.push(`/dashboard?date=${toDate}`);
  }

  // Function to remove a reservation from a table
  async function unSeatTable(tableId) {
    // Early return if user does not want to unseaet table
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

  // Function to cancel a reservation
  async function handleReservationCancel(event, reservationId) {
    // Early return if user does not want to cancel
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
        handleReservationCancel={handleReservationCancel}
      />
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
