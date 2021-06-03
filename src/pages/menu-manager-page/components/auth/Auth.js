import React, { useEffect } from "react";

import Login from "./login/Login";
import Signup from "./sign-up/Signup";

function Auth() {
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <section id="l-auth">
      <div className="auth-container">
        <Login />
        <div className="auth-separator"></div>
        <Signup />
      </div>
    </section>
  );
}

export default Auth;
