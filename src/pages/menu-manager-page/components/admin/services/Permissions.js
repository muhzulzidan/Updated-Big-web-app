import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/helpers";

function Permissions({ showPerms, onclose, serviceId }) {
  const [perms, setPerms] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serviceId) {
      setLoading(true);
      axios
        .get(
          `http://5dcac57c34d54a0014314943.mockapi.io/admin/resource/${serviceId}`,
          {
            headers: {
              Authorization: getToken()
            }
          }
        )
        .then(({ data }) => {
          setPerms(data);
          setLoading(false);
        })
        .catch(err => {
          setPerms(null);
          setLoading(false);
          console.log(err);
        });
    }
  }, [serviceId]);

  function renderPerms() {
    if (!perms) return <p></p>;
    return perms.data.map(({ id, service_id }) => {
      return <p key={id}>{id}</p>;
    });
  }

  return (
    <div
      className={`permissions-container ${showPerms && "perms-cont-active"}`}
    >
      <div className="permissions">
        <p className="perm-head">Permissions</p>

        <div className="perm-close" onClick={onclose}>
          <span className="perm-close-line"></span>
          <span className="perm-close-line"></span>
        </div>

        {loading ? (
          <p>Loading ...</p>
        ) : (
          <div className="perms"> {perms ? renderPerms() : null}</div>
        )}
      </div>
    </div>
  );
}

export default Permissions;
