import React, { useState, useContext, useRef } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import arrow from "../../assets/icons/arrow.svg";

import isEmpty from "../utils/isEmpty";

import { MenuContext } from "./MenuMaker";
import { useOnClickOutside } from "../utils/hooks";
import { RestaurantContext } from "../..";
import { getToken } from "../utils/helpers";

function CreateMenu({ close }) {
  const ref = useRef();
  const { menus, setMenus } = useContext(MenuContext);
  const { restaurant } = useContext(RestaurantContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState({});

  useOnClickOutside(ref, () => close());

  function createMenu(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      const newMneu = {
        id: nanoid(),
        company_id: restaurant.company_id,
        type: "menu",
        name,
        description,
        active
      };

      axios({
        method: "POST",
        url: "http://www.mocky.io/v2/5e41ea762f00005200583793/save",
        data: newMneu,
        headers: {
          Authorization: getToken()
        }
      }).then(() => {
        close();
        setMenus([...menus, newMneu]);
      });
    } else {
      setErrors(errors);
    }
  }

  function validateInput() {
    const errors = {};
    if (!name) errors.name = "Required";
    return errors;
  }
  return (
    <form
      ref={ref}
      className="modal-form modf-create-menu"
      onSubmit={createMenu}
    >
      <div>
        <div className="modal-head">
          <img className="modal-arrow" src={arrow} onClick={close} alt="" />
          <p>Create Menu</p>
        </div>

        <div>
          <input
            className={`mod-input ${errors.name && "is-err-border"}`}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />

          <textarea
            className="mod-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
          ></textarea>

          <div className="checkbox-container">
            <p className="checkbox-label">Active</p>

            <label htmlFor="active" className="checkbox-inp">
              <input
                id="active"
                type="checkbox"
                className="checkbox"
                checked={active}
                onChange={e => setActive(e.target.checked)}
              />
              <div className="knobs"></div>
              <div className="layer"></div>
            </label>
          </div>
        </div>
      </div>

      <input className="modal-save" type="submit" value="Save" />
    </form>
  );
}

export default CreateMenu;
