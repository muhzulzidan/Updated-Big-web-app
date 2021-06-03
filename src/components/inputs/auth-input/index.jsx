import "./style.css";

import eye from '../../../assets/svgs/eye.svg';
import { useState } from "react";

export default function AuthInput({placeholder, onChange, value, isPassword, error, name}) {

    const [showPassword, setShowPassword] = useState(false);

	return (
		<div className={`auth-input-container${error?" auth-input-container-error":""}`}>
			<input
				className="auth-input"
				placeholder={placeholder}
                onChange={onChange}
                value={value}
				name={name}
                type={(isPassword && !showPassword)?"password":"text"}
			></input>
            {
                isPassword?<img className="auth-input-show-btn" src={eye} alt="eye" onClick={() => {setShowPassword(!showPassword)}}/>:""
            }
		</div>
	);
}
