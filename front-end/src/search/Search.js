import React, { useState } from "react";

import ErrorAlert from "../layout/ErrorAlert";
import { cancelReservation, listReservations } from "../utils/api";
import ReservationDisplay from "../reservations/ReservationDisplay";
import "./Search.css";

/**
 * Displays a page for searching for reservations according to phone number
 * @returns {JSX.Element}
 */
function Search() {
  const initialState = { mobile_number: "" };
  const [formData, setFormData] = useState({ ...initialState });
  const [reservationsError, setReservationsError] = useState(null);
  // Save searched number to check if the user has actually entered the search bar
  // and to be able to re-update reservation list after cancellations
  const [searchedNumber, setSearchedNumber] = useState(null);
  const [reservations, setReservations] = useState([]);

  const handleChange = async ({ target }) => {
    await setFormData({ ...formData, [target.name]: target.value });
  };

  // For some reason this is the most finiky effect ever
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function getReservations() {
      try {
        const response = await listReservations(
          { mobile_number: formData.mobile_number },
          abortController.signal
        );
        await setReservations(response);
        await setSearchedNumber(formData.mobile_number);
        await setFormData({ ...initialState });
      } catch (error) {
        await setReservationsError(error);
      }
    }
    getReservations();
  };

  const handleReservationCancel = async (event, reservationId) => {
    // Early return if user does not want to cancel reservation
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
      // Update list after cancelling reservations
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
      {true ? (
        <>
          <p>Results for: {searchedNumber}</p>
          <div className="row">
            <ReservationDisplay
              reservations={reservations}
              handleReservationCancel={handleReservationCancel}
            />
          </div>
        </>
      ) : null}
    </main>
  );
}

export default Search;
