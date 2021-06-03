import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import Modal from "../modal/Modal";
import CreateMenu from "./CreateMenu";
import UserSidebar from "../common/UserSidebar";
import RestaurantSidebar from "../common/RestaurantSidebar";
import CreateRestaurant from "../dashboard/CreateRestaurant";

import profile from "../../assets/profile.png";
import restaurantIcon from "../../assets/icons/restaurant.svg";

import { MenuContext } from "./MenuMaker";
import { RestaurantContext } from "../..";

function MenuSidebar({ history, match }) {
  const { restaurant } = useContext(RestaurantContext);
  const { menus } = useContext(MenuContext);
  const [create, setCreate] = useState(false);
  const [createRest, setCreateRest] = useState(false);
  const [user, setUser] = useState(false);
  const [rest, setRest] = useState(false);

  function renderMenus() {
    return menus.map(({ id, name }, index) => {
      return (
        <p
          key={index}
          className={`siba-menu ${id === match.params.id &&
            "siba-menu-active"}`}
          onClick={() => history.push(`/menu/${id}`)}
        >
          <span>{name}</span>
          <span className="sibam-active">Active</span>
        </p>
      );
    });
  }

  return (
    <aside className="sidebar-menu">
      <div>
        <div className="siba-header2">
          <span className="siba-header-rect"></span>

          <p className="siba-header-user-title">FIRST </p>

          <p className="siba-header-user-admin"> MENUMAKER </p>
        </div>

        <div className="siba-menus">
          <div className="siba-menus-head">
            <p>Menu</p>
            <p className="sibamh-plus" onClick={() => setCreate(true)}>
              +
            </p>
          </div>

          <div>{renderMenus()}</div>
        </div>
      </div>

      <div>
        <div className="siba-profile">
          <img className="siba-profile-img" src={profile} alt="" />
          <p className="siba-profile-name" onClick={() => setUser(true)}>
            Shirley Cuthbert
          </p>
        </div>

        <span className="siba-line"></span>

        <div className="siba-restaurant">
          <img className="siba-restaurant-img" src={restaurantIcon} alt="" />
          <p className="siba-restaurant-name" onClick={() => setRest(true)}>
            {restaurant.name}
          </p>
        </div>
      </div>

      {create && (
        <Modal>
          <CreateMenu close={() => setCreate(false)} />
        </Modal>
      )}

      {createRest && (
        <Modal>
          <CreateRestaurant close={() => setCreateRest(false)} />
        </Modal>
      )}

      {user && (
        <Modal>
          <UserSidebar close={() => setUser(false)} />
        </Modal>
      )}

      {rest && (
        <Modal>
          <RestaurantSidebar
            close={() => setRest(false)}
            create={() => {
              setCreateRest(true);
              setRest(false);
            }}
          />
        </Modal>
      )}
    </aside>
  );
}

export default withRouter(MenuSidebar);
