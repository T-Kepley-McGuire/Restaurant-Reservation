import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

import { postReservation } from "../utils/api";

import "./Reservations.css";
import { dayOfWeek, isInPast } from "../utils/date-time";

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
  const [formData, setFormData] = useState({ ...initialState });
  const [formValidationChecks, setFormValidationChecks] = useState({});
  const [postError, setPostError] = useState(null);

  const handleChange = async ({ target }) => {
    if (target.name === "people" && target.value !== "") {
      if (target.value < 1)
        setFormValidationChecks({
          ...formValidationChecks,
          peopleError: true,
        });
      else
        setFormValidationChecks({
          ...formValidationChecks,
          peopleError: false,
        });
    }

    if (target.name === "reservation_date" && target.value !== "") {
      if (isInPast(target.value, formData.reservation_time)) {
        setFormValidationChecks({
          ...formValidationChecks,
          dateError: {
            message: "Reservations may not be made for a date in the past",
          },
        });
      } else if (dayOfWeek(target.value) === 2) {
        setFormValidationChecks({
          ...formValidationChecks,
          dayOfWeekError: { message: "Reservations are not open on Tuesdays" },
        });
      } else {
        setFormValidationChecks({
          ...formValidationChecks,
          dayOfWeekError: false,
        });
      }
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
      setFormValidationChecks({
        ...formValidationChecks,
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
      {formValidationChecks.dayOfWeekError && (
        <ErrorAlert error={formValidationChecks.dayOfWeekError} />
      )}
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
                    {formValidationChecks.peopleError && (
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
