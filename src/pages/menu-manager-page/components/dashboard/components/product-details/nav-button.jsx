import { useHistory } from "react-router"

export default function NavButton({text, icon, path}) {
    const history = useHistory();

    return (
        <div className={`nav-button ${history.location.pathname===path?"active":""}`} onClick={() => {
            history.push(path);
        }}>
            <img src={icon} alt={text} />
            <div className="side-nav-button-text">{text}</div>
        </div>
    )
}