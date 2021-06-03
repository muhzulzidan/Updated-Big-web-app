import React, { useState } from "react";
import axios from "axios";
import Input from "../common/Input";
import Button from "../common/Button";

import eye from "../../../assets/icons/eye.svg";

import isEmpty from "../../utils/isEmpty";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPass: false
  });
  const [isAgree, setIsAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [signMsg, setSignMsg] = useState({});

  function signup(e) {
    e.preventDefault();

    const errors = validateInput();

    if (isEmpty(errors)) {
      axios
        .post("https://reqres.in/api/register", {
          email: username,
          password,
          confirmPassword
        })
        .then(() =>
          setSignMsg({ status: true, msg: "Your account have been created" })
        )
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
    if (!confirmPassword) errors.confirmPassword = "Required";
    if (!isAgree) errors.isAgree = "Required";

    if (
      password &&
      confirmPassword &&
      password.trim() !== confirmPassword.trim()
    ) {
      errors.notIdentical = "Password and confirm password are not identical";
    }

    return errors;
  }

  function toggleShowPass(key) {
    setShowPassword({
      ...showPassword,
      [key]: !showPassword[key]
    });
  }

  return (
    <form id="l-auth-form" className="auth-form-signup" onSubmit={signup}>
      <p className="auth-head">SIGN UP</p>
      <p className="auth-subhead">Tell us a little about you</p>

      <Input
        className={`auth-input ${errors.username && "is-err-border"}`}
        value={username}
        setValue={setUsername}
        placeholder="USERNAME"
      />

      <Input
        className={`auth-input ${errors.password && "is-err-border"}`}
        type={!showPassword.password && "password"}
        value={password}
        setValue={setPassword}
        placeholder="PASSWORD"
        icon={eye}
        setShowPassword={() => toggleShowPass("password")}
      />

      <Input
        className={`auth-input ${(errors.confirmPassword ||
          errors.notIdentical) &&
          "is-err-border"}`}
        type={!showPassword.confirmPass && "password"}
        value={confirmPassword}
        setValue={setconfirmPassword}
        placeholder="CONFIRM PASSWORD"
        icon={eye}
        setShowPassword={() => toggleShowPass("confirmPass")}
        errorMsg={errors.notIdentical}
      />

      <div className="auth-terms-container">
        <label
          className={`auth-agree-input ${isAgree &&
            "auth-agree-inp-active"} ${errors.isAgree && "is-err-border"}`}
          htmlFor="auth-agree-input"
        >
          <input
            id="auth-agree-input"
            type="checkbox"
            onChange={e => setIsAgree(e.target.checked)}
            checked={isAgree}
          />
        </label>

        <p>
          I agree to the
          <span className="auth-agree-span"> Terms and Conditions</span>
        </p>
      </div>

      <Button value="Sign up" />
      {signMsg && (
        <p className={`auth-signup-msg ${!signMsg.status && "is-err-msg"}`}>
          {signMsg.msg}
        </p>
      )}
    </form>
  );
}

export default Signup;
