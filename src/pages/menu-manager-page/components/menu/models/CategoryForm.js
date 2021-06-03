import React, { useState, useRef, useContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {nanoid} from "nanoid";

import arrow from "../../../assets/icons/arrow.svg";

import isEmpty from "../../utils/isEmpty";
import { getToken } from "../../utils/helpers";

import { useOnClickOutside } from "../../utils/hooks";
import { RestaurantContext } from "../../..";
import { MainMenuContext } from "../MainMenu";

import burger from "../../../assets/burger.png";

function CategoryForm({ close, editElem, match }) {
  const [updateMsg, setUpdateMsg] = useState(false);
  const { restaurant } = useContext(RestaurantContext);
  const { data, setData } = useContext(MainMenuContext);
  const ref = useRef();
  const [name, setName] = useState(editElem ? editElem.name : "");
  const [active, setActive] = useState(editElem ? editElem.active : false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = match.params;

  useOnClickOutside(ref, () => close());

  function addItem(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      setLoading(true);
      const newCateg = {
        id: editElem ? editElem.id : nanoid(),
        company_id: restaurant.company_id,
        type: "category",
        name,
        active
        // menu_id: id
      };

      axios
        .post(
          `http://www.mocky.io/v2/5e41ea762f00005200583793/save/${id}/category`,
          newCateg,
          {
            headers: {
              Authorization: getToken()
            }
          }
        )
        .then(() => {
          close();
          setData({ ...data, category: [...data.category, newCateg] });
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
        `http://www.mocky.io/v2/5e41ea762f00005200583793/${editElem.id}/${field}`,
        { [field]: value },
        {
          headers: {
            Authorization: getToken()
          }
        }
      )
      .then(() => {
        setUpdateMsg(`Category's ${field} has been updated!`);
        setTimeout(() => setUpdateMsg(false), 3000);

        const newData = { ...data };
        const newCateg = {
          id: editElem.id,
          company_id: restaurant.company_id,
          type: "category",
          name,
          active,
          menu_id: id
        };
        newData.category = newData.category.map(categ => {
          if (categ.id === editElem.id) {
            return { ...categ, ...newCateg };
          } else {
            return categ;
          }
        });
        setData(newData);
        setErrors({});
      });
  }

  function validateInput() {
    const errors = {};
    if (!name) errors.name = "Required";
    return errors;
  }

  function renderChildren() {
    return editElem.children.map(child => {
      return (
        <div className="menu-elem" key={child.id}>
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
    <form ref={ref} className="modal-form modf-add-item" onSubmit={addItem}>
      <div>
        <div className="modal-head">
          <img className="modal-arrow" src={arrow} onClick={close} alt="" />
          <p>{editElem ? "Edit" : "Add"} Category</p>
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
          </div>
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
                    editItem("active", e.target.checked);
                  }
                }}
              />
              <div className="knobs"></div>
              <div className="layer"></div>
            </label>
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
        )}{" "}
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

export default withRouter(CategoryForm);
