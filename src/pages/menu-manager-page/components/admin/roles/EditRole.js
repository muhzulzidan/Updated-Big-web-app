import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../Admin";
import isEmpty from "../../utils/isEmpty";
import { getToken } from "../../utils/helpers";

function EditRole({ history, match }) {
  const { checkedPerms, setCheckedPerms } = useContext(AdminContext);
  const [review, setReview] = useState(false);
  const [name, setName] = useState("");
  const [perms, setPerms] = useState(null);
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const { id } = match.params;

  useEffect(() => {
    setLoading(true);
    const urls = [
      axios.get("http://www.mocky.io/v2/5e2b81533200004a001c71ce", {
        headers: {
          Authorization: getToken()
        }
      }),
      axios.get(`http://demo2139893.mockable.io/roles/${id}`, {
        headers: {
          Authorization: getToken()
        }
      })
    ];

    axios
      .all(urls)
      .then(
        axios.spread((perms, role) => {
          const obj = {};
          const fetchedPerms = perms.data.data;
          const fetchedRolePerms = role.data.data.permissions;

          setPerms(fetchedPerms);
          fetchedRolePerms.forEach(id => {
            obj[id] = true;
          });

          setName(role.data.data.name);
          setCheckedPerms(obj);
          setLoading(false);
        })
      )
      .catch(err => {
        setLoading(false);
      });

    return () => setCheckedPerms({});
  }, [id, setCheckedPerms]);

  function renderPerms() {
    if (!perms) return <p></p>;

    return perms.map(perm => {
      const { id /* , uid, type, service_id */ } = perm;

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

    const permissions = perms.filter(({ id }) => checkedPerms[id]);
    return permissions.map(perm => {
      const { id /* , uid, type, service_id*/ } = perm;

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

  function editRole() {
    const permissions = removeUnchecked();

    axios
      .patch(
        `http://www.mocky.io/v2/5e232a4e2f000075002226d8/${id}`,
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
          <p className="rolec-head">Edit Role{review && ": Review"}</p>
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

          <button className="rolec-main-btn" onClick={review ? editRole : save}>
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

export default EditRole;
