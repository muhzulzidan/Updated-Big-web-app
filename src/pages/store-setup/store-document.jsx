// @ts-nocheck
import React, { useRef } from "react";
import { useHistory } from "react-router";
import BackButton from "../../components/buttons/back-button";
import Button from "../../components/buttons/button";
import TextInputWithIcon from "../../components/inputs/text-input/text-input-with-icon";
import { useSetStore, useStore } from "../../contexts/store-context"
import taxId from "../../assets/svgs/tax-id.svg";
import copy from "../../assets/svgs/copy.svg";
import cross from "../../assets/svgs/dark-cross.svg";
import axios from "axios";
import { useGetUserToken } from "../../contexts/auth-context";

export default function StoreDocument(props) {
    const store = useStore();
    const setStore = useSetStore();
    const history = useHistory();

    const fileInputRef = useRef();
    const getUserToken = useGetUserToken();

    const setTaxId = (val) => {
		setStore({ ...store, taxId: val });
	};

    const setRegistrationNumber = (val) => {
		setStore({ ...store, registrationNumber: val });
	};

    const addDocument = (name) => {
        // @ts-ignore
        let newList = [];
        if(store.documents) newList = [...store.documents];
        newList.push(name);
        setStore({ ...store, documents: newList});
    }

    const removeDocument = (index) => {
        // @ts-ignore
        const newList = [...store.documents];
        newList.splice(index, 1);
        setStore({ ...store, documents: newList});
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
    
    return (
        <div className="container store-setup-form">
            <div className="d-flex w-100 justify-content-between align-items-baseline">
				<div className="store-setup-h1">Scan Document</div>
				<div className="store-setup-h3">3/3</div>
			</div>
			<div className="store-setup-h4">
                Add Document details
			</div>
			<div className="create-store-input-container">
                <TextInputWithIcon
					value={store.taxId}
					setValue={setTaxId}
					icon={taxId}
					placeholder="Tax ID"
				/>
                <TextInputWithIcon
					value={store.registrationNumber}
					setValue={setRegistrationNumber}
					icon={copy}
					placeholder="Registration No."
				/>
                <div className="create-store-input-panel">
                    <div className="create-store-input-panel-title">
                        Import Documents
                    </div>
                    <div className="m-5 d-flex flex-wrap align-items-center">
                        <Button className="create-store-upload-button" outline={true} onClick={() => {
                            fileInputRef.current.click();
                        }}>Upload Document</Button>
                        <input ref={fileInputRef} type="file" style={{display: "none"}} onInput={e => {
                            for(const file of e.target.files) {
                                uploadFile(file);
                            }
                            e.target.value = "";
                            
                        }}/>

                        {store.documents?store.documents.map((document, index) => <div key={`document-${index}`} className="create-store-document-file">
                            {document}
                            <img className="ml-2 mr-4 clickable" src={cross} alt="remove" height="13px" onClick={() => {
                                removeDocument(index);
                            }}/>
                        </div>):null}
                    </div>
                </div>
            </div>
			<div className="create-store-buton-panel">
				<div className="float-left">
					<BackButton url={`contact`} />
				</div>
				<div className="float-right">
                    <Button onClick={() => {
                        //TODO: send store to backend and get id
                        setStore({...store, id: "TEMP"});
                        history.push("/");
                    }}>Create Store</Button>
				</div>
			</div>
        </div>
    )
}