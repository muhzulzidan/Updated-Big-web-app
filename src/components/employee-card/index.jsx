import "./style.css";
import profilePicture from "../../assets/svgs/profile.png";
import pencil from "../../assets/svgs/pencil.svg";
import { useEffect, useState } from "react";
import Button from "../buttons/button";

export default function EmployeeCard({ employee, editEmployee, getRole, inviteEmployee, activateEmployee, deactivateEmployee}) {
	const [roleNames, setRoleNames] = useState([]);

	//get all role names
	useEffect(() => {
		const newList = [];
		for (const roleId of employee.roles) {
			const role = getRole(roleId);
			if (role && role.name) newList.push(role.name);
		}
		setRoleNames(newList);
	}, [employee.roles, setRoleNames, getRole]);

	return (
		<div className="employee-card">
			<div className="employee-picture">
				<img src={profilePicture} alt="profile" />
			</div>
			<div className="employee-name">{employee.name}</div>
			<div className="employee-email">{employee.email}</div>
			<div className="employee-actions">
                {
                    //invited but havent accept and expired
                    !employee.isInvited ? (
                        <>
                            <Button outline={true} onClick={inviteEmployee}>Invite</Button>
                        </>
                ) : null
                }

				{
                    //invited but havent accept and expired
                    employee.isInvited &&
                    !employee.hasAcceptedInvitation &&
                    employee.isInvitationExpired ? (
                        <>
                            <div className="text-warning">Invitation Expired</div>
                            <div className="text-blue clickable" onClick={inviteEmployee}>Resend</div>
                        </>
                ) : null}

                {
                    //invited but havent accept and not expred
                    employee.isInvited &&
                    !employee.hasAcceptedInvitation &&
                    !employee.isInvitationExpired ? (
                        <>
                            <div className="text-success">Invitation Sent</div>
                        </>
                    ) : null
                }

                {
                    //invited but and accepted and inactive
                    employee.isInvited &&
                    employee.hasAcceptedInvitation &&
                    !employee.isActive ? (
                        <>
                            <Button outline={true} background="red" onClick={deactivateEmployee}>Deactivate</Button>
                            <div className="text-success">Invitation Accepted</div>
                        </>
                    ) : null
                }

{
                    //invited but and accepted and inactive
                    employee.isInvited &&
                    employee.hasAcceptedInvitation &&
                    employee.isActive ? (
                        <>
                            <Button outline={true} background="green" onClick={activateEmployee}>Activate</Button>
                            <div className="text-success">Invitation Accepted</div>
                        </>
                    ) : null
                }
			</div>
			<div className="employee-roles">
				{/* show the first 4 role names */}
				{roleNames.slice(0, 4).map((role) => (
					<div
						key={`${employee.id}/${role}`}
						className="subitem-pill"
					>
						{role}
					</div>
				))}
				{/* show how many more permission there is */}
				{roleNames.length > 4 ? (
					<div className="extra-item-count">
						+{roleNames.length - 4}
					</div>
				) : null}
			</div>
			<div
				className="card-edit-button clickable"
				onClick={() => {
					editEmployee(employee);
				}}
			>
				<img src={pencil} alt="eidt" />
			</div>
		</div>
	);
}
