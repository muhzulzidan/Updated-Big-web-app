import "./style.css";
import pencil from "../../assets/svgs/pencil.svg";

export default function RoleCard({role, editRole}) {
    return (
        <div className="role-card">
            <div className="role-name">
                {role.name}
            </div>
            <div className="role-description">
                {/*TODO: Add role description to end point */}
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis ex dolores excepturi, nulla id cupiditate reprehenderit. Tempora repudiandae est necessitatibus beatae, repellendus ipsum provident dolores sed similique maxime alias culpa.
            </div>
            <div className="role-permissions">
                {/* show the first 4 permissions */}
                {role.permissions.slice(0,4).map(permission => <div key={permission} className="subitem-pill">{permission}</div>)}
                {/* show how many more permission there is */}
                {role.permissions.length > 4 ? <div className="extra-item-count">
                    +{role.permissions.length - 4}
                </div>:null}
            </div>
            <div className="role-creation-date">26 June,2020</div>
            <div className="role-last-modified">26 June,2020</div>
            <div className="card-edit-button clickable" onClick={() => {editRole(role)}}>
                <img src={pencil} alt="eidt" />
            </div>
        </div>
    )
}