import React, { useState, useContext } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";

import eye from "../../../assets/icons/eye.svg";
import isEmpty from "../../utils/isEmpty";

import { AuthContext, RestaurantContext } from "../../..";

function Login({ history }) {
  const { setAuthToken } = useContext(AuthContext);
  const { setRestaurant, setRestCookies } = useContext(RestaurantContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [signMsg, setSignMsg] = useState({});

  function login(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      axios
        .post("http://www.mocky.io/v2/5e2e12ae3000005300e77e0a", {
          email: username,
          password
        })
        .then(({ data }) => {
          const user = data;
          if (!data.isAdmin) {
            setSignMsg({ status: true, msg: "Login successful" });

            setTimeout(() => {
              setAuthToken(data);
              history.push("/admin/services");
            }, 1100);
          } else {
            setSignMsg({ status: true, msg: "Login successful" });

            axios
              .get("http://www.mocky.io/v2/5e2e12ae3000005300e77e0a/DEFAULT", {
                headers: {
                  Authorization: "Bearer " + data.accessToken
                }
              })
              .then(({ data }) => {
                setRestaurant({ ...data.data, company_id: data.data.id });
                setTimeout(() => {
                  setAuthToken(user);
                  setRestCookies({ ...data.data, company_id: data.data.id });
                  history.push("/menu");
                }, 1100);
              })
              .catch(err => {
                setTimeout(() => {
                  setAuthToken(user);
                  history.push("/dashboard");
                }, 1100);
              });
          }
        })
        .catch(({ response }) => {
          if (response) {
            setSignMsg({
              status: false,
              msg: `There was an error please try again ${response.status}`
            });
          }
        });
    } else {
      setErrors(errors);
    }
  }

  function validateInput() {
    const errors = {};

    if (!username) errors.username = "Required";
    if (!password) errors.password = "Required";

    return errors;
  }

  return (
    <form id="l-auth-form" className="auth-form-login" onSubmit={login}>
      <p className="auth-head">LOG IN</p>
      <p className="auth-subhead">Enter your credentials</p>

      <Input
        className={`auth-input ${errors.username && "is-err-border"}`}
        value={username}
        setValue={setUsername}
        placeholder="USERNAME"
      />

      <Input
        className={`auth-input ${errors.password && "is-err-border"}`}
        type={!showPassword && "password"}
        value={password}
        setValue={setPassword}
        placeholder="PASSWORD"
        icon={eye}
        setShowPassword={() => setShowPassword(!showPassword)}
      />

      <p className="auth-forgot">Forgot password?</p>

      <Button value="Log in" />
      <br />
      {/* <div><p>TEST@gmail.com</p></div>*/}

      {signMsg && (
        <p className={`auth-signup-msg ${!signMsg.status && "is-err-msg"}`}>
          {signMsg.msg}
        </p>
      )}
    </form>
  );
}

export default withRouter(Login);
