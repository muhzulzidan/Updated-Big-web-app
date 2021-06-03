import "./style.css";

import {ReactComponent as Plus} from "../../../../../assets/svgs/plus2.svg";

export default function CreateItemButton({text, onClick, className}) {
    return (
        <div className="create-item-button clickable" onClick={onClick}>
            <Plus  alt={text}  className={className}/>
        </div>
    );
}