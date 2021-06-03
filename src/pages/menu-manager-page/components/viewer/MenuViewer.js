import React from "react";
import MenuSidebar from "./MenuSidebar";
import MenuViewerMain from "./MenuViewerMain";

export default function MenuViewer() {
  return (
    <div id="l-menu-viewer">
      <MenuSidebar />
      <MenuViewerMain />
    </div>
  );
}
