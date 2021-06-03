// @ts-nocheck
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import BranchCard from "../../components/branch-card";
import CreateItemButton from "../../components/buttons/create-item-button";
import LayoutToggle from "../../components/buttons/layout-toggle";
import FilterBar from "../../components/inputs/filter-bar";
import ItemContainer from "../../components/item-container";
import MOCK_SERVER_URL from "../../config/mock-server";
import { useSetStore, useStore } from "../../contexts/store-context";
import profile from "../../assets/svgs/profile.png";
import "./style.css";
import Button from "../../components/buttons/button";
import pencil from "../../assets/svgs/pencil.svg";
import save from "../../assets/svgs/save.svg";
import SidePanel from "../../components/side-panel";
import TextInput from "../../components/inputs/text-input";
import Select from "../../components/inputs/select";
import Textarea from "../../components/inputs/textarea";
import ImageUpload from "../../components/inputs/image-upload";
import PhoneCodeSelect from "../../components/inputs/select/phone-code-select";
import cross from "../../assets/svgs/dark-cross.svg";
import SelectLocationPanel from "../../components/inputs/select-location-panel";
import { useGetUserToken } from "../../contexts/auth-context";

export default function BranchPage(props) {
	const [layout, setLayout] = useState("grid");
	const [branchList, setBranchList] = useState([]);
	const [filter, setFilter] = useState({});
	const [panelTitle, setPanelTitle] = useState("Create Role");
	const [showSidePanel, setShowSidePanel] = useState(false);
	const [selectedBranch, setSelectedBranch] = useState({});
    const [showEditStorePanel, setShowEditStorePanel] = useState(false);
    const [showDeletePanel, setShowDeletePanel] = useState(false);
    const [showActivatePanel, setShowActivatePanel] = useState(false);
    const [showDeactivatePanel, setShowDeactivatePanel] = useState(false);
    const [showStoreAddressPanel, setShowStoreAddressPanel] = useState(false);
    const [showBranchAddressPanel, setShowBranchAddressPanel] = useState(false);

    const store = useStore();
    const setStore = useSetStore();
    const [tempStore, setTempStore] = useState({});

    const fileInputRef = useRef();
    const getUserToken = useGetUserToken();

    const editBranch = (branch) => {
        setSelectedBranch(branch);
        setPanelTitle("Edit Branch");
        setShowSidePanel(true);
    }

    const saveBranch = () => {
        //TODO: endpoint

        //get a new branch ready
        setSelectedBranch({});
        //hide panel
        setShowSidePanel(false);
    }

    const deleteBranch = () => {
        //TODO: endpoint
        
        setSelectedBranch({});
        setShowDeletePanel(false);
        setShowSidePanel(false);
    }

    const activateBranch = () => {
        //TODO: endpoint
        setShowActivatePanel(false);
    }

    const deactivateBranch = () => {
        //TODO: endpoint
        setShowDeactivatePanel(false);
    }

    const saveStore = () => {
        //TODO: endpoint - save information in tempStore to the end point.
        setShowEditStorePanel(false);
        //TODO: change this part to use server returned information
        setStore(tempStore);
    }

    const uploadFile = file => {
        //TODO: change image endpoint
        axios.post("https://run.mocky.io/v3/bf252306-0e8d-496b-9733-1ee630dd9ab1", 
            {
                userToeken: getUserToken(),
                file: file
            }
        ).then(res => {
            addDocument(file.name);
        }).catch(err => {
            console.error(err);
        })
    };

    const addDocument = (name) => {
        // @ts-ignore
        let newList = [];
        if(tempStore.documents) newList = [...tempStore.documents];
        newList.push(name);
        setTempStore({ ...tempStore, documents: newList});
    }

    const removeDocument = (index) => {
        // @ts-ignore
        const newList = [...tempStore.documents];
        newList.splice(index, 1);
        setTempStore({ ...tempStore, documents: newList});
    }


	//get role list from mock server
	useEffect(() => {
		axios
			.get(MOCK_SERVER_URL + "/branches/01EZ7PWNGF44R5BGBHV3DK849K")
			.then((res) => {
				setBranchList(res.data.data);
			});
	}, [setBranchList]);

	return (
		<div>
            {/* store card */}
            <div className="store-card">
                <div className="store-summary">
                    <div className="store-logo">
                        <img src={store.logo?store.logo:profile} alt={store.storeName} />
                    </div>
                    <div className="store-name">{store.storeName}</div>
                    <div className="store-description">{store.desc}</div>
                </div>
                <div className="store-info">
                    <div className="h-50">
                        <div>
                            <div className="store-info-title">
                                Industry
                            </div>
                            <div className="store-info-data">
                                {store.industry}
                            </div>
                        </div>
                        <div>
                            <div className="store-info-title">
                                Tax ID
                            </div>
                            <div className="store-info-data">
                                {store.taxId}
                            </div>
                        </div>
                        <div>
                            <div className="store-info-title">
                                Registration Number
                            </div>
                            <div className="store-info-data">
                                {store.registrationNumber}
                            </div>
                        </div>
                        <div>
                            <div className="store-info-title">
                                Documents
                            </div>
                            <div className="store-info-data">
                                <div className="store-documents">
                                    {store.documents?store.documents.map((doc, index) => <div key={`doc-${index}`}>{doc}</div>):null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-50">
                        <div>
                            <div className="store-info-title">
                                Email
                            </div>
                            <div className="store-info-data">
                                {store.email}
                            </div>
                        </div>
                        <div>
                            <div className="store-info-title">
                                Phone Number
                            </div>
                            <div className="store-info-data">
                                {store.phoneCode}-{store.phone}
                            </div>
                        </div>
                        <div>
                            <div className="store-info-title">
                                Address
                            </div>
                            <div className="store-info-data">
                                {store.address}
                            </div>
                        </div>
                        <div>
                            <div className="store-info-title">
                                Website
                            </div>
                            <div className="store-info-data">
                                {store.website}
                            </div>
                        </div>
                    </div>
                    <Button outline={true} onClick={() => {
                        setTempStore({...store});
                        setShowEditStorePanel(true);
                    }}>
                        <img className="mr-3" src={pencil} alt="edit" />
                        Edit
                    </Button>
                </div>
            </div>
			{/* top bar */}
			<div className="d-flex my-4 mx-5 align-items-baseline shrink-on-mobile">
				{/* Layout toggle buttons */}
				<LayoutToggle layout={layout} setLayout={setLayout} />
				<div className="ml-auto d-flex align-items-baseline">
					{/* create role button */}
					<CreateItemButton
						text="Add Branch"
						onClick={() => {
							//if selected role already exist (have an id) then create a new role
							if (selectedBranch.id) {
								setSelectedBranch({});
							}
							setPanelTitle("Add Branch");
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
						<option value="ID">ID</option>
						<option value="Name">Name</option>
						<option value="Email">Email</option>
						<option value="Address">Address</option>
					</FilterBar>
				</div>
			</div>
            <ItemContainer layout={layout}>
				<div className="item-container-list-titles">
					<div style={{ width: "250px", paddingLeft: "90px" }}>
						Branch Name
					</div>
					<div style={{ width: "650px", paddingLeft: "90px" }}>
						Address
					</div>
					<div style={{ width: "500px", paddingLeft: "90px" }}>
						Email
					</div>
				</div>
                {branchList.map((el) => {
                    //Filter ID
                    const filterID = () => {
                        if (
                            !el.id
                                .toLowerCase()
                                .includes(filter.value.toLowerCase())
                        )
                            return true;
                    };

					//Filter Name
					const filterName = () => {
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

                    //Filter Address
					const filterAddress = () => {
						if (
							!el.address
								.toLowerCase()
								.includes(filter.value.toLowerCase())
						)
							return true;
					};


					//Filter the branches
					if (filter.value !== undefined) {
						if (filter.value !== "") {
							if (filter.type === "ID") {
								if (filterID()) return null;
							} else if (filter.type === "Name") {
								if (filterName()) return null;
							} else if (filter.type === "Email") {
								if (filterEmail()) return null;
							} else if (filter.type === "Address") {
								if (filterAddress()) return null;
							} else {
								//filter all
								if (
									filterID() &&
									filterName() &&
                                    filterEmail() &&
									filterAddress()
								)
									return null;
							}
						}
					}

					return (
						<BranchCard
							key={el.id}
							branch={el}
                            editBranch={editBranch}
                            activateBranch={() => {
                                setSelectedBranch(el);
                                setShowActivatePanel(true);
                            }}
                            deactivateBranch={() => {
                                setSelectedBranch(el);
                                setShowDeactivatePanel(true);
                            }}
						/>
					);
				})}
            </ItemContainer>
            {/* Confirm activate panel */}
            <SidePanel
				title="Confirmation"
				visible={showActivatePanel}
				setVisibility={setShowActivatePanel}
			>
				<div className=" flex-grow-1 d-flex flex-column m-5 px-5">
					<div className="flex-grow-1">
						<h3 className="text-blue">
							Do you want to activate {selectedBranch.name}?
						</h3>
					</div>
					<div>
						<Button onClick={activateBranch}>Confirm</Button>
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
            {/* Confirm deactivate panel */}
            <SidePanel
				title="Confirmation"
				visible={showDeactivatePanel}
				setVisibility={setShowDeactivatePanel}
			>
				<div className=" flex-grow-1 d-flex flex-column m-5 px-5">
					<div className="flex-grow-1">
						<h3 className="text-blue">
							Do you want to deactivate {selectedBranch.name}?
						</h3>
					</div>
					<div>
						<Button onClick={deactivateBranch}>Confirm</Button>
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
            {/* Edit Store Panel */}
            <SidePanel
				title="Edit Store"
				visible={showEditStorePanel}
				setVisibility={setShowEditStorePanel}
			>
                <div className="edit-store-form mx-5 my-3">
                    <div className="row mx-5">
                        <div className="col-12 col-lg-6 pr-lg-1">
                            <TextInput
                                className="my-1 w-100"
                                value={tempStore.storeName ? tempStore.storeName : ""}
                                setValue={(val) => {
                                    setTempStore({ ...tempStore, storeName: val });
                                }}
                                placeholder="Store Name"
                            />
                        </div>
                        <div className="col-12 col-lg-6 pl-lg-1">
                            <Select
                                className="my-1 w-100"
                                value={tempStore.industry}
                                setValue={(val) => {
                                    setTempStore({ ...tempStore, industry: val });
                                }}
                                placeholder="Select Industry"
                            >
                                <option value="it">IT</option>
                                <option value="science">Science</option>
                                <option value="hardware">Hardware</option>
                            </Select>
                        </div>
                    </div>
                    <div className="d-flex mx-5 my-1">
                        <Textarea
							style={{ height: "152px", flexGrow:1}}
							placeholder="Store Description"
							value={tempStore.desc}
							setValue={(val) => {
                                setTempStore({ ...tempStore, desc: val });
                            }}
						/>
                        <div className="col-4 p-0 pl-2">
                            <ImageUpload className="h-100" text="Upload Logo" handleUpload={(url) => {
                                setTempStore({...tempStore, logo: url});
                            }}/>
                        </div>
                    </div>
                    <div className="row mx-5">
                        <div className="col-12 col-lg-6 pr-lg-1">
                            <TextInput
                                className="my-1 w-100"
                                value={tempStore.email ? tempStore.email : ""}
                                setValue={(val) => {
                                    setTempStore({ ...tempStore, email: val });
                                }}
                                placeholder="Email"
                            />
                        </div>
                        <div className="col-12 col-lg-6 pl-lg-1">
                            <div className="d-flex">
                                <PhoneCodeSelect
                                    style={{borderRadius: "15px 0 0 15px", width:"170px", flexShrink:0}}
                                    value={tempStore.phoneCode} 
                                    setValue={(val) => {
                                        setTempStore({ ...tempStore, phoneCode: val });
                                    }}
                                />
                                <TextInput className="flex-grow-1" 
                                    style={{borderRadius: "0 15px 15px 0", borderLeft:"none", width:"150px"}}
                                    value={tempStore.phone} 
                                    setValue={(val) => {
                                    setTempStore({ ...tempStore, phone: val });
                                }} placeholder="000000000"/>
                            </div>
                        </div>
                    </div>
                    <div className="row mx-5">
                        <div className="col-12 col-lg-6 pr-lg-1">
                            <TextInput
                                className="my-1 w-100"
                                value={tempStore.website ? tempStore.website : ""}
                                setValue={(val) => {
                                    setTempStore({ ...tempStore, website: val });
                                }}
                                placeholder="Website"
                            />
                        </div>
                        <div className="col-12 col-lg-6 pl-lg-1">
                            <TextInput
                                className="my-1 w-100"
                                value={tempStore.address ? tempStore.address : ""}
                                setValue={(val) => {
                                    setTempStore({ ...tempStore, address: val });
                                }}
                                onClick={() => {setShowStoreAddressPanel(true)}}
                                onFocus={(e) => {
                                    //prevent auto-fill from popping up at address input
                                    document.activeElement.blur();
                                }}
                                placeholder="Address"
                            />
                        </div>
                    </div>
                    <div className="row mx-5">
                        <div className="col-12 col-lg-6 pr-lg-1">
                            <TextInput
                                className="my-1 w-100"
                                value={tempStore.taxId ? tempStore.taxId : ""}
                                setValue={(val) => {
                                    setTempStore({ ...tempStore, taxId: val });
                                }}
                                placeholder="Tax ID"
                            />
                        </div>
                        <div className="col-12 col-lg-6 pl-lg-1">
                            <TextInput
                                className="my-1 w-100"
                                value={tempStore.registrationNumber ? tempStore.registrationNumber : ""}
                                setValue={(val) => {
                                    setTempStore({ ...tempStore, registrationNumber: val });
                                }}
                                placeholder="Registeration Number"
                            />
                        </div>
                    </div>
                    <div className="mx-5 my-1 d-flex flex-wrap align-items-center" style={{width: "850px"}}>
                        <Button className="create-store-upload-button" outline={true} onClick={() => {
                            fileInputRef.current.click();
                        }}>Upload Document</Button>
                        <input ref={fileInputRef} type="file" style={{display: "none"}} onInput={e => {
                            for(const file of e.target.files) {
                                uploadFile(file);
                            }
                            e.target.value = "";
                        }}/>

                        {tempStore.documents?tempStore.documents.map((document, index) => <div key={`document-${index}`} className="create-store-document-file">
                            {document}
                            <img className="ml-2 mr-4 clickable" src={cross} alt="remove" height="13px" onClick={() => {
                                removeDocument(index);
                            }}/>
                        </div>):null}
                    </div>
                </div>
				<div className="mt-auto mx-5 mb-5">
					<div className="mx-5 mt-5">
                        <Button onClick={saveStore}>
                            <img className="mr-3" src={save} alt="save" /> Save
                        </Button>
                        <Button
                            className="ml-3"
                            background="#E74B3C"
                            outline={true}
                            onClick={() => {
                                setTempStore({...store});
                                setShowEditStorePanel(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
				</div>
			</SidePanel>
            {/* Select Store Address Panel */}
            <SidePanel title="Select Location" visible={showStoreAddressPanel} setVisibility={setShowStoreAddressPanel}>
				<div className="m-5" style={{width:"60vw", height:"60vh"}}>
					<SelectLocationPanel
						width="100%"
						height="100%"
						value={tempStore.address}
						setValue={(val) => {setTempStore({...tempStore, address: val})}}
						placeholder="Store Address"
                        setVisibility={setShowStoreAddressPanel}
					/>
				</div>
				<div className="mt-auto">
					<Button className="m-5" onClick={() => {setShowStoreAddressPanel(false)}}>Next</Button>
				</div>
			</SidePanel>
            {/* Add/Edit Branch Panel */}
            <SidePanel
				title={panelTitle}
				visible={showSidePanel}
				setVisibility={setShowSidePanel}
			>
                <div className="branch-form mx-5">
                    <TextInput
                        className="my-1 w-100"
                        value={selectedBranch.id ? selectedBranch.id : ""}
                        setValue={(val) => {
                            setSelectedBranch({ ...selectedBranch, id: val });
                        }}
                        placeholder="ID"
                    />
                    <TextInput
                        className="my-1 w-100"
                        value={selectedBranch.name ? selectedBranch.name : ""}
                        setValue={(val) => {
                            setSelectedBranch({ ...selectedBranch, name: val });
                        }}
                        placeholder="Name"
                    />
                    <TextInput
                        className="my-1 w-100"
                        value={selectedBranch.address ? selectedBranch.address : ""}
                        setValue={(val) => {
                            setSelectedBranch({ ...selectedBranch, address: val });
                        }}
                        onClick={() => {setShowBranchAddressPanel(true)}}
                        onFocus={(e) => {
                            //prevent auto-fill from popping up at address input
                            document.activeElement.blur();
                        }}
                        placeholder="Address"
                    />
                    <TextInput
                        className="my-1 mt-5 w-100"
                        value={selectedBranch.contactName ? selectedBranch.contactName : ""}
                        setValue={(val) => {
                            setSelectedBranch({ ...selectedBranch, contactName: val });
                        }}
                        placeholder="Contact Person Name"
                    />
                    <TextInput
                        className="my-1 w-100"
                        value={selectedBranch.contactEmail ? selectedBranch.contactEmail : ""}
                        setValue={(val) => {
                            setSelectedBranch({ ...selectedBranch, contactEmail: val });
                        }}
                        placeholder="Contact Email"
                    />
                    <TextInput
                        className="my-1 w-100"
                        value={selectedBranch.contactNumber ? selectedBranch.contactNumber : ""}
                        setValue={(val) => {
                            setSelectedBranch({ ...selectedBranch, contactNumber: val });
                        }}
                        placeholder="Contact Phone Number"
                    />
                    <div
                        className={`m-5 align-self-end text-warning font-weight-bold clickable ${
                            panelTitle === "Edit Branch" ? "" : "d-none"
                        }`}
                        onClick={() => {
                            setShowDeletePanel(true);
                        }}
                    >
                        Remove Branch
                    </div>
                </div>
                <div className="mt-auto mx-5 mb-5">
					<div className="mx-5 mt-5">
                        <Button onClick={saveBranch}>
                            <img className="mr-3" src={save} alt="save" /> Save
                        </Button>
                        <Button
                            className="ml-3"
                            background="#E74B3C"
                            outline={true}
                            onClick={() => {
                                setSelectedBranch({});
                                setShowSidePanel(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
				</div>
            </SidePanel>
            {/* Select Branch Address Panel */}
            <SidePanel title="Select Location" visible={showBranchAddressPanel} setVisibility={setShowBranchAddressPanel}>
				<div className="m-5" style={{width:"60vw", height:"60vh"}}>
					<SelectLocationPanel
						width="100%"
						height="100%"
						value={selectedBranch.address}
						setValue={(val) => {setSelectedBranch({...selectedBranch, address: val})}}
						placeholder="Branch Address"
                        setVisibility={setShowBranchAddressPanel}
					/>
				</div>
				<div className="mt-auto">
					<Button className="m-5" onClick={() => {setShowBranchAddressPanel(false)}}>Next</Button>
				</div>
			</SidePanel>
            {/* Remove Branch Confirmation Panel */}
            <SidePanel
				title="Confirmation"
				visible={showDeletePanel}
				setVisibility={setShowDeletePanel}
			>
				<div className=" flex-grow-1 d-flex flex-column m-5 px-5">
					<div className="flex-grow-1">
						<h3 className="text-blue">
							Do you want to remove {selectedBranch.name}?
						</h3>
					</div>
					<div>
						<Button onClick={deleteBranch}>Confirm</Button>
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
		</div>
	);
}
