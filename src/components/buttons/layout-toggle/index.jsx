import "./style.css";
import gridOn from "../../../assets/svgs/grid-on.svg";
import gridOff from "../../../assets/svgs/grid-off.svg";
import listOn from "../../../assets/svgs/list-on.svg";
import listOff from "../../../assets/svgs/list-off.svg";

export default function LayoutToggle({layout, setLayout}) {
    return (
        <div className="layout-toggle-container">
            <img className="mr-3 clickable" src={layout==="grid"?listOff:listOn} alt="grid" onClick={() => {setLayout("list")}}/>
            <img className="ml-3 clickable" src={layout==="grid"?gridOn:gridOff} alt="grid" onClick={() => {setLayout("grid")}}/>
        </div>
    );
}