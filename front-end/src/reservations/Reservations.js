import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

import { postReservation } from "../utils/api";

import "./Reservations.css";
import { dayOfWeek, isInPast, currentlyClosed } from "../utils/date-time";

function Reservations() {
  const history = useHistory();
  const initialState = {
    first_name: "ur",
    last_name: "mom",
    mobile_number: "555-555-5555",
    reservation_date: "2023-08-03",
    reservation_time: "12:05:00",
    people: 5,
  };
  const initialErrorState = {
    dayError: false,
    peopleError: false,
    reservationInPastError: false,
    timeError: false,
  };
  const [formData, setFormData] = useState({ ...initialState });
  const [validationChecks, setValidationChecks] = useState({
    ...initialErrorState,
  });
  const [postError, setPostError] = useState(null);

  const checkNumberOfPeople = (num) => {
    if (num < 1) {
      setValidationChecks({
        ...validationChecks,
        peopleError: true,
      });
    } else {
      setValidationChecks({
        ...validationChecks,
        peopleError: false,
      });
    }
  };

  const checkIfInPast = (date, time) => {
    setValidationChecks((prevValidationChecks) => ({
      ...prevValidationChecks,
      reservationInPastError: isInPast(date, time)
        ? {
            message: "Reservations may not be made anytime in the past",
          }
        : false,
    }));
  };

  const checkDayOfWeek = (date) => {
    setValidationChecks((prevValidationChecks) => ({
      ...prevValidationChecks,
      dayError:
        dayOfWeek(date) === 2
          ? { message: "Reservations are not open on Tuesdays" }
          : false,
    }));
  };

  const checkIfClosed = (time) => {
    setValidationChecks((prevValidationChecks) => ({
      ...prevValidationChecks,
      timeError: currentlyClosed(time)
        ? {
            message:
              "Reservations may not be made for this time. Please pick a time between 10:30am and 9:30pm",
          }
        : false,
    }));
  };

  const handleChange = async ({ target }) => {
    if (target.name === "people" && target.value !== "") {
      checkNumberOfPeople(target.value);
    } else if (target.name === "reservation_date" && target.value !== "") {
      checkIfInPast(target.value, formData.reservation_time);
      checkDayOfWeek(target.value);
    } else if (target.name === "reservation_time" && target.value !== "") {
      checkIfInPast(
        formData.reservation_date ? formData.reservation_date : "1970-01-01",
        target.value
      );
      checkIfClosed(target.value);
    }

    await setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function create() {
      try {
        await postReservation(formData, abortController.signal);
        setFormData({ ...initialState }); // RESET FORM
        history.push("/dashboard");
      } catch (error) {
        await setPostError(error);
      }
    }
    if (!formData.people || formData.people < 1) {
      setValidationChecks({
        ...validationChecks,
        peopleError: true,
      });
    } else create();
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <h2>THIS CREATES A NEW RESERVATION</h2>
      </div>

      <ErrorAlert error={postError} />
      <ErrorAlert error={validationChecks.dayError} />
      <ErrorAlert error={validationChecks.reservationInPastError} />
      <ErrorAlert error={validationChecks.timeError} />
      <div className="row">
        <div className="table form">
          <form className="form-group m-1" onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label>First name: </label>
                  </td>
                  <td>
                    <input
                      name="first_name"
                      type="text"
                      onChange={handleChange}
                      value={formData.first_name}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Last name: </label>
                  </td>
                  <td>
                    <input
                      name="last_name"
                      type="text"
                      onChange={handleChange}
                      value={formData.last_name}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Phone number: </label>
                  </td>
                  <td>
                    <input
                      name="mobile_number"
                      type="tel"
                      onChange={handleChange}
                      value={formData.mobile_number}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Reservation date: </label>
                  </td>
                  <td>
                    <input
                      name="reservation_date"
                      type="date"
                      onChange={handleChange}
                      value={formData.reservation_date}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Reservation time: </label>
                  </td>
                  <td>
                    <input
                      name="reservation_time"
                      type="time"
                      onChange={handleChange}
                      value={formData.reservation_time}
                      required
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Number of people: </label>
                  </td>
                  <td>
                    <input
                      name="people"
                      type="number"
                      onChange={handleChange}
                      value={formData.people}
                      required
                    />
                    {validationChecks.peopleError && (
                      <p className="validation-error">
                        Number of people must be greater than 0
                      </p>
                    )}
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

export default Reservations;
