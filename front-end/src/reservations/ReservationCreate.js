import React from "react";
import Reservations from "./Reservations";
import { postReservation } from "../utils/api";

function ReservationCreate() {
  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <h2>THIS CREATES A NEW RESERVATION</h2>
      </div>
      <Reservations method={postReservation}/>
    </main>
  );
}

export default ReservationCreate;
