import { useLogout } from "../../contexts/auth-context"

import './sideNav.css';


// import arrow from "../../assets/svgs/arrow.svg";
// import branch from "../../assets/svgs/branch.svg";
// import role from "../../assets/svgs/role.svg";
// import schedule from "../../assets/svgs/schedule.svg";
// import store from "../../assets/svgs/store-manager.svg";
// import employee from "../../assets/svgs/employee.svg";

import MenuIcon from '@material-ui/icons/Menu';

import { ReactComponent as Role} from "../../assets/svgs/role.svg";
import { ReactComponent as Employee} from "../../assets/svgs/employee.svg";
import { ReactComponent as Schedule} from "../../assets/svgs/schedule.svg";
import { ReactComponent as Branch } from "../../assets/svgs/branch.svg";
import { ReactComponent as Store} from "../../assets/svgs/store-manager.svg";
import { ReactComponent as Logout} from "../../assets/svgs/logout.svg";


import profile from "../../assets/svgs/profile.svg";
import NavButton from "./nav-button";


import { useState } from "react";


export default function SideNav(props) {
    const logout = useLogout();
    const [shrink, setShrink] = useState(false);

    return (
        <div className={`side-nav ${shrink?"side-nav-collapse":""}`}>
            <div className="nav-title-bar">
                {/* <div className="nav-header">Store</div> */}
                <MenuIcon style={{
                    width:"calc(1.3em + 1vw)",
                    height:"calc(1.3em + 1vw)",
                }}  className="clickable side-nav-collapse-button"  alt="menu" onClick={() => {
                    setShrink(!shrink);
                }}/>
            </div>
            {/* <hr /> */}
            <NavButton  text="Branch" path="/">
                <Branch/>
            </NavButton>
            <NavButton  text="Role" path="/role">
                <Role/>
            </NavButton>
            <NavButton  text="Employee" path="/employee">
                <Employee/>
            </NavButton>
            <NavButton  text="Schedule" path="/schedule">
                <Schedule/>
            </NavButton>
            <NavButton  text="Catalog" path="/store-manager-page">
                <Store/>
            </NavButton>
            <div className="nav-profile">
                <img src={profile} alt="profile"/>
                    <p>User name</p>
                    <div className="logout">
                        <div onClick={logout}>
                            <Logout/>
                        </div>
                    </div>
            </div>
        </div>
    );
}