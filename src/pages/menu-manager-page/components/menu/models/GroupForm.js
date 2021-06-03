import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import {nanoid} from "nanoid";

import arrow from "../../../assets/icons/arrow.svg";
import image from "../../../assets/icons/image_place_holder.svg";

import isEmpty from "../../utils/isEmpty";

import { useOnClickOutside } from "../../utils/hooks";
import { getToken } from "../../utils/helpers";
import { RestaurantContext } from "../../..";
import { MainMenuContext } from "../MainMenu";

import burger from "../../../assets/burger.png";

function GroupForm({ close, editElem }) {
  const { restaurant } = useContext(RestaurantContext);
  const { data, setData } = useContext(MainMenuContext);
  const ref = useRef();
  const [updateMsg, setUpdateMsg] = useState(false);
  const [name, setName] = useState(editElem ? editElem.name : "");
  const [description, setDescription] = useState(
    editElem ? editElem.description : ""
  );
  const [active, setActive] = useState(editElem ? editElem.active : false);
  const [logo, setLogo] = useState(editElem ? editElem.image_url : null);
  const [min, setMin] = useState(editElem ? editElem.min : null);
  const [max, setMax] = useState(editElem ? editElem.max : null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useOnClickOutside(ref, () => close());

  function addGroup(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      const newGroup = {
        id: editElem ? editElem.id : nanoid(),
        company_id: restaurant.company_id,
        type: "group",
        name,
        active,
        min,
        max
      };

      description && (newGroup.description = description);
      logo && (newGroup.image_url = logo);

      setLoading(true);

      axios({
        method: editElem ? "PATCH" : "POST",
        url: "http://www.mocky.io/v2/5e41ea762f00005200583793/save",
        data: newGroup,
        headers: {
          Authorization: getToken()
        }
      }).then(() => {
        close();
        if (!editElem) {
          setData({
            ...data,
            group: [...data.group, newGroup]
          });
        } else {
          const newData = { ...data };
          newData.group = newData.group.map(grp => {
            if (grp.id === editElem.id) {
              return { ...grp, ...newGroup };
            } else {
              return grp;
            }
          });
          setData(newData);
        }
      });
    } else {
      setErrors(errors);
    }
  }

  function editItem(field, value) {
    const errors = validateInput();

    if (!isEmpty(errors)) {
      setErrors(errors);
      return;
    }

    if (field !== "active" && editElem[field] === value) {
      setErrors({});
      return;
    }

    axios
      .patch(
        `http://www.mocky.io/v2/5e41ea762f00005200583793/save/${editElem.id}/${field}`,
        { [field]: value },
        {
          headers: {
            Authorization: getToken()
          }
        }
      )
      .then(() => {
        setUpdateMsg(`Group's ${field} has been updated!`);
        setTimeout(() => setUpdateMsg(false), 3000);

        const newData = { ...data };
        const newGroup = {
          id: editElem.id,
          company_id: restaurant.company_id,
          type: "group",
          name,
          active,
          description
        };
        newData.group = newData.group.map(grp => {
          if (grp.id === editElem.id) {
            return { ...grp, ...newGroup };
          } else {
            return grp;
          }
        });
        setData(newData);
        setErrors({});
      });
  }

  function validateInput() {
    const errors = {};
    if (!name) errors.name = "Required";
    if (!min) errors.min = "Required";
    if (!max) errors.max = "Required";

    return errors;
  }

  function uploadImage(e) {
    setLoading(true);
    const fd = new FormData();
    fd.append("image", e.target.files[0]);

    axios
      .post("https://api.imgur.com/3/image", fd, {
        headers: {
          Authorization: "Client-ID 08dadb1d9b83882"
        }
      })
      .then(({ data }) => {
        setLogo(data.data.link);
        editItem("image_url", data.data.link);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function renderChildren() {
    return editElem.children.map(child => {
      return (
        <div className="menu-elem">
          <img
            className="menu-elem-img"
            src={child.image_url ? child.image_url : burger}
            alt=""
          />
          <p className="menu-elem-name">{child.name}</p>
        </div>
      );
    });
  }

  return (
    <form ref={ref} className="modal-form modf-add-item" onSubmit={addGroup}>
      <div>
        <div className="modal-head">
          <img className="modal-arrow" src={arrow} onClick={close} alt="" />
          <p>{editElem ? "Edit" : "Add"} Group</p>
        </div>

        <div>
          <div className="mod-flex">
            <input
              className={`mod-input ${errors.name && "is-err-border"}`}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              onBlur={() => {
                if (editElem) {
                  editItem("name", name);
                }
              }}
            />

            <div className="checkbox-container">
              <p className="checkbox-label">Active</p>

              <label htmlFor="active" className="checkbox-inp">
                <input
                  id="active"
                  type="checkbox"
                  className="checkbox"
                  checked={active}
                  onChange={e => {
                    setActive(e.target.checked);
                    if (editElem) {
                      editItem("active", active);
                    }
                  }}
                />
                <div className="knobs"></div>
                <div className="layer"></div>
              </label>
            </div>
          </div>

          <div className="mod-flex">
            <textarea
              className="mod-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              onBlur={() => {
                if (editElem) {
                  editItem("description", description);
                }
              }}
            ></textarea>

            <label className="mod-file-label" htmlFor="logo">
              <input
                id="logo"
                className="mod-file"
                type="file"
                onChange={uploadImage}
                accept="image/jpg, image/png"
              />
              <img className="mod-file-img" src={logo ? logo : image} alt="" />
              {!logo && <p>Add Logo</p>}
            </label>
          </div>

          <div className="mod-flex" style={{ width: 470 }}>
            <input
              type="number"
              className={`mod-input mod-inp-grp ${errors.min &&
                "is-err-border"}`}
              placeholder="Min"
              min={0}
              value={parseInt(min)}
              onChange={e => setMin(parseInt(e.target.value))}
              onBlur={() => {
                if (editElem) {
                  editItem("min", parseInt(min));
                }
              }}
            />
            <input
              type="number"
              className={`mod-input mod-inp-grp ${errors.max &&
                "is-err-border"}`}
              placeholder="Max"
              min={0}
              value={parseInt(max)}
              onChange={e => setMax(parseInt(e.target.value))}
              onBlur={() => {
                if (editElem) {
                  editItem("max", parseInt(max));
                }
              }}
            />
          </div>
        </div>

        {editElem && editElem.children && (
          <div className="modal-children">
            <div className="mc-head">
              <p>{editElem.name}'s </p>
              <img
                className="mc-head-arrow"
                src={arrow}
                onClick={close}
                alt=""
              />
            </div>
            <div className="modal-childrens">{renderChildren()}</div>
          </div>
        )}
        <br />
      </div>

      {!editElem && (
        <input
          className="modal-save"
          type="submit"
          value="Save"
          disabled={loading}
        />
      )}

      <p className={`drop-update-msg ${!updateMsg && "drop-update-msg-hide"}`}>
        {updateMsg}
      </p>
    </form>
  );
}

export default GroupForm;
