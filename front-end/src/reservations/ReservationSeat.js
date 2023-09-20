import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import ErrorAlert from "../layout/ErrorAlert";
import { getReservation, listTables, seatReservation } from "../utils/api";
import "./ReservationSeat.css";

/**
 * Displays a page for seating a reservation
 * @returns {JSX.Element}
 */
function ReservationSeat() {
  const history = useHistory();
  const { reservationId } = useParams();

  // Save current table selected to ensure user does not seat at non-existent table
  const [table, setTable] = useState(undefined);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [seatingError, setSeatingError] = useState(false);

  // Load reservation on page load
  useEffect(() => {
    const abortController = new AbortController();

    getReservation(reservationId, abortController.signal)
      .then(setReservation)
      .catch(console.error);
    listTables(abortController.signal).then(setTables).catch(console.error);

    return () => abortController.abort();
  }, [reservationId]);

  const handleChange = async ({ target }) => {
    await setTable(target.value);
  };

  const handleCancel = () => {
    history.goBack();
  };

  // Submit seating assignemnt, but only if table is selected. Check for status errors
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function submit() {
      try {
        await seatReservation(table, reservationId, abortController.signal);
        setTable(undefined);
        history.push("/dashboard");
      } catch (error) {
        await setSeatingError(error);
        console.error(error);
      }
    }
    if (table) submit();
    else {
      const error = {message: "cannot submit without a table"};
      setSeatingError(error);
      console.error(error);
    }
  };

  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <h2>Seat Reservation {reservationId}</h2>
      </div>
      <div className="row">
        <ErrorAlert error={seatingError} />
      </div>
      <div className="row">
        <p>Reservation size: {reservation.people}</p>
      </div>
      <div className="row">
        <div className="table form">
          <form className="form-group m-1" onSubmit={handleSubmit}>
            <table>
              <thead>
                <tr>
                  <th colSpan={2}>Select a table to seat the reservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label>Table Number: </label>
                  </td>
                  <td>
                    <select
                      defaultValue="default"
                      name="table_id"
                      onChange={handleChange}
                    >
                      <option value="default" disabled hidden>
                        Please Choose...
                      </option>
                      {tables.map((table, index) => {
                        return reservation.people <= table.capacity &&
                          !table.reservation_id ? (
                          <option key={index} value={table.table_id}>
                            {table.table_name} - {table.capacity}
                          </option>
                        ) : (
                          <option disabled key={index} value={table.table_name}>
                            {table.table_name} - {table.capacity}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="btn-container">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="submit btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ReservationSeat;
