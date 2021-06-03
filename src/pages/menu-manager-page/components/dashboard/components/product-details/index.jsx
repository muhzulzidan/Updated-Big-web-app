
import "./style.css";
import arrow from "../../assets/svgs/arrow.svg";

import { useState } from "react";


export default function ProductDetails(props) {
    const [shrink, setShrink] = useState(false);

    return (
        <div className={`side-nav ${shrink?"side-nav-collapse":""}`}>
            <div className="nav-title-bar">
                <div className="nav-header">Store</div>
                <img className="clickable side-nav-collapse-button" src={arrow} alt="logout" onClick={() => {
                    setShrink(!shrink);
                }}/>
            </div>
            <hr />
                <h1>Hello</h1>
            <div className="nav-profile">

            </div>
        </div>
    );
}