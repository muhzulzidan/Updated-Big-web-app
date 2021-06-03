import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../Admin";
import isEmpty from "../../utils/isEmpty";
import { getToken } from "../../utils/helpers";

function CreateRole({ history }) {
  const { checkedPerms, setCheckedPerms } = useContext(AdminContext);
  const [review, setReview] = useState(false);
  const [name, setName] = useState("");
  const [perms, setPerms] = useState(null);
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPermissions();

    return () => setCheckedPerms({});
  }, [setCheckedPerms]);

  function fetchPermissions() {
    setLoading(true);
    axios
      .get("http://www.mocky.io/v2/5e2e14203000008600e77e0d", {
        headers: {
          Authorization: getToken()
        }
      })
      .then(({ data }) => {
        setPerms(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }

  function renderPerms() {
    if (!perms) return <p></p>;

    return perms.data.map(perm => {
      const { id /** , uid, type, service_id */ } = perm;

      return (
        <label key={id} className="rolec-perm-cont">
          <input
            type="checkbox"
            className="rolec-checkbox"
            checked={checkedPerms[id]}
            onChange={() =>
              setCheckedPerms({ ...checkedPerms, [id]: !checkedPerms[id] })
            }
          />

          <p className="rolec-perm">{id}</p>
        </label>
      );
    });
  }

  function renderCheckedPerms() {
    if (!perms) return <p></p>;

    const permissions = perms.data.filter(({ id }) => checkedPerms[id]);
    return permissions.map(perm => {
      const { id /**, uid, type, service_id  */ } = perm;

      return (
        <label key={id} className="rolec-perm-cont">
          <p className="rolec-perm">{id}</p>
        </label>
      );
    });
  }

  function cancel() {
    history.push("/admin/roles");
  }

  function save() {
    if (isEmpty(name)) {
      setErrors({ name: "Name is required" });
      return;
    }

    setReview(true);
    setErrors({});
  }

  function addRole() {
    const permissions = removeUnchecked();

    axios
      .post(
        "http://www.mocky.io/v2/5e232ac92f00009a002226db",
        {
          name,
          permissions
        },
        {
          headers: {
            Authorization: getToken()
          }
        }
      )
      .then(() => {
        history.push("/admin/roles");
      })
      .catch(err => console.log(err));
  }

  function removeUnchecked() {
    let newObj = {};
    Object.keys(checkedPerms).forEach(prop => {
      if (checkedPerms[prop]) {
        newObj[prop] = checkedPerms[prop];
      }
    });
    return Object.keys(newObj);
  }

  return (
    <div className="role-create">
      <div className="rolec-main">
        <div>
          <p className="rolec-head">Create Role{review && ": Review"}</p>
          <input
            className={`rolec-input ${errors.name && "is-err-border"}`}
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading || review}
          />
        </div>

        <div className="rolec-main-btns">
          <button className="rolec-main-btn" onClick={cancel}>
            Cancel
          </button>

          <button className="rolec-main-btn" onClick={review ? addRole : save}>
            {review ? "Save" : "Review & Save"}
          </button>
        </div>
      </div>

      <div className="rolec-perms-container">
        <div className="rolec-perms">
          <p className="perm-head">Add Permissions</p>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="rolec-perms-head">Name</p>
              {review ? renderCheckedPerms() : renderPerms()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateRole;
