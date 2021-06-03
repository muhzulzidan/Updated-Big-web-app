import React from "react";

function User({ user, src }) {
  const { email, roles, created_at, last_logged_in } = user;
  return (
    <div className="useradm">
      <div className="useradm-email">
        <img src={src} className="useradm-profile" alt="" />
        <p>{email}</p>
      </div>

      <p className="user-role">
        {roles.length === 1
          ? roles[0].slice(6)
          : `${roles[0].slice(6)}, +${roles.length - 1}`}
      </p>
      <p>{created_at ? created_at.split("T")[0] : null}</p>
      <p>{last_logged_in ? last_logged_in.split("T")[0] : "never"}</p>
    </div>
  );
}

export default User;
