import "./style.css";
import backArrow from "../../assets/svgs/back-arrow.svg";
// import cross from "../../assets/svgs/dark-cross.svg";
import { useEffect, useState } from "react";

export default function SidePanel({title, children, visible, setVisibility}) {
    const [show, setShow] = useState(visible?true:false);

    useEffect(() => {
        if(visible) {
            setShow(true);
        } else {
            const timeout = setTimeout(() => {
                setShow(false);
            }, 500)
            return () => {clearTimeout(timeout)};
        }
    }, [visible])

    return (
        <div className={`side-panel-container${visible?"":" hidden"}`} style={show?{}:{transform: "translateX(100%)"}}>
            <div className="flex-grow-1" onClick={() => setVisibility(false)} ></div>
            <div className="side-panel">
                <div className="side-panel-status-bar ">
                    <img className="mr-3 clickable" src={backArrow} alt="" onClick={() => setVisibility(false)}/>
                    <div className="side-panel-title">
                        {title}
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}