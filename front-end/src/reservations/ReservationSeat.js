import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getReservation, listTables, seatReservation } from "../utils/api";

import "./ReservationSeat.css";

function ReservationSeat() {
  const history = useHistory();
  const { reservationId } = useParams();

  const [table, setTable] = useState(undefined);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  useEffect(() => {
    const abortController = new AbortController();

    getReservation(reservationId, abortController.signal)
      .then(setReservation)
      .catch(console.log);
    listTables(abortController.signal).then(setTables).catch(console.log);

    return () => abortController.abort();
  }, []);
  
    const handleChange = async ({ target }) => {
      await setTable(target.value);
    };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function submit() {
      try {
        await seatReservation(table, reservationId, abortController.signal);
        setTable(undefined);
        history.push("/dashboard");
      } catch (error) {
        console.log(error);
      }
    }

    if (table) submit();
    else console.log("cannot submit without a table");
  };

  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <h2>Seat Reservation {reservationId}</h2>
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
                        return reservation.people <= table.capacity ? (
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
