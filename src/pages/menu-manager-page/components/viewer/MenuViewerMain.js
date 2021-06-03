import React, { useState, useEffect } from "react";
import axios from "axios";

function MenuViewerMain() {
  const [selectedCateg, setSelectedCateg] = useState(null);
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get("//www.mocky.io/v2/5e80f198300000bb386f95fc")
      .then(({ data }) => {
        setMenu(data.items[0]);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  function renderCategoriesHead() {
    return menu.children.map(({ id, name }) => {
      return (
        <p
          key={id}
          className={`mvmh-category  ${selectedCateg === name &&
            "mvmh-category-active"}`}
          onClick={() => setSelectedCateg(name)}
        >
          {name}
        </p>
      );
    });
  }

  function renderCategories() {
    return menu.children.map(category => {
      const { id, name } = category;

      return (
        <div key={id} className="mvmm-category">
          <p className="mvmm-category-name">{name}</p>

          <div className="mvmm-category-items">{renderItems(category)}</div>
        </div>
      );
    });
  }

  function renderItems(category) {
    return category.children.map(item => {
      const { id, name, image_url } = item;

      return (
        <div key={id} className="mvmm-item">
          <div className="mvmm-it-img-cont">
            <img className="mvmm-it-img" src={image_url} alt="" />
            <p className="mvmm-it-name-cont"></p>
            <p className="mvmm-it-name">{name}</p>
          </div>

          <div className="mvmm-it-details">
            <p className="mvmm-itdet-select">Select your Beverages</p>
            {renderItemChildren(item)}
          </div>
        </div>
      );
    });
  }

  function renderItemChildren(item) {
    return item.children.map(child => {
      const { 
        id, 
        name, 
        // type 
      } = child;
      return (
        <div key={id} className="mvmm-it-child">
          <p className="mvmm-it-child-name">{name}</p>

          <div className="mvmm-it-children-cont">
            {renderItemChildrenChildren(child)}
          </div>
        </div>
      );
    });
  }

  function renderItemChildrenChildren(group) {
    return group.children.map(group => {
      const { id, name, image_url } = group;
      return (
        <div key={id} className="mvmm-it-children">
          <img className="mvmm-it-children-img" src={image_url} alt="" />
          <p className="mvmm-it-children-name">{name}</p>
        </div>
      );
    });
  }

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error ...</p>;
  }

  console.log(menu);

  return (
    <div className="menu-viewer-main">
      <div className="mvm-head">
        <p className="mvm-head-name">{menu.name}</p>

        <div className="mvmh-categories">{renderCategoriesHead()}</div>
      </div>

      <div className="mvm-main-categories">{renderCategories()}</div>
    </div>
  );
}

export default MenuViewerMain;
