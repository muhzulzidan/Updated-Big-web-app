import React from "react";

function Button({ value }) {
  return <input type="submit" className="auth-submit" value={value} />;
}

export default Button;
