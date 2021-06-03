import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import jwt from "jsonwebtoken";
import privateKey from "../config/privateKey";

import { AuthContext } from "../..";

const cookies = new Cookies();

const PrivateAdminRoute = ({ component: Component, ...rest }) => {
  const { isAuth } = useContext(AuthContext);

  if (!cookies.get("services")) {
    return <Redirect to="/auth" />;
  }

  if (!isAuth) return <> </>;

  if (cookies.get("services")) {
    let data = jwt.verify(cookies.get("services"), privateKey);

    if (data.isAdmin) {
      return <Route {...rest} render={props => <Component {...props} />} />;
    } else {
      return <Redirect to="/dashboard" />;
    }
  }
};

export default PrivateAdminRoute;
