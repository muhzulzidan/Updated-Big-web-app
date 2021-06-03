import React, { useState, useEffect } from "react";
import axios from "axios";
import Role from "./Role";
import { getToken } from "../../utils/helpers";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchingRoles();
  }, []);

  function fetchingRoles() {
    setLoading(true);

    axios
      .get("http://demo2139893.mockable.io/roles", {
        headers: {
          Authorization: getToken()
        }
      })
      .then(({ data }) => {
        setRoles(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }

  function renderRoles() {
    return roles.map(role => (
      <Role key={role.id} role={role} fetchingRoles={fetchingRoles} />
    ));
  }

  if (loading) {
    return (
      <div className="roles">
        <p>Loading ...</p>
      </div>
    );
  }

  return (
    <div className="roles">
      <div className="roles-head">
        <p className="roles-title">Name</p>
        <p className="roles-title">Actions</p>
      </div>

      {roles.length ? renderRoles() : null}
    </div>
  );
}

export default Roles;
