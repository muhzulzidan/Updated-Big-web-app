import "./style.css";
import plus from "../../../assets/svgs/plus.svg";

export default function CreateItemButton({text, onClick}) {
    return (
        <div className="create-item-button clickable" onClick={onClick}>
            <img className="mr-3" src={plus} alt={text} />
            {text}
        </div>
    );
}