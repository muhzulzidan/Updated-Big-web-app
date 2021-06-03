import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const PrivateAuthRoute = ({ component: Component, ...rest }) => {
  if (cookies.get("services")) {
    return <Redirect to="/dashboard" />;
  }

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateAuthRoute;
