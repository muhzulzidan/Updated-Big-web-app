import React, { useEffect, useRef } from "react";
import "./App.css";
import Apps from "./Apps";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({ typography: { fontFamily: "Poppins" } });

function Index() {
  const app = useRef(null);

  useEffect(() => {
    const preventGoBack = (e) => {
      if (!e.pageX || e.pageX > 50) {
        return;
      }
      e.preventDefault();
    };

    const appRef = app.current;
    appRef.addEventListener("touchstart", preventGoBack);

    return () => {
      appRef.removeEventListener("touchstart", preventGoBack);
    };
  }, []);

  return (
    <div className="App" ref={app} style={{backgroundColor:"white"}}>
      <ThemeProvider theme={theme}>
        <Apps />
      </ThemeProvider>
    </div>
  );
}

export default Index;
