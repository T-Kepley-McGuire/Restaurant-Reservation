import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/Reservations";
import ReservationSeat from "../reservations/ReservationSeat";
import Tables from "../tables/Tables";
import Search from "../search/Search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationEdit from "../reservations/ReservationEdit";
import ReservationCreate from "../reservations/ReservationCreate";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate />
      </Route>
      <Route path="/reservations/:reservationId/seat">
        <ReservationSeat />
      </Route>
      <Route path="/reservations/:reservationId/edit">
        <ReservationEdit />
      </Route>
      <Route path="/tables/new">
        <Tables />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
