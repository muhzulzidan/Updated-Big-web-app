import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import edit from "../../../assets/edit.svg";
import bin from "../../../assets/bin.svg";

function Role({ role, history, fetchingRoles }) {
  const { name, id, source /* type, permissions*/ } = role;

  function deleteRole() {
    axios
      .delete(`http://www.mocky.io/v2/5e232b042f00002b002226dc/${id}`, {
        headers: {
          Authorization: getToken()
        }
      })
      .then(() => fetchingRoles());
  }

  return (
    <div className="role">
      <p className="role-name">{name}</p>

      <div className="role-actions">
        <img
          src={edit}
          className="role-act-icon"
          alt=""
          onClick={() => history.push(`/admin/roles/edit/${id}`)}
        />
        {!source ? (
          <img
            src={bin}
            className="role-act-icon"
            onClick={deleteRole}
            alt=""
          />
        ) : null}
      </div>
    </div>
  );
}

export default withRouter(Role);
