import React, { useContext, useRef } from "react";

import profile from "../../assets/profile.png";
import bell from "../../assets/icons/bell.svg";
import settings from "../../assets/icons/settings.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import { AuthContext } from "../..";
import { useOnClickOutside } from "../utils/hooks";

function UserSidebar({ close }) {
  const ref = useRef();
  const { logout } = useContext(AuthContext);

  useOnClickOutside(ref, () => close());

  return (
    <div ref={ref} className="siba-user">
      <div>
        <div className="siba-user-head">
          <img className="sibau-head-img" src={profile} alt="" />
          <div className="sibau-head-names">
            <p className="siba-user-name">Shirley Cuthbert</p>
            <p className="siba-user-email">shirley@cuthbert.com</p>
          </div>
        </div>

        <div className="sibau-action">
          <img className="sibau-action-icon" src={bell} alt="" />
          <p className="sibau-action-name">Notification</p>
        </div>

        <div className="sibau-action">
          <img className="sibau-action-icon" src={settings} alt="" />
          <p className="sibau-action-name">Settings</p>
        </div>

        <div className="sibau-action">
          <img className="sibau-action-icon" src={logoutIcon} alt="" />
          <p className="sibau-action-name" onClick={logout}>
            Logout
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserSidebar;
