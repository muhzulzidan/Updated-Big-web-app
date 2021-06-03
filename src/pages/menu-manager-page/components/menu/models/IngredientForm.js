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

function IngredientForm({ close, editElem }) {
  const ref = useRef();
  const { restaurant } = useContext(RestaurantContext);
  const { data, setData } = useContext(MainMenuContext);
  const [updateMsg, setUpdateMsg] = useState(false);
  const [name, setName] = useState(editElem ? editElem.name : "");
  const [description, setDescription] = useState(
    editElem ? editElem.description : ""
  );
  const [active, setActive] = useState(editElem ? editElem.active : false);
  const [logo, setLogo] = useState(editElem ? editElem.image_url : null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useOnClickOutside(ref, () => close());

  function addIngred(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      setLoading(true);
      const newIngred = {
        id: nanoid(),
        company_id: restaurant.company_id,
        type: "ingredient",
        name,
        active
      };

      description && (newIngred.description = description);
      logo && (newIngred.image_url = logo);

      axios
        .post(
          "http://www.mocky.io/v2/5e41ea762f00005200583793/save",
          newIngred,
          {
            headers: {
              Authorization: getToken()
            }
          }
        )
        .then(() => {
          close();
          setData({
            ...data,
            ingredient: [...data.ingredient, newIngred]
          });
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
        setUpdateMsg(`Ingredient's ${field} has been updated!`);
        setTimeout(() => setUpdateMsg(false), 3000);

        const newData = { ...data };
        const newIngred = {
          id: editElem.id,
          company_id: restaurant.company_id,
          type: "ingredient",
          name,
          active,
          description
        };
        newData.ingredient = newData.ingredient.map(ingred => {
          if (ingred.id === editElem.id) {
            return { ...ingred, ...newIngred };
          } else {
            return ingred;
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

  return (
    <form ref={ref} className="modal-form modf-add-item" onSubmit={addIngred}>
      <div>
        <div className="modal-head">
          <img className="modal-arrow" src={arrow} onClick={close} alt="" />
          <p>{editElem ? "Edit" : "Add"} Ingredient</p>
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
                      editItem("active", e.target.checked);
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
        </div>
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

export default IngredientForm;
