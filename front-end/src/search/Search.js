import React, { useState } from "react";

import "./Search.css";
import { cancelReservation, listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "../reservations/ReservationDisplay";

function Search() {
  const initialState = { mobile_number: "" };
  const [formData, setFormData] = useState({ ...initialState });
  const [reservationsError, setReservationsError] = useState(null);
  const [searchedNumber, setSearchedNumber] = useState("");
  const [reservations, setReservations] = useState([]);

  const handleChange = async ({ target }) => {
    await setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function getReservations() {
      try {
        await listReservations(
          { mobile_number: formData.mobile_number },
          abortController.signal
        )
          .then(setReservations)
          .then(() => setSearchedNumber(formData.mobile_number));
        await setFormData({ ...initialState });
      } catch (error) {
        await setReservationsError(error);
      }
    }

    getReservations();
  };

  const handleCancel = async (event, reservationId) => {
    if (
      !window.confirm(
        "Do you want to cancel this reservatino? This cannot be undone."
      )
    )
      return;
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await cancelReservation(reservationId, abortController.signal);
      const res = await listReservations(
        { mobile_number: searchedNumber },
        abortController.signal
      );
      await setReservations(res);
    } catch (error) {
      setReservationsError(error);
    }
  };
  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <ErrorAlert error={reservationsError} />
        <form onSubmit={handleSubmit} className="table search form-group m-1">
          <h3>Search:</h3>

          <div className="input">
            <input
              name="mobile_number"
              type="text"
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
              value={formData.mobile_number}
            />
          </div>

          <div className="btn-container">
            <button type="submit" className="btn btn-primary">
              Find
            </button>
          </div>
        </form>
      </div>
      <div className="row">
        <ReservationDisplay
          reservations={reservations}
          handleCancel={handleCancel}
        />
        {/* <ReservationList
          reservations={reservations}
          mobile_number={searchedNumber}
        /> */}
      </div>
    </main>
  );
}

export default Search;
