// @ts-nocheck
import { useEffect, useState } from "react";
import LayoutToggle from "../../components/buttons/layout-toggle";
import CreateItemButton from "../../components/buttons/create-item-button";
import FilterBar from "../../components/inputs/filter-bar";
import axios from "axios";
import MOCK_SERVER_URL from "../../config/mock-server";
import ItemContainer from "../../components/item-container";
import RoleCard from "../../components/role-card";
import SidePanel from "../../components/side-panel";
import TextInput from "../../components/inputs/text-input";
import Textarea from "../../components/inputs/textarea";
import "./style.css";
import Checkbox from "../../components/inputs/checkbox";
import Button from "../../components/buttons/button";
import save from "../../assets/svgs/save.svg";
import { useGetUserToken } from "../../contexts/auth-context";

export default function RolePage(props) {
	const [layout, setLayout] = useState("grid");
	const [panelTitle, setPanelTitle] = useState("Create Role");
	const [showCreateRolePanel, setShowCreateRolePanel] = useState(false);
	const [showDeletePanel, setShowDeletePanel] = useState(false);
	const [filter, setFilter] = useState({});
	const [roleList, setRoleList] = useState([]);
	const getUserToken = useGetUserToken();

	//the currently selected role, all modification is done to this object
	const [role, setRole] = useState({});

	const hasPermission = (permission) => {
		if (!role.permissions) return false;
		return role.permissions.includes(permission);
	};

	const addPermission = (permission) => {
		if (!hasPermission(permission)) {
			let newPermissions = [];
			if (role.permissions) newPermissions = [...role.permissions];
			newPermissions.push(permission);
			setRole({ ...role, permissions: newPermissions });
		}
	};

	const removePermission = (permission) => {
		let newPermissions = [];
		if (role.permissions) newPermissions = [...role.permissions];
		newPermissions = newPermissions.filter((el) => permission !== el);
		setRole({ ...role, permissions: newPermissions });
	};

	const refreshRoleList = () => {
		axios.get(MOCK_SERVER_URL + "/roles/01EZ7PWNGF44R5BGBHV3DK849K")
			.then((res) => {
				setRoleList(res.data.data);
			});
	}

	const PermissionCheckbox = ({ text, id }) => {
		return (
			<Checkbox
				text={text}
				value={hasPermission(id)}
				setValue={(val) => {
					if (val) {
						addPermission(id);
					} else {
						removePermission(id);
					}
				}}
			/>
		);
	};

	const saveRole = () => {
		//TODO: use actual endpoint

		//determin which http method to use by checking if the role exists(have id)
		const method = role.id?"patch":"post";
		axios[method]("https://run.mocky.io/v3/bf252306-0e8d-496b-9733-1ee630dd9ab1", 
			{
				//role is the currently selected role, we upload this object
				role: role,
				userToeken: getUserToken(),
			}
		).then(res => {
			//we fetch data from server to show the changes on UI.
			refreshRoleList();
			console.log(res);
		}).catch(err => {
			console.error(err);
		})

		//get a new role to be ready
		setRole({});
		//hide panel
		setShowCreateRolePanel(false);
	};

	const deleteRole = () => {
		//TODO: use actual endpoint
		axios.delete("https://run.mocky.io/v3/bf252306-0e8d-496b-9733-1ee630dd9ab1", 
			{
				//role is the currently selected role, we upload this object
				role: role,
				userToeken: getUserToken(),
			}
		).then(res => {
			//we fetch data from server to show the changes on UI.
			refreshRoleList();
		}).catch(err => {
			console.error(err);
		})

		setRole({});
		setShowCreateRolePanel(false);
		setShowDeletePanel(false);
	};

	//get role list from mock server
	useEffect(() => {
		refreshRoleList();
	}, [setRoleList]);

	return (
		<div>
			{/* top bar */}
			<div className="d-flex my-4 mx-5 align-items-baseline shrink-on-mobile">
				{/* Layout toggle buttons */}
				<LayoutToggle layout={layout} setLayout={setLayout} />
				<div className="ml-auto d-flex align-items-baseline">
					{/* create role button */}
					<CreateItemButton
						text="Create Role"
						onClick={() => {
							//if selected role already exist (have an id) then create a new role
							if (role.id) {
								setRole({});
							}
							setPanelTitle("Create Role");
							setShowCreateRolePanel(true);
						}}
					/>
					{/* filter/search bar */}
					<FilterBar
						className="ml-3"
						filter={filter}
						setFilter={setFilter}
					>
						<option value={undefined}>All</option>
						<option value="Role Name">Role Name</option>
						<option value="Permissions">Permissions</option>
					</FilterBar>
				</div>
			</div>

			{/* role list and grid */}
			<ItemContainer layout={layout}>
				<div className="item-container-list-titles">
					<div style={{ width: "250px", paddingLeft: "90px" }}>
						Role Name
					</div>
					<div style={{ width: "600px", paddingLeft: "90px" }}>
						Permissions
					</div>
					<div style={{ width: "250px", paddingLeft: "90px" }}>
						Creation Date
					</div>
					<div style={{ width: "250px", paddingLeft: "90px" }}>
						Last Modified
					</div>
				</div>
				{roleList.map(el => {
                    const filterRoleName = () => {
                        if(!el.name.toLowerCase().includes(filter.value.toLowerCase())) return true;
                    }

                    const filterPermissions = () => {
                        if(!el.permissions) return true;
                        let found = false;
                        for(const permission of el.permissions) {
                            if(permission.toLowerCase().includes(filter.value.toLowerCase())) {
                                found = true;
                                break;
                            }
                        }
                        if(!found) return true;
                    }

                    //Filter the roles
                    if(filter.value !== undefined && filter.value !== "") {
                        if(filter.type === "Role Name") {
                            //filter all and role name
                            if(filterRoleName()) return null;
                        } else if (filter.type === "Permissions") {
                            //filter all and permissions
                            if(filterPermissions()) return null;
                        } else {
                            //filter all
                            if(filterRoleName() && filterPermissions()) return null;
                        }
                    }

                    return (
                        <RoleCard
                            editRole={(role) => {
                                //set selected role and open up edit panel
                                setRole({ ...role });
                                setPanelTitle("Edit Role");
                                setShowCreateRolePanel(true);
                            }}
                            key={el.id}
                            role={el}
                        />
                    );
                })}
			</ItemContainer>

			<SidePanel
				title={panelTitle}
				visible={showCreateRolePanel}
				setVisibility={setShowCreateRolePanel}
			>
				<div className="create-role-panel">
					<TextInput
						className="my-3 mx-5"
						placeholder="Role Name"
						value={role.name ? role.name : ""}
						setValue={(val) => setRole({ ...role, name: val })}
					/>
					<Textarea
						className="my-3 mx-5"
						style={{ height: "180px" }}
						placeholder="Role Description"
						value={role.description ? role.description : ""}
						setValue={(val) =>
							setRole({ ...role, description: val })
						}
					/>
					<div className="create-role-permissions">
						<h4 className="mx-5">Permissions</h4>
						<h5 className="mx-5">Store</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Get store detail"
									id="Get store detail"
								/>
								<PermissionCheckbox
									text="Add store document"
									id="Add store document"
								/>
								<PermissionCheckbox
									text="Remove store document"
									id="Remove store document"
								/>
								<PermissionCheckbox
									text="Delete store"
									id="Delete store"
								/>
								<PermissionCheckbox
									text="Update store address"
									id="Update store address"
								/>
								<PermissionCheckbox
									text="Update store name"
									id="Update store name"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Update store industry"
									id="Update store industry"
								/>
								<PermissionCheckbox
									text="Update website"
									id="Update website"
								/>
								<PermissionCheckbox
									text="Update store registration number"
									id="Update store registration number"
								/>
								<PermissionCheckbox
									text="Update store tax id"
									id="Update store tax id"
								/>
								<PermissionCheckbox
									text="Update store logo"
									id="Update store logo"
								/>
								<PermissionCheckbox
									text="Update store slogan"
									id="Update store slogan"
								/>
							</div>
						</div>
						<h5 className="mx-5">Employee</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Add employee"
									id="Add employee"
								/>
								<PermissionCheckbox
									text="Get employee list"
									id="Get employee list"
								/>
								<PermissionCheckbox
									text="Get employee details"
									id="Get employee details"
								/>
								<PermissionCheckbox
									text="Assign role to employee"
									id="Assign role to employee"
								/>
								<PermissionCheckbox
									text="Assign schedule"
									id="Assign schedule"
								/>
								<PermissionCheckbox
									text="Remove schedule"
									id="Remove schedule"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Active employee"
									id="Active employee"
								/>
								<PermissionCheckbox
									text="Inactive employee"
									id="Inactive employee"
								/>
								<PermissionCheckbox
									text="Resend invitation"
									id="Resend invitation"
								/>
								<PermissionCheckbox
									text="Remove role from employee"
									id="Remove role from employee"
								/>
								<PermissionCheckbox
									text="Remove employee"
									id="Remove employee"
								/>
							</div>
						</div>
						<h5 className="mx-5">Branch</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Add branch"
									id="Add branch"
								/>
								<PermissionCheckbox
									text="Add schedule to branch"
									id="Add schedule to branch"
								/>
								<PermissionCheckbox
									text="Get branch details"
									id="Get branch details"
								/>
								<PermissionCheckbox
									text="Get details"
									id="Get details"
								/>
								<PermissionCheckbox
									text="Get branch list"
									id="Get branch list"
								/>
								<PermissionCheckbox
									text="Get branches by addresses"
									id="Get branches by addresses"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Update branch custom ID"
									id="Update branch custom ID"
								/>
								<PermissionCheckbox
									text="Update branch address"
									id="Update branch address"
								/>
								<PermissionCheckbox
									text="Update branch status"
									id="Update branch status"
								/>
								<PermissionCheckbox
									text="Update branch name"
									id="Update branch name"
								/>
								<PermissionCheckbox
									text="Remove branch schedule"
									id="Remove branch schedule"
								/>
								<PermissionCheckbox
									text="Remove branch"
									id="Remove branch"
								/>
							</div>
						</div>
						<h5 className="mx-5">AuthSDK</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Add policy"
									id="Add policy"
								/>
								<PermissionCheckbox
									text="Get policy"
									id="Get policy"
								/>
								<PermissionCheckbox
									text="Get policies list"
									id="Get policies list"
								/>
								<PermissionCheckbox
									text="Get resources list"
									id="Get resources list"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Authenticate"
									id="Authenticate"
								/>
								<PermissionCheckbox
									text="Authenticate request context"
									id="Authenticate request context"
								/>
								<PermissionCheckbox
									text="Validate policy"
									id="Validate policy"
								/>
								<PermissionCheckbox
									text="Remove policy"
									id="Remove policy"
								/>
							</div>
						</div>
						<h5 className="mx-5">Address</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Add address"
									id="Add address"
								/>
								<PermissionCheckbox
									text="Get address details"
									id="Get address details"
								/>
								<PermissionCheckbox
									text="Get near by address"
									id="Get near by address"
								/>
								<PermissionCheckbox
									text="Update address line 1"
									id="Update address line 1"
								/>
								<PermissionCheckbox
									text="Update address line 2"
									id="Update address line 2"
								/>
								<PermissionCheckbox
									text="Update geometry detail"
									id="Update geometry detail"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Update address contact"
									id="Update address contact"
								/>
								<PermissionCheckbox
									text="Update address zipcode"
									id="Update address zipcode"
								/>
								<PermissionCheckbox
									text="Update address city"
									id="Update address city"
								/>
								<PermissionCheckbox
									text="Update address state"
									id="Update address state"
								/>
								<PermissionCheckbox
									text="Update address country"
									id="Update address country"
								/>
							</div>
						</div>
						<h5 className="mx-5">Role</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Add role"
									id="Add role"
								/>
								<PermissionCheckbox
									text="Get roles list"
									id="Get roles list"
								/>
								<PermissionCheckbox
									text="Get role details"
									id="Get role details"
								/>
								<PermissionCheckbox
									text="Add resource to role"
									id="Add resource to role"
								/>
								<PermissionCheckbox
									text="Remove resource from role"
									id="Remove resource from role"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Update role name"
									id="Update role name"
								/>
								<PermissionCheckbox
									text="Update role description"
									id="Update role description"
								/>
								<PermissionCheckbox
									text="Update role policy"
									id="Update role policy"
								/>
								<PermissionCheckbox
									text="Remove role"
									id="Remove role"
								/>
							</div>
						</div>
						<h5 className="mx-5">Contact</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Add contact"
									id="Add contact"
								/>
								<PermissionCheckbox
									text="Get contact details"
									id="Get contact details"
								/>
								<PermissionCheckbox
									text="Update contact person"
									id="Update contact person"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Update contact email"
									id="Update contact email"
								/>
								<PermissionCheckbox
									text="Update contact phone"
									id="Update contact phone"
								/>
							</div>
						</div>
						<h5 className="mx-5">Schedule</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Add schedule"
									id="Add schedule"
								/>
								<PermissionCheckbox
									text="Add schedule time slot"
									id="Add schedule time slot"
								/>
								<PermissionCheckbox
									text="Get schedules list"
									id="Get schedules list"
								/>
								<PermissionCheckbox
									text="Get schedule details"
									id="Get schedule details"
								/>
								<PermissionCheckbox
									text="Update schedule name"
									id="Update schedule name"
								/>
								<PermissionCheckbox
									text="Update schedule policy id"
									id="Update schedule policy id"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Update time slot"
									id="Update time slot"
								/>
								<PermissionCheckbox
									text="Update schedule timezone"
									id="Update schedule timezone"
								/>
								<PermissionCheckbox
									text="Remove time slot"
									id="Remove time slot"
								/>
								<PermissionCheckbox
									text="Remove schedule policy"
									id="Remove schedule policy"
								/>
								<PermissionCheckbox
									text="Remove schedule"
									id="Remove schedule"
								/>
							</div>
						</div>
						<h5 className="mx-5">File</h5>
						<div className="row w-75 mx-5">
							<div className="col-6">
								<PermissionCheckbox
									text="Upload file"
									id="Upload file"
								/>
								<PermissionCheckbox
									text="Load private file"
									id="Load private file"
								/>
							</div>
							<div className="col-6">
								<PermissionCheckbox
									text="Get file metadata"
									id="Get file metadata"
								/>
							</div>
						</div>
						<div
							className="mr-5 text-orange font-weight-medium float-right clickable"
							onClick={() => {
								setShowDeletePanel(true);
							}}
							style={{
								display:
									panelTitle === "Edit Role"
										? "block"
										: "none",
							}}
						>
							Remove Employee
						</div>
						<div className="m-5">
							<Button onClick={saveRole}>
								{" "}
								<img
									className="mr-3"
									src={save}
									alt="save"
								/>{" "}
								Save
							</Button>
							<Button
								className="ml-3"
								background="#E74B3C"
								outline={true}
								onClick={() => {
									setRole({});
									setShowCreateRolePanel(false);
								}}
							>
								{" "}
								Cancel{" "}
							</Button>
						</div>
					</div>
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
							Do you want to remove {role.name}?
						</h3>
					</div>
					<div>
						<Button onClick={deleteRole}>
                            Confirm
						</Button>
						<Button
							className="ml-3"
							background="#E74B3C"
							outline={true}
							onClick={() => {
								setShowDeletePanel(false);
							}}
						>
							{" "}
							Cancel{" "}
						</Button>
					</div>
				</div>
			</SidePanel>
		</div>
	);
}
