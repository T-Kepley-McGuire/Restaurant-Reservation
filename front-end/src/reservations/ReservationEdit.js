import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import {
  getReservation,
  updateReservation,
} from "../utils/api";
import Reservations from "./Reservations";

/**
 * Displays a page for editing a reservation
 * @returns {JSX.Element}
 */
function ReservationEdit() {
  const [reservation, setReservation] = useState({});
  const { reservationId } = useParams();

  // Load reservation on page load
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
  }, [reservationId]);
  return (
    <main className="col-m-7 m-2">
      <div className="row">
        <h2>Edit Reservation</h2>
      </div>
      <Reservations
        reservation={reservation}
        method={updateReservation}
      />
    </main>
  );
}

export default ReservationEdit;
