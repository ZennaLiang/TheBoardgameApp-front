import React from "react";
import { Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./index";

const PrivateRoute = ({ component: Component, ...rest }) => (
  // props means components passed down to this private route component
  // render component w all the props otherwise redirect them to sign in
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Navigate
          to={{ pathname: "/signin", state: { from: props.location } }}
        />
      )
    }
  />
);

export default PrivateRoute;
