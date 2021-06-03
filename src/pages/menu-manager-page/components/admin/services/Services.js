import React, { useState, useEffect } from "react";
import axios from "axios";
import Service from "./Service";
import Permissions from "./Permissions";
import { getToken } from "../../utils/helpers";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [showPerms, setShowPerms] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://www.mocky.io/v2/5e22f5132f00007500222659", {
        headers: {
          Authorization: getToken()
        }
      })
      .then(({ data }) => {
        setServices(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  function onClick(id) {
    if (serviceId === id) {
      setServiceId(null);
      setShowPerms(false);
      return;
    }

    setShowPerms(true);
    setServiceId(id);
  }

  function onClose() {
    setShowPerms(false);
    setServiceId(null);
  }

  function renderServices() {
    return services.map(service => {
      return <Service key={service.id} service={service} onClick={onClick} />;
    });
  }

  if (loading) {
    return (
      <section className="services">
        <p>Loading ...</p>
      </section>
    );
  }

  return (
    <section className="services-container">
      {/* <div className={`services ${showPerms && "services-active"}`}> */}
      <div className={`services`}>
        <div className="services-head">
          <p className="servs-title">Service Name</p>
          {/* <p className="servs-title">Instances</p>
          <p className="servs-title">Details </p> */}
        </div>
        {services ? renderServices() : null}
      </div>
      <Permissions
        showPerms={showPerms}
        onclose={onClose}
        serviceId={serviceId}
      />
    </section>
  );
}

export default Services;
