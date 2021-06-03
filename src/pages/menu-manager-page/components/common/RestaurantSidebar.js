import React, { 
  useRef, 
  // useState, 
  useContext } from "react";
import { Link } from "react-router-dom";
import { RestaurantContext } from "../..";
import restaurantIcon from "../../assets/icons/restaurant.svg";

import burger from "../../assets/burger.png";
import bell from "../../assets/icons/bell.svg";
import settings from "../../assets/icons/settings.svg";
import share from "../../assets/icons/share.svg";
import arrow from "../../assets/icons/arrow.svg";

import { useOnClickOutside } from "../utils/hooks";

function RestaurantSidebar({ close, create }) {
  const ref = useRef();
  // const [logo] = useState(null);
  const { restaurant } = useContext(RestaurantContext);

  useOnClickOutside(ref, () => close());

  return (
    <div ref={ref} className="siba-rest">
      <div>
        <div className="siba-rest-head">
          <img
            className="sibar-head-img"
            src={restaurant.image_url || burger}
            alt=""
          />
          <div className="sibar-head-names">
            <p className="siba-rest-name">{restaurant.name}</p>
            <p className="siba-rest-id">{restaurant.id}</p>
          </div>
        </div>

        <div className="sibar-action">
          <img className="sibar-action-icon" src={bell} alt="" />
          <p className="sibar-action-name">Notification</p>
        </div>

        <Link to="/dashboard" className="sibar-action">
          <img className="sibar-action-icon" src={settings} alt="" />
          <p className="sibar-action-name">Settings</p>
        </Link>

        <div className="sibar-action-branch">
          <Link to="/menu" className="sibar-action">
            <img className="sibar-action-icon" src={share} alt="" />
            <p className="sibar-action-name">Menu Maker</p>

            <img className="sibar-action-arrow" src={arrow} alt="" />
          </Link>

          {/* <div className="sibar-branches">
            <Link to="/menu" className="sibar-branch">
               Branch 1
            </Link>
            <p className="sibar-branch"> Branch 2</p>
          </div> */}
        </div>
      </div>

      <div className="siba-rest-add">
        <img className="siba-rest-add-icon" src={restaurantIcon} alt="" />
        <p className="siba-rest-add-name" onClick={() => create()}>
          Add restaurant
        </p>
      </div>
    </div>
  );
}

export default RestaurantSidebar;
