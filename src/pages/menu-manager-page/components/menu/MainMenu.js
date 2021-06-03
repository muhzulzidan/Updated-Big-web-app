import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import MenuDetails from "./MenuDetails";
import MenuElements from "./MenuElements";
import DeleteBtn from "../common/DeleteBtn";
import { getToken } from "../utils/helpers";
// import { getCompanyId } from "../utils/helpers";

export const MainMenuContext = React.createContext();

function MenuMain({ match }) {
  const [value, setValue] = useState({ value: "item", label: "Items" });
  const [data, setData] = useState(null);
  const [toUpdated, setToUpdated] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = match.params;

  useEffect(() => {
    document.title = "Menu Maker";
  }, []);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  function fetchData() {
    const urls = [
      axios.get(`http://demo2139893.mockable.io/render/category`, {
        headers: {
          Authorization: getToken()
          //${getCompanyId().company_id}
        }
      }),
      axios.get(`http://demo2139893.mockable.io/render/item`, {
        headers: {
          Authorization: getToken()
          //${getCompanyId().company_id}
        }
      }),
      axios.get(`http://demo2139893.mockable.io/render/group`, {
        headers: {
          Authorization: getToken()
          //${getCompanyId().company_id}
        }
      }),
      axios.get(`http://demo2139893.mockable.io/render/ingredient`, {
        headers: {
          Authorization: getToken()
          //${getCompanyId().company_id}
        }
      })
    ];

    axios
      .all(urls)
      .then(
        axios.spread((category, item, group, ingredient) => {
          setData({
            category: category.data.items ? category.data.items : [],
            item: item.data.items ? item.data.items : [],
            group: group.data.items ? group.data.items : [],
            ingredient: ingredient.data.items ? ingredient.data.items : []
          });
          setLoading(false);
        })
      )
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }

  if (!id) {
    return (
      <main id="l-menu-main" className="menu-select">
        Select Menu to View, Add, Edit, Delete Items or Add Menu
      </main>
    );
  }

  if (error) {
    return <p>Error</p>;
  }

  if (loading) {
    return <main id="l-menu-main">Loading...</main>;
  }

  return (
    <MainMenuContext.Provider
      value={{
        data,
        setData,
        value,
        setValue,
        toUpdated,
        setToUpdated,
        setIsDragging
      }}
    >
      <main id="l-menu-main">
        <MenuDetails />
        <MenuElements />
        {isDragging && <DeleteBtn />}
      </main>
    </MainMenuContext.Provider>
  );
}

export default withRouter(MenuMain);
