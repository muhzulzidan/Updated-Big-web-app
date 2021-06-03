import React from "react";
import server from "../../../assets/server.svg";

function Service({ service, onClick }) {
  const { name, uid, id } = service;

  return (
    <div className="service" onClick={() => onClick(id)}>
      <div className="ser-sect">
        <div className="ser-details-container">
          <img src={server} className="ser-server-icon" alt="" />

          <div className="ser-details">
            <p className="ser-name">{name}</p>
            <p>{uid}</p>
          </div>
        </div>

        {/* <p className="ser-inst"> 1 </p>

        <p className="ser-ip">
          <span>IP</span> 127.0.0.1 <span>PORT</span> 8080 
        </p> */}
      </div>
    </div>
  );
}

export default Service;
