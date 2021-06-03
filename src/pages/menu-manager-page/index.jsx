import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend }  from "react-dnd-html5-backend";

import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";
import Cookies from "universal-cookie";
import PrivateRoute from "./components/auth/PrivateRoute";
import PrivateAuthRoute from "./components/auth/PrivateAuthRoute";
import Auth from "./components/auth/Auth";
import MenuMaker from "./components/menu/MenuMaker";
import Dashboard from "./components/dashboard/Dashboard";
import Admin from "./components/admin/Admin";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";

import "./styles/base.css";
import "./styles/layout.css";
import "./styles/status.css";
import "./styles/modules/common.css";
import "./styles/modules/auth.css";
import "./styles/modules/sidebar.css";
import "./styles/modules/menu.css";
import "./styles/modules/modal.css";
import "./styles/modules/dashboard.css";
import "./styles/modules/drop.css";

import privateKey from "./config/privateKey";
import PrivateAdminRoute from "./components/auth/PrivateAdmin";
import { getToken } from "./components/utils/helpers";
import MenuViewer from "./components/viewer/MenuViewer";

export const AuthContext = React.createContext();
export const RestaurantContext = React.createContext();

const cookies = new Cookies();

function MenuManagerPage() {
  const [isAuth, setIsAuth] = useState(true);
  const [restaurant, setRestaurant] = useState({});

  useEffect(() => {
    if (cookies.get("restaurant")) {
      let restaurant = jwt.verify(cookies.get("restaurant"), privateKey);
      setRestaurant(restaurant);
    }

    if (!isAuth && cookies.get("services")) {
      setIsAuth(true);
    }
  }, [isAuth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cookies.get("services")) {
        let { expires, refreshToken } = jwt.verify(
          cookies.get("services"),
          privateKey
        );
        const now = new Date(Date.now());
        expires = new Date(expires);

        if (now > expires) {
          axios
            .get("http://www.mocky.io/v2/5e232c8c2f000097002226e5/token", {
              headers: {
                Authorization: "Bearer " + refreshToken
              }
            })
            .then(({ data }) => {
              setAuthToken(data);
            });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  function setAuthToken(data) {
    const savedToken = jwt.sign(
      JSON.stringify({
        ...data,
        expires: new Date(Date.now() + 1 * 60 * 58 * 1000)
      }),
      privateKey
    );
    cookies.set("services", savedToken, {
      path: "/"
    });

    setIsAuth(true);
  }

  function setRestCookies(data) {
    const savedToken = jwt.sign(
      JSON.stringify({
        ...data
      }),
      privateKey
    );
    cookies.set("restaurant", savedToken, {
      path: "/"
    });

    setRestaurant(data);
  }

  function logout() {
    axios
      .post(
        "http://www.mocky.io/v2/5e2173be2f00004e0077d64a",
        {},
        {
          headers: { Authorization: getToken() }
        }
      )
      .then(() => {
        cookies.remove("services", {
          path: "/"
        });
        setIsAuth(false);
      });
  }

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <AuthContext.Provider value={{ isAuth, setIsAuth, setAuthToken, logout }}>
        <RestaurantContext.Provider
          value={{ restaurant, setRestaurant, setRestCookies }}
        >
          <Dashboard/>
          {/* <BrowserRouter>
            <div className="app" >
              <Switch>
                <PrivateAuthRoute exact path="/auth" component={Auth} />
                <PrivateRoute path="/menu" component={MenuMaker} />
                <PrivateRoute path="/viewer" component={MenuViewer} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <PrivateAdminRoute
                  path="/admin/:sidebarSect"
                  component={Admin}
                />
                <PrivateRoute
                  path="/"
                  component={() => <Redirect to="/dashboard" />}
                />
              </Switch>
            </div>
          </BrowserRouter> */}
        </RestaurantContext.Provider>
      </AuthContext.Provider>
    </DndProvider>
  );
}

export default MenuManagerPage;
