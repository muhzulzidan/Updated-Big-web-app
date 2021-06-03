import React, { useContext } from "react";
import { Link, withRouter } from "react-router-dom";

import { AuthContext } from "../..";

function Sidebar({ match, history }) {
  const { logout } = useContext(AuthContext);
  const sidebarSect = match.params.sidebarSect;

  return (
    <aside className="sidebar-admin">
      <div>
        <div className="siba-header-add">
          <span className="siba-header-rect"></span>

          <p className="siba-header-user-title">FIRST </p>

          <p className="siba-header-user-admin"> ADMIN </p>
        </div>

        <div className="sibaadm-links">
          <Link
            className={`sibaadm-link ${sidebarSect === "services" &&
              "sibaadmr-link-active"}`}
            to={`/admin/${"services"}`}
          >
            Services
          </Link>
          <Link
            className={`sibaadm-link ${sidebarSect === "roles" &&
              "sibaadmr-link-active"}`}
            to="/admin/roles"
          >
            Roles
          </Link>
          <Link
            className={`sibaadm-link ${sidebarSect === "users" &&
              "sibaadmr-link-active"}`}
            to="/admin/users"
          >
            Users
          </Link>
        </div>
      </div>

      <div className="sibaadm-btns">
        <button
          className="sibaadm-btn"
          onClick={() => {
            history.push("/admin/roles/create");
          }}
        >
          <span className="sibaadm-btn-plus"> +</span>
          <p className="sibaadm-btn-create">Create Role</p>
        </button>

        <button className="sibaadm-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default withRouter(Sidebar);
