import React from "react";

import { postReservation } from "../utils/api";
import Reservations from "./Reservations";

/**
 * Displays page for creating new reservation
 * @returns {JSX.Element}
 */
function ReservationCreate() {
  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <h2>Create New Reservation</h2>
      </div>
      <Reservations method={postReservation}/>
    </main>
  );
}

export default ReservationCreate;
