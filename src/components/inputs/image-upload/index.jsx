// @ts-nocheck
import "./style.css";
import picture from "../../../assets/svgs/picture.svg";
import VerticalCenter from "../../vertical-center";
import { useRef, useState } from "react";
import axios from "axios";
import { useGetUserToken } from "../../../contexts/auth-context";

export default function ImageUpload({className, handleUpload, text, ...rest}) {
    const [url, setUrl] = useState("");
    const inputRef = useRef();
    const getUserToken = useGetUserToken();

    const uploadFiles = files => {
        //TODO: change image endpoint
        axios.post("https://run.mocky.io/v3/bf252306-0e8d-496b-9733-1ee630dd9ab1", 
            {
                userToeken: getUserToken(),
                files: files
            }
        ).then(res => {
            setUrl(res.data.data.url);
            handleUpload(res.data.data.url);
        }).catch(err => {
            console.error(err);
        })
    };

    return (
        <div 
            className={`image-upload-container clickable ${className?className:""}`}
            onClick={() => {inputRef.current.click()}}
            onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                console.log(e.dataTransfer.files);
                uploadFiles(e.dataTransfer.files);
            }}
            onDragOver={e => {
                console.log("DragOver");
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
            }}
            style={{
                width: "95%",
            }}
        >
            <VerticalCenter>
                <div className="mx-auto text-center">
                    <img className="mx-auto" src={url?url:picture} alt="icon"/>
                    <div className={`upload-image-text ${url?"d-none":""}`}>{text}</div>
                    <input ref={inputRef} type="file" className="d-none" accept="image/*"
                        onChange={e => {
                            uploadFiles(e.target.files);
                        }}
                    />
                </div>
            </VerticalCenter>
        </div>
    )
}