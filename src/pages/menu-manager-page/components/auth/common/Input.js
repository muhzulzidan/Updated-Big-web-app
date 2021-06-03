import React from "react";

function Input({
  type,
  value,
  setValue,
  placeholder,
  className,
  icon,
  setShowPassword,
  errorMsg
}) {
  return (
    <div className="auth-input-container">
      <input
        className={className}
        type={type ? type : "text"}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
      />

      {icon && (
        <img
          src={icon}
          className="auth-input-svg-eye"
          onClick={setShowPassword}
          alt=""
        />
      )}

      {errorMsg && <p className="is-err-msg">{errorMsg}</p>}
    </div>
  );
}

export default Input;
