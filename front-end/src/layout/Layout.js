import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-md-2 side-bar h-100">
          <Menu />
        </div>
        <div className="col-sm">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
