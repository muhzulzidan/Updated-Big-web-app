import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Services from "./services/Services";
import Roles from "./roles/Roles";
import Users from "./users/Users";
import CreateRole from "./roles/CreateRole";
import EditRole from "./roles/EditRole";

import "../../styles/modules/admin/sidebar.css";
import "../../styles/modules/admin/services.css";
import "../../styles/modules/admin/permissions.css";
import "../../styles/modules/admin/roles.css";
import "../../styles/modules/admin/users.css";

export const AdminContext = React.createContext();

function Admin() {
  const [checkedPerms, setCheckedPerms] = useState({});

  useEffect(() => {
    document.title = "Admin Panel";
  }, []);

  return (
    <AdminContext.Provider value={{ checkedPerms, setCheckedPerms }}>
      <div id="l-admin">
        <Sidebar />

        <Route exact path="/admin/services" component={Services} />
        <Route exact path="/admin/roles" component={Roles} />
        <Route exact path="/admin/users" component={Users} />
        <Route exact path="/admin/roles/create" component={CreateRole} />
        <Route exact path="/admin/roles/edit/:id" component={EditRole} />
      </div>
    </AdminContext.Provider>
  );
}

export default Admin;
