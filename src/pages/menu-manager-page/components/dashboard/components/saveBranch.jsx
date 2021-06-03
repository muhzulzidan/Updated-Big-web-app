import "./style.css";
import { useEffect, useState } from "react";


export default function SaveBranch({title, visible, setVisibility, onClick}) {
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
        <div className={`catalog-container${visible?"":" hidden"} save-div${visible?"":" save-hidden"}`} 
        >
            <button className="save-to-branch" onClick={onClick}>
                Save to Branch
            </button>
        </div>
    );
}