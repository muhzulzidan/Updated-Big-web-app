import React, { useState, useContext, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import Modal from "../modal/Modal";
import UserSidebar from "../common/UserSidebar";
import RestaurantSidebar from "../common/RestaurantSidebar";
import CreateRestaurant from "../dashboard/CreateRestaurant";

import profile from "../../assets/profile.png";
import restaurantIcon from "../../assets/icons/restaurant.svg";

import { RestaurantContext } from "../..";

function MenuSidebar() {
  const { restaurant } = useContext(RestaurantContext);
  const [createRest, setCreateRest] = useState(false);
  const [user, setUser] = useState(false);
  const [rest, setRest] = useState(false);

  // const modalRef = useRef(null);
  // // eslint-disable-next-line no-unused-vars
  // const [modalSt, setModalSt]= useState();

  return (
    <aside className="sidebar-menu sidebar-mv" >
      <div>
        <div className="siba-header">
          <span className="siba-header-user-title">Menu</span>
          <span className="siba-header-user-admin">Viewer </span>
        </div>

        <div className="siba-mv-links">
          <Link className="siba-mv-link siba-mv-link-active" to="/viewer">
            Menu
          </Link>
          <Link className="siba-mv-link" to="/menu">
            Menu Maker
          </Link>
        </div>
      </div>

      <div>
        <div className="siba-profile">
          <img className="siba-profile-img" src={profile} alt="" />
          <p className="siba-profile-name" onClick={() => setUser(true)}>
            Shirley Cuthbert
          </p>
        </div>
        <div className="dash-siba-line"></div>

        <div className="siba-restaurant">
          <img className="siba-restaurant-img" src={restaurantIcon} alt="" />
          <p className="siba-restaurant-name" onClick={() => setRest(true)}>
            {restaurant.name}
          </p>
        </div>
      </div>

      {createRest && (
        <Modal  >
          <CreateRestaurant close={() => setCreateRest(false)} />
        </Modal>
      )}

      {user && (
        <Modal  >
          <UserSidebar close={() => setUser(false)} />
        </Modal>
      )}

      {rest && (
        <Modal  >
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
