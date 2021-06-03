// @ts-nocheck
import axios from "axios";
import React, { useEffect, useState } from "react";
import CreateItemButton from "../../components/buttons/create-item-button";
import LayoutToggle from "../../components/buttons/layout-toggle";
import EmployeeCard from "../../components/employee-card";
import Checkbox from "../../components/inputs/checkbox";
import FilterBar from "../../components/inputs/filter-bar";
import TextInput from "../../components/inputs/text-input";
import ItemContainer from "../../components/item-container";
import SidePanel from "../../components/side-panel";
import MOCK_SERVER_URL from "../../config/mock-server";
import plus from "../../assets/svgs/plus.svg";
import Button from "../../components/buttons/button";
import save from "../../assets/svgs/save.svg";

export default function EmployeePage(props) {
	const [layout, setLayout] = useState("grid");
	const [roleList, setRoleList] = useState([]);
	const [filter, setFilter] = useState({});
	const [panelTitle, setPanelTitle] = useState("Create Role");
	const [showSidePanel, setShowSidePanel] = useState(false);
	const [employeeList, setEmployeeList] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState({});
	const [showSelectSchedulePanel, setShowSelectSchedulePanel] =
		useState(false);
	const [showDeletePanel, setShowDeletePanel] = useState(false);
	const [showInvitePanel, setShowInvitePanel] = useState(false);
	const [showActivatePanel, setShowActivatePanel] = useState(false);
	const [showDeactivatePanel, setShowDeactivatePanel] = useState(false);

	const editEmployee = (employee) => {
		setSelectedEmployee(employee);
		setPanelTitle("Edit Employee");
		setShowSidePanel(true);
	};

	const getRole = (roleId) => {
		for (const role of roleList) {
			if (role.id === roleId) return role;
		}
		return undefined;
	};

	const hasRole = (roleId) => {
		if (!selectedEmployee.roles) return false;
		return selectedEmployee.roles.includes(roleId);
	};

	const addRole = (roleId) => {
		if (!hasRole(roleId)) {
			let newRoles = [];
			if (selectedEmployee.roles) newRoles = [...selectedEmployee.roles];
			newRoles.push(roleId);
			setSelectedEmployee({ ...selectedEmployee, roles: newRoles });
		}
	};

	const removeRole = (roleId) => {
		let newRoles = [];
		if (selectedEmployee.roles) newRoles = [...selectedEmployee.roles];
		newRoles = newRoles.filter((el) => roleId !== el);
		setSelectedEmployee({ ...selectedEmployee, roles: newRoles });
	};

	const saveEmployee = () => {
		//TODO: upload employee to the server, then update employee list from server

		//get a new Employee to be ready
		setSelectedEmployee({});
		//hide panel
		setShowSidePanel(false);
	};

	const deleteEmployee = () => {
		//TODO: delete employee from server
		//get a new role to be ready
		setSelectedEmployee({});
		//hide panel
		setShowDeletePanel(false);
		setShowSidePanel(false);
	};

	const activateEmployee = () => {
		//TODO: endpoint
		setShowActivatePanel(false);
	};

	const deactivateEmployee = () => {
		//TODO: endpoint
		setShowDeactivatePanel(false);
	};

	const inviteEmployee = () => {
		//TODO: endpoint
		setShowInvitePanel(false);
	};

	//get role list from mock server
	useEffect(() => {
		axios
			.get(MOCK_SERVER_URL + "/roles/01EZ7PWNGF44R5BGBHV3DK849K")
			.then((res) => {
				setRoleList(res.data.data);
			});
	}, [setRoleList]);

	//get employee list from mock server
	useEffect(() => {
		axios
			.get(MOCK_SERVER_URL + "/employees/01EZ7PWNGF44R5BGBHV3DK849K")
			.then((res) => {
				setEmployeeList(res.data.data);
			});
	}, [setEmployeeList]);
	return (
		<div>
			{/* top bar */}
			<div className="d-flex my-4 mx-5 align-items-baseline shrink-on-mobile">
				{/* Layout toggle buttons */}
				<LayoutToggle layout={layout} setLayout={setLayout} />
				<div className="ml-auto d-flex align-items-baseline">
					{/* create role button */}
					<CreateItemButton
						text="Add Employee"
						onClick={() => {
							//if selected role already exist (have an id) then create a new role
							if (selectedEmployee.id) {
								setSelectedEmployee({});
							}
							setPanelTitle("Add Employee");
							setShowSidePanel(true);
						}}
					/>
					{/* filter/search bar */}
					<FilterBar
						className="ml-3"
						filter={filter}
						setFilter={setFilter}
					>
						<option value={undefined}>All</option>
						<option value="Name">Name</option>
						<option value="Email">Email</option>
						<option value="Activate employees">
							Activate employees
						</option>
						<option value="Deactivate employees">
							Deactivate employees
						</option>
						<option value="Roles">Roles</option>
						<option value="Schedule name">Schedule name</option>
					</FilterBar>
				</div>
			</div>
			{/* role list and grid */}
			<ItemContainer layout={layout}>
				<div className="item-container-list-titles">
					<div style={{ width: "250px", paddingLeft: "90px" }}>
						Employee Name
					</div>
					<div style={{ width: "450px", paddingLeft: "90px" }}>
						Roles
					</div>
					<div style={{ width: "300px", paddingLeft: "90px" }}>
						Email
					</div>
					<div style={{ width: "300px", paddingLeft: "90px" }}>
						Actions
					</div>
				</div>
				{employeeList.map((el) => {
					//Filter Name
					const filterEmployeeName = () => {
						if (
							!el.name
								.toLowerCase()
								.includes(filter.value.toLowerCase())
						)
							return true;
					};

					//Filter Email
					const filterEmail = () => {
						if (
							!el.email
								.toLowerCase()
								.includes(filter.value.toLowerCase())
						)
							return true;
					};

					const filterActivate = () => {
						if (!el.isActive) return true;
					};

					const filterDeactivate = () => {
						if (el.isActive) return true;
					};

					const filterSchedule = () => {
						//TODO: filter employees by schedule
					};

					const filterRoles = () => {
						if (!el.roles) return true;
						let found = false;
						for (const roleId of el.roles) {
							const roleObj = getRole(roleId);
							let roleName = undefined;
							if (roleObj) roleName = roleObj.name;
							if (
								roleName &&
								roleName
									.toLowerCase()
									.includes(filter.value.toLowerCase())
							) {
								found = true;
								break;
							}
						}
						if (!found) return true;
					};

					//Filter the employees
					if (filter.value !== undefined) {
						if (filter.value !== "") {
							if (filter.type === "Name") {
								if (filterEmployeeName()) return null;
							} else if (filter.type === "Email") {
								if (filterEmail()) return null;
							} else if (filter.type === "Roles") {
								if (filterRoles()) return null;
							} else if (filter.type === "Schedule name") {
								if (filterSchedule()) return null;
							} else {
								//filter all
								//TODO: apply employee schedule filter here
								if (
									filterEmployeeName() &&
									filterRoles() &&
									filterEmail()
								)
									return null;
							}
						}
					}

                    //filtering activate status desn't require any input
					if (filter.type === "Activate employees") {
						if (filterActivate()) return null;
					} else if (filter.type === "Deactivate employees") {
						if (filterDeactivate()) return null;
					}

					return (
						<EmployeeCard
							editEmployee={editEmployee}
							key={el.id}
							employee={el}
							getRole={getRole}
                            inviteEmployee={() => {
                                setSelectedEmployee(el);
                                setShowInvitePanel(true);
                            }}
                            activateEmployee={() => {
                                setSelectedEmployee(el);
                                setShowActivatePanel(true);
                            }}
                            deactivateEmployee={() => {
                                setSelectedEmployee(el);
                                setShowDeactivatePanel(true);
                            }}
						/>
					);
				})}
			</ItemContainer>
			<SidePanel
				title={panelTitle}
				visible={showSidePanel}
				setVisibility={setShowSidePanel}
			>
				<TextInput
					className="mx-5 my-1"
					value={selectedEmployee.name ? selectedEmployee.name : ""}
					setValue={(val) => {
						setSelectedEmployee({ ...selectedEmployee, name: val });
					}}
					placeholder="Name"
				/>
				<TextInput
					className="mx-5 my-1"
					value={selectedEmployee.email ? selectedEmployee.email : ""}
					setValue={(val) => {
						setSelectedEmployee({
							...selectedEmployee,
							email: val,
						});
					}}
					placeholder="Email"
				/>
				<div className=" h3 mx-5 mt-5 mb-1 text-blue">Roles</div>
				<div className="mx-5">
					{roleList.map((role) => {
						return (
							<Checkbox
								key={role.id}
								text={role.name}
								value={hasRole(role.id)}
								setValue={(val) => {
									if (val) {
										addRole(role.id);
									} else {
										removeRole(role.id);
									}
								}}
							/>
						);
					})}
				</div>
				<div
					className="mx-5 my-3 h6 clickable text-blue align-self-start"
					onClick={() => {
						setShowSelectSchedulePanel(true);
					}}
				>
					<img src={plus} alt="plus" /> Add Schedule
				</div>
				<div
					className={`m-5 align-self-end text-warning font-weight-bold clickable ${
						panelTitle === "Edit Employee" ? "" : "d-none"
					}`}
					onClick={() => {
						setShowDeletePanel(true);
					}}
				>
					Remove Employee
				</div>
				<div className="mt-auto mx-5 mb-5">
					<Button onClick={saveEmployee}>
						<img className="mr-3" src={save} alt="save" /> Save
					</Button>
					<Button
						className="ml-3"
						background="#E74B3C"
						outline={true}
						onClick={() => {
							setSelectedEmployee({});
							setShowSidePanel(false);
						}}
					>
						Cancel
					</Button>
				</div>
			</SidePanel>
			<SidePanel
				title={"Select Schedules"}
				visible={showSelectSchedulePanel}
				setVisibility={setShowSelectSchedulePanel}
			>
				<div className="m-5 text-blue h3">
					TODO: Implement this panel <br />
					This is the select schedule side panel
				</div>
			</SidePanel>
			<SidePanel
				title="Confirmation"
				visible={showDeletePanel}
				setVisibility={setShowDeletePanel}
			>
				<div className=" flex-grow-1 d-flex flex-column m-5 px-5">
					<div className="flex-grow-1">
						<h3 className="text-blue">
							Do you want to remove {selectedEmployee.name}?
						</h3>
					</div>
					<div>
						<Button onClick={deleteEmployee}>Confirm</Button>
						<Button
							className="ml-3"
							background="#E74B3C"
							outline={true}
							onClick={() => {
								setShowDeletePanel(false);
							}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</SidePanel>
			<SidePanel
				title="Confirmation"
				visible={showDeactivatePanel}
				setVisibility={setShowDeactivatePanel}
			>
				<div className=" flex-grow-1 d-flex flex-column m-5 px-5">
					<div className="flex-grow-1">
						<h3 className="text-blue">
							Do you want to Deactivate {selectedEmployee.name}?
						</h3>
					</div>
					<div>
						<Button onClick={deactivateEmployee}>Confirm</Button>
						<Button
							className="ml-3"
							background="#E74B3C"
							outline={true}
							onClick={() => {
								setShowDeactivatePanel(false);
							}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</SidePanel>
			<SidePanel
				title="Confirmation"
				visible={showActivatePanel}
				setVisibility={setShowActivatePanel}
			>
				<div className=" flex-grow-1 d-flex flex-column m-5 px-5">
					<div className="flex-grow-1">
						<h3 className="text-blue">
							Do you want to activate {selectedEmployee.name}?
						</h3>
					</div>
					<div>
						<Button onClick={activateEmployee}>Confirm</Button>
						<Button
							className="ml-3"
							background="#E74B3C"
							outline={true}
							onClick={() => {
								setShowActivatePanel(false);
							}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</SidePanel>
            <SidePanel
				title="Confirmation"
				visible={showInvitePanel}
				setVisibility={setShowInvitePanel}
			>
				<div className=" flex-grow-1 d-flex flex-column m-5 px-5">
					<div className="flex-grow-1">
						<h3 className="text-blue">
							Do you want to send invitation to {selectedEmployee.email}?
						</h3>
					</div>
					<div>
						<Button onClick={inviteEmployee}>Send Invitation</Button>
						<Button
							className="ml-3"
							background="#E74B3C"
							outline={true}
							onClick={() => {
								setShowInvitePanel(false);
							}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</SidePanel>
		</div>
	);
}
