import Button from "../buttons/button";
import "./style.css";
import pencil from "../../assets/svgs/pencil.svg";

export default function BranchCard({branch, editBranch, activateBranch, deactivateBranch}) {
    return (
        <div className="branch-card">
            <div className="branch-name">{branch.name}</div>
            <div className="branch-actions">
                {
                    branch.isActive ?
                        <Button outline={true} background="orange" onClick={deactivateBranch}>Deactivate</Button> :
                        <Button outline={true} background="green" onClick={activateBranch}>Activate</Button>
                }
            </div>
            <div className="branch-phone-number">{branch.contactNumber}</div>
            <div className="branch-address">{branch.address}</div>
            <div className="branch-email">{branch.email}</div>
            <div
				className="card-edit-button clickable"
				onClick={() => {
					editBranch(branch);
				}}
			>
				<img src={pencil} alt="eidt" />
			</div>
        </div>
    );
}