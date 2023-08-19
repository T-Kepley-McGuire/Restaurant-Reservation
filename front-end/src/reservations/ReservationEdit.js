import React, { useEffect, useState } from "react";
import Reservations from "./Reservations";
import {
  getReservation,
  updateReservation,
} from "../utils/api";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function ReservationEdit() {
  const [reservation, setReservation] = useState({});
  const { reservationId } = useParams();
  useEffect(() => {
    async function loadReservation() {
      try {
        const abortController = new AbortController();
        const res = await getReservation(reservationId, abortController.signal);
        setReservation(res);
      } catch (error) {
        console.error(error);
      }
    }

    loadReservation();
  }, []);
  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <h2>THIS EDITS A RESERVATION</h2>
      </div>
      <Reservations
        reservation={reservation}
        method={updateReservation}
      />
    </main>
  );
}

export default ReservationEdit;
