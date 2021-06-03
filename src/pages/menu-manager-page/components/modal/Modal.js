import React, { useEffect } from "react";
import ReactDOM from "react-dom";

function Modal({ children, modalRef}) {
  const component = <div className="modal">{children}</div>;

  useEffect(() => {
    window.scrollTo(0, {});
  });

  // {this.props.modalRef.current?(ReactDom.createPortal(<...Modal>, this.props.modalRef.current):null}

  return ReactDOM.createPortal(component, document.querySelector("#modal"));
}

export default Modal;
