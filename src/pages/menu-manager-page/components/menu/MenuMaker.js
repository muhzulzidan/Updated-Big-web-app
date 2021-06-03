import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import MenuSidebar from "./MenuSidebar";
import MainMenu from "./MainMenu";
import { getToken } from "../utils/helpers";

import { getCompanyId } from "../utils/helpers";
export const MenuContext = React.createContext();

function MenuMaker() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://www.mocky.io/v2/5e41dd722f0000a1ef58377b/menu/${
          getCompanyId().company_id
        }`,
        {
          headers: { authorization: getToken() }
        }
      )
      .then(({ data }) => {
        setMenus(data.items ? data.items : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (error) {
    return <p>Error</p>;
  }

  if (loading) {
    return <p></p>;
  }

  return (
    <MenuContext.Provider value={{ menus, setMenus }}>
      <div id="l-home">
        <Route path="/menu/:id?" component={MenuSidebar} />
        <Route path="/menu/:id?" component={MainMenu} />
      </div>
    </MenuContext.Provider>
  );
}

export default MenuMaker;
