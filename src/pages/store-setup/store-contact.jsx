// @ts-nocheck
import { useSetStore, useStore } from "../../contexts/store-context";
import location from "../../assets/svgs/location.svg";
import dots from "../../assets/svgs/dots.svg";
import email from "../../assets/svgs/email.svg";
import website from "../../assets/svgs/website.svg";
import React, { useRef, useState } from "react";
import TextInputWithIcon from "../../components/inputs/text-input/text-input-with-icon";
import PhoneCodeSelect from "../../components/inputs/select/phone-code-select";
import NextButton from "../../components/buttons/next-button";
import TextInput from "../../components/inputs/text-input";
import BackButton from "../../components/buttons/back-button";
import SelectLocationPanel from "../../components/inputs/select-location-panel";
import SidePanel from "../../components/side-panel";
import Button from "../../components/buttons/button";

export default function StoreContact(props) {
	const store = useStore();
	const setStore = useSetStore();
	const [showMapSelector, setShowMapSelector] = useState(false);
	const ref = useRef();

	const setAddress = (val) => {
		setStore({ ...store, address: val });
	};

	const setPincode = (val) => {
		setStore({ ...store, pincode: val });
	};

	const setPhoneCode = (val) => {
		setStore({ ...store, phoneCode: val });
	};

	const setPhone = (val) => {
		setStore({ ...store, phone: val });
	};

	const setEmail = (val) => {
		setStore({ ...store, email: val });
	};

	const setWebsite = (val) => {
		setStore({ ...store, website: val });
	};

	return (
		<div className="container store-setup-form d-flex">
			<div className="d-flex w-100 justify-content-between align-items-baseline">
				<div className="store-setup-h1">Contact Details</div>
				<div className="store-setup-h3">2/3</div>
			</div>
			<div className="store-setup-h4">
				Fill your Store Contact details
			</div>
			<div className="create-store-input-container mx-auto"
			style={{
				width:"100%",
			}}
			>
				<div className="create-store-select-location-button"
					onClick={() => {setShowMapSelector(true)}}
					style={{width: "fit-content"}}
				>
					Select Location
				</div>
				<TextInputWithIcon
					value={store.address}
					setValue={setAddress}
					icon={location}
					placeholder="Store Address"
					onClick={() => {setShowMapSelector(true)}}
					onFocus={(e) => {
						//prevent auto-fill from popping up at address input
						document.activeElement.blur();
					}}
					autoComplete="off"
					style={{}}
				/>
				<div className="row">
					<div className="col-11 p-0 mx-auto"
					    style={{
							width: "100%"
						}}
					>
						<TextInputWithIcon
							value={store.pincode}
							setValue={setPincode}
							icon={dots}
							placeholder="Pincode"
						/>
					</div>
				</div>
				<div className="d-flex">
					<PhoneCodeSelect value={store.phoneCode} setValue={setPhoneCode}/>
					<TextInput className="flex-grow-1 ml-3" value={store.phone} setValue={setPhone} placeholder="000000000"/>
				</div>
				<TextInputWithIcon
					value={store.email}
					setValue={setEmail}
					icon={email}
					placeholder="Email Address"
				/>
				<TextInputWithIcon
					value={store.website}
					setValue={setWebsite}
					icon={website}
					placeholder="Website URL"
				/>
			</div>
			<div className="create-store-buton-panel">
				<div className="float-left">
					<BackButton url={`detail`} />
				</div>
				<div className="float-right">
					<NextButton url={`document`} />
				</div>
			</div>

			<SidePanel title="Select Location" visible={showMapSelector} setVisibility={setShowMapSelector}>
				<div className="m-5" style={{width:"60vw", height:"60vh"}}>
					<SelectLocationPanel
						width="100%"
						height="100%"
						value={store.address}
						setValue={setAddress}
						placeholder="Store Address"
						setVisibility={setShowMapSelector}
					/>
				</div>
				<div className="mt-auto">
					<Button className="m-5" onClick={() => {setShowMapSelector(false)}}>Next</Button>
				</div>
			</SidePanel>
			
		</div>
	);
}
