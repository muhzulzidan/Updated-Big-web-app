import { useHistory } from "react-router"

export default function NavButton({text, icon, path, children}) {
    const history = useHistory();

    return (
        <div className={`nav-button ${history.location.pathname===path?"active":""}`} onClick={() => {
            history.push(path);
        }}>
            <div className={`nav-button-child ${history.location.pathname===path?"active":""}`} >
                {/* <img src={icon} alt={text} /> */}
                {children}
                <div className="side-nav-button-text">{text}</div>
            </div>
        </div>
    )
}