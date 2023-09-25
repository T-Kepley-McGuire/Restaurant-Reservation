import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import ErrorAlert from "../layout/ErrorAlert";
import { postTable } from "../utils/api";

/**
 * Displays a form for creating a new table
 * @returns {JSX.Element}
 */
function Tables() {
  // Save error state so that form may not be submitted when erronious 
  // and user knows what the problem is
  const initialErrorState = {
    nameError: false,
    capacityError: false,
  };
  const [formData, setFormData] = useState({});
  const [validationChecks, setValidationChecks] = useState({
    ...initialErrorState,
  });
  const [postError, setPostError] = useState(null);

  const checkNameLength = (name) => {
    if (name.length < 2) {
      setValidationChecks({
        ...validationChecks,
        nameError: {
          message: "Please enter a name at least two characters long",
        },
      });
    } else {
      setValidationChecks({
        ...validationChecks,
        nameError: false,
      });
    }
  };

  const checkCapacity = (num) => {
    num = Number(num);
    if (num < 1) {
      setValidationChecks({
        ...validationChecks,
        capacityError: { message: "Capacity must at least be 1" },
      });
    } else {
      setValidationChecks({
        ...validationChecks,
        capacityError: false,
      });
    }
  };

  const handleChange = async ({ target }) => {
    // Obv check for errors while user is entering data
    if (target.name === "table_name" && target.value !== "") {
      checkNameLength(target.value);
    } else if (target.name === "capacity" && target.value !== "") {
      checkCapacity(target.value);
    }
    await setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function create() {
      try {
        await postTable(
          { ...formData, capacity: Number(formData.capacity) },
          abortController.signal
        );
        setFormData({}); // RESET FORM
        history.push("/dashboard");
      } catch (error) {
        await setPostError(error);
      }
    }
    if(formData.table_name && formData.table_name.length >= 2) {
      create();
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <main className="col-m-7 m-2">
      <h2>Create new table</h2>
      <ErrorAlert error={postError} />
      <ErrorAlert error={validationChecks.nameError} />
      <ErrorAlert error={validationChecks.capacityError} />
      <div className="row">
        <div className="table form">
          <form className="form-group m-1" onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label>Table name:</label>
                  </td>
                  <td>
                    <input
                      name="table_name"
                      type="text"
                      onChange={handleChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Capacity:</label>
                  </td>
                  <td>
                    <input
                      name="capacity"
                      type="number"
                      onChange={handleChange}
                      required
                    />
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

export default Tables;
