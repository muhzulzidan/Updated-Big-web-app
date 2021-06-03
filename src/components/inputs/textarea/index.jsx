import "./style.css";

export default function Textarea({
    value,
    setValue,
	className="",
	icon = undefined,
	placeholder = undefined,
    style = undefined,
    ...rest
}) {
	return (
		<div className={`textarea-container ${className ? className : ""}`} style={style}>
			{icon ? <img src={icon} alt="" /> : undefined}
            <textarea placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} {...rest}></textarea>
		</div>
	);
}
