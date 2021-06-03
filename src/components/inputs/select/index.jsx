import "./style.css";
import arrow from "../../../assets/svgs/arrow-down.svg";
import { useEffect, useRef, useState } from "react";


export default function Select({
	children,
	value,
	setValue,
	icon=undefined,
	placeholder=undefined,
	className=undefined,
	...rest
}) {
	// @ts-ignore
	const [dropdown, setDropdown] = useState(false);
	const [map, setMap] = useState({});
	const ref = useRef();
	const dropDownRef = useRef();
	
	useEffect(() => {
		const newMap = {};
		children.forEach(child => {newMap[child.props.value] = child.props.children});
		setMap(newMap)
	}, [children])

	const showDropDown = function(rect) {
		if(dropDownRef.current) {
			setDropdown(true);
			const dropdownContainerEl = dropDownRef.current;
			const topSpace = rect.top;
			const bottomSpace = window.innerHeight - rect.bottom;
			dropdownContainerEl.style.height = "auto";
			if(topSpace > bottomSpace) {
				dropdownContainerEl.style.bottom = "calc(100% + 1px)";
				dropdownContainerEl.style.top = "unset";
				dropdownContainerEl.style.maxHeight = (topSpace - 10) + "px";
			} else {
				dropdownContainerEl.style.bottom = "unset";
				dropdownContainerEl.style.top = "calc(100% + 1px)";
				dropdownContainerEl.style.maxHeight = (bottomSpace - 10) + "px";
			}
		}
	}

	const hideDorpdown = function() {
		if(dropDownRef.current) {
			setDropdown(false);
			const dropdownContainerEl = dropDownRef.current;
			dropdownContainerEl.style.height = "0";
		}
	}

	return (
		<div ref={ref} className={`select-container ${className?className:""}`}
			onClick={() => {
				if(ref.current && !dropdown) {
					// @ts-ignore
					showDropDown(ref.current.getBoundingClientRect());
				} else {
					hideDorpdown();
				}
			}} 
			{...rest}
		>
			{icon ? <img src={icon} alt="" /> : undefined}

			<div className={`select-value${value===undefined&&placeholder!==undefined?" placeholder":""}`}>
				{value!==undefined?map[value]:placeholder}
			</div>

			<img src={arrow} className={`select-arrow ${dropdown?"select-arrow-flip":""}`} alt="arrow" />

			<div ref={dropDownRef} className="select-dropdown">

				{children.map((child, index) => {
					if(child.type !== "option") throw Error("Only option tags are allowed under Select");
					return (
						<div 
							className={` select-option${value===child.props.value?" active":""}`}
							key={`${index}-${child.props.value}`}
							onClick={(e) => {
								e.stopPropagation();
								setValue(child.props.value);
								hideDorpdown();
							}}
						>
							{child.props.children}
						</div>
					)
				})}

			</div>
		</div>
	);
}
