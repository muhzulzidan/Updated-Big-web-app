import React, { useState, useRef, useContext } from "react";
import axios from "axios";
//import nanoid from "nanoid";
import { withRouter } from "react-router-dom";

import { RestaurantContext } from "../..";
import { useOnClickOutside } from "../utils/hooks";

import arrow from "../../assets/icons/arrow.svg";
import image from "../../assets/icons/image_place_holder.svg";

import isEmpty from "../utils/isEmpty";
import { getToken } from "../utils/helpers";

function Createrestaurant({ close, history }) {
  const form = useRef();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setRestaurant, setRestCookies } = useContext(RestaurantContext);

  useOnClickOutside(form, () => close());

  function createrestaurant(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      axios
        .post(
          "http://www.mocky.io/v2/5e45c7ad300000dc30614f2b/company",
          {
            name,
            description,
            image_url: logo
          },
          {
            headers: {
              Authorization: getToken()
            }
          }
        )
        .then(({ data }) => {
          setRestaurant({
            company_id: data.id,
            name,
            description,
            image_url: logo
          });
          setRestCookies({
            company_id: data.id,
            name,
            description,
            image_url: logo
          });
          history.push("/menu");
          close();
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
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <form ref={form} className="modal-form" onSubmit={createrestaurant}>
      <div>
        <div className="modal-head">
          <img className="modal-arrow" src={arrow} onClick={close} alt="" />
          <p>Add restaurant</p>
        </div>

        <input
          className={`mod-input ${errors.name && "is-err-border"}`}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />

        <div className="mod-flex">
          <textarea
            className="mod-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
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

      <input
        className="modal-save"
        type="submit"
        value="Save"
        disabled={loading}
      />
    </form>
  );
}

export default withRouter(Createrestaurant);
