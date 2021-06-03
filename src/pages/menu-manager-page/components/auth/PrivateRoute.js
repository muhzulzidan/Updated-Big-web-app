import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

import { AuthContext } from "../..";

const cookies = new Cookies();

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuth } = useContext(AuthContext);

  if (!cookies.get("services")) {
    return <Redirect to="/auth" />;
  }

  if (!isAuth) return <> </>;

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateRoute;
