import React, { useState, useEffect } from "react";
import axios from "axios";
import User from "./User";
import { getToken } from "../../utils/helpers";

import profile from "../../../assets/profile.png";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState([]);

  function renderUsers() {
    return users.map(user => (
      <User key={user.uuid} user={user} src={profile} />
    ));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    setLoading(true);
    axios
      .get("https://www.mocky.io/v2/5e2da98f3000006718e77d3f", {
        headers: {
          Authorization: getToken()
        }
      })
      .then(({ data }) => {
        setUsers(data.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }

  if (loading) {
    return <div className="usersadm">Loading ...</div>;
  }

  return (
    <div className="usersadm">
      <div className="usersadm-head">
        <p className="usersadm-title">Emails</p>
        <p className="usersadm-title">Roles</p>
        <p className="usersadm-title">Created At</p>
        <p className="usersadm-title">Last logged in</p>
      </div>

      {users.length ? renderUsers() : null}
    </div>
  );
}

export default Users;
