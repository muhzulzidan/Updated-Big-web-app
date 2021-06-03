// @ts-nocheck
import TextInputWithIcon from "../../components/inputs/text-input/text-input-with-icon";
import Textarea from "../../components/inputs/textarea";
import Select from "../../components/inputs/select";
import storeIcon from "../../assets/svgs/store.svg";
import industryIcon from "../../assets/svgs/industry.svg";
import paragraph from "../../assets/svgs/paragraph.svg";
import { useSetStore, useStore } from "../../contexts/store-context";
import ImageUpload from "../../components/inputs/image-upload";

import NextButton from "../../components/buttons/next-button";

export default function StoreDetail(props) {
	const store = useStore();
	const setStore = useSetStore();

	const setStoreName = (val) => {
		setStore({ ...store, storeName: val });
	};

	const setIndustry = (val) => {
		setStore({ ...store, industry: val });
	};

	const setDesc = (val) => {
		setStore({ ...store, desc: val });
	};

	const setLogo = (val) => {
		setStore({ ...store, logo: val });
	}

	return (
		<div className="container store-setup-form">
			<div className="d-flex w-100 justify-content-between align-items-baseline">
				<div className="store-setup-h1">Store Details</div>
				<div className="store-setup-h3">1/3</div>
			</div>
			<div className="store-setup-h4">
				Fill your store details if not registered previously
			</div>
			<div className="create-store-input-container ">
				<TextInputWithIcon
					value={store.storeName}
					setValue={setStoreName}
					icon={storeIcon}
					placeholder="Store name"
				/>
				<Select
					icon={industryIcon}
					value={store.industry}
					setValue={setIndustry}
					placeholder="Select Industry"
				>
					<option value="it">IT</option>
					<option value="science">Science</option>
					<option value="hardware">Hardware</option>
				</Select>
				<div className="row mx-auto flex">
					<div className="col-7 p-0 mx-auto" 
					style={{
						width:"62%"
					}}
					>
						<Textarea
							style={{ height: "221px" }}
							placeholder="Store Description"
							icon={paragraph}
							value={store.desc}
							setValue={setDesc}
						/>
					</div>
					<div className="col-4 p-0 pl-2" >
						<ImageUpload className="h-100" text="Upload Logo" handleUpload={setLogo}
						
						/>
					</div>
				</div>
			</div>
			<div className="create-store-buton-panel" 

			>
				<div className="float-right">
					<NextButton url={`contact`} />
				</div>
			</div>
		</div>
	);
}
