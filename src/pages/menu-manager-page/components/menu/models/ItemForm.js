import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { nanoid } from "nanoid";

import arrow from "../../../assets/icons/arrow.svg";
import image from "../../../assets/icons/image_place_holder.svg";

import isEmpty from "../../utils/isEmpty";
import { getToken } from "../../utils/helpers";

import { useOnClickOutside } from "../../utils/hooks";
import { RestaurantContext } from "../../..";
import { MainMenuContext } from "../MainMenu";

import burger from "../../../assets/burger.png";

function ItemForm({ close, editElem }) {
  const ref = useRef();
  const { restaurant } = useContext(RestaurantContext);
  const { data, setData } = useContext(MainMenuContext);
  const [updateMsg, setUpdateMsg] = useState(false);
  const [name, setName] = useState(editElem ? editElem.name : "");
  const [description, setDescription] = useState(
    editElem ? editElem.description : ""
  );
  const [active, setActive] = useState(editElem ? editElem.active : false);
  const [base, setBase] = useState(editElem ? editElem.base_price : "");
  const [display, setDisplay] = useState(
    editElem ? editElem.display_price : ""
  );
  const [calories, setCalories] = useState(editElem ? editElem.cal : "");
  const [sizes, setSizes] = useState(
    editElem ? (editElem.size ? editElem.size : {}) : {}
  );
  const [logo, setLogo] = useState(editElem ? editElem.image_url : null);
  const [show, setShow] = useState({
    display: editElem ? true : false,
    calories: editElem ? true : false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useOnClickOutside(ref, () => close());

  function addItem(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      setLoading(true);
      const newItem = {
        id: nanoid(),
        company_id: restaurant.company_id,
        type: "item",
        name,
        active,
        base_price: base
        // display_price: display,
        // size: Object.values(sizes)
      };

      description && (newItem.description = description);
      logo && (newItem.image_url = logo);
      calories && (newItem.cal = calories);
      display && (newItem.display_price = display);
      sizes.length && (newItem.size = Object.values(sizes));

      axios({
        method: editElem ? "PATCH" : "POST",
        url: "http://www.mocky.io/v2/5e41ea762f00005200583793/save",
        data: newItem,
        headers: {
          Authorization: getToken()
        }
      }).then(() => {
        close();
        if (!editElem) {
          setData({
            ...data,
            item: [...data.item, newItem]
          });
        } else {
          const newData = { ...data };
          newData.item = newData.item.map(item => {
            if (item.id === editElem.id) {
              return { ...item, ...newItem };
            } else {
              return item;
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
        `http://www.mocky.io/v2/5e41ea762f00005200583793/${editElem.id}/${field}`,
        { [field]: value },
        {
          headers: {
            Authorization: getToken()
          }
        }
      )
      .then(() => {
        setUpdateMsg(`Item's ${field} has been updated!`);
        setTimeout(() => setUpdateMsg(false), 3000);

        const newData = { ...data };
        const newItem = {
          id: editElem.id,
          company_id: restaurant.company_id,
          type: "item",
          name,
          description,
          active,
          base_price: base,
          display_price: display,
          cal: calories,
          size: Object.values(sizes),
          image_url: logo
        };
        newData.item = newData.item.map(item => {
          if (item.id === editElem.id) {
            return { ...item, ...newItem };
          } else {
            return item;
          }
        });
        setData(newData);
        setErrors({});
      });
  }

  function validateInput() {
    const errors = {};

    if (!name) errors.name = "Required";
    if (!base) errors.base = "Required";

    return errors;
  }

  function changeSize(e, key) {
    setSizes({
      ...sizes,
      [key]: {
        ...sizes[key],
        [e.target.name]: e.target.value
      }
    });
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

  function renderSizes() {
    return Object.keys(sizes).map((key, index) => {
      return (
        <div className="mod-flex" key={index}>
          <input
            className={`mod-input mod-inp-size`}
            placeholder="Size Name"
            name="name"
            value={sizes[key].name}
            onChange={e => changeSize(e, key)}
            onBlur={() => {
              if (editElem) {
                editItem("sizes", sizes);
              }
            }}
          />
          <input
            className={`mod-input mod-inp-size`}
            placeholder="Size Description"
            name="description"
            value={sizes[key].description}
            onChange={e => changeSize(e, key)}
            onBlur={() => {
              if (editElem) {
                editItem("sizes", sizes);
              }
            }}
          />
          <input
            type="number"
            className={`mod-input mod-inp-size`}
            placeholder="Size Price"
            name="price"
            value={sizes[key].price}
            onChange={e => changeSize(e, key)}
            onBlur={() => {
              if (editElem) {
                editItem("sizes", sizes);
              }
            }}
          />
        </div>
      );
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
    <form ref={ref} className="modal-form modf-add-item" onSubmit={addItem}>
      <div>
        <div className="modal-head">
          <img className="modal-arrow" src={arrow} onClick={close} alt="" />
          <p>{editElem ? "Edit" : "Add"} Item</p>
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
                    editItem("active", e.target.checked);
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

          <div className="mod-flex">
            <input
              type="number"
              className={`mod-input ${errors.base && "is-err-border"}`}
              value={parseInt(base)}
              onChange={e => setBase(parseInt(e.target.value))}
              placeholder="Base Price"
              onBlur={() => {
                if (editElem) {
                  editItem("base_price", parseInt(base));
                }
              }}
            />
          </div>

          {show.display && (
            <div className="mod-flex">
              <input
                type="number"
                className={`mod-input ${errors.display && "is-err-border"}`}
                value={parseInt(display)}
                onChange={e => setDisplay(parseInt(e.target.value))}
                placeholder="Display Price"
                onBlur={() => {
                  if (editElem) {
                    editItem("display_price", parseInt(base));
                  }
                }}
              />
            </div>
          )}

          {show.calories && (
            <div className="mod-flex">
              <input
                type="number"
                className={`mod-input ${errors.calories && "is-err-border"}`}
                value={parseInt(calories)}
                onChange={e => setCalories(parseInt(e.target.value))}
                placeholder="Calories"
                onBlur={() => {
                  if (editElem) {
                    editItem("cal", parseInt(calories));
                  }
                }}
              />
            </div>
          )}

          {Object.keys(sizes).length ? renderSizes() : <></>}

          <br />
          <br />

          {!show.display && (
            <div
              className="modf-item-more"
              onClick={() => setShow({ ...show, display: true })}
            >
              <span className="modf-item-more-plus">+</span>
              <span>Add Display Price</span>
            </div>
          )}

          {!show.calories && (
            <div
              className="modf-item-more"
              onClick={() => setShow({ ...show, calories: true })}
            >
              <span className="modf-item-more-plus">+</span>
              <span>Add Calories</span>
            </div>
          )}

          <div
            className="modf-item-more"
            onClick={() =>
              setSizes({
                ...sizes,
                [nanoid()]: {
                  name: "",
                  price: "",
                  description: ""
                }
              })
            }
          >
            <span className="modf-item-more-plus">+</span>
            <span>Add Sizes</span>
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

export default ItemForm;
