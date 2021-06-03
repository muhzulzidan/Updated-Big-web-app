import "./style.css";

export default function TextInput({
	value,
	setValue,
	type = "text",
	placeholder = undefined,
	prefix = undefined,
	suffix = undefined,
	className = undefined,
	onClick = undefined,
	style = undefined,
	...rest
}) {
	return (
		<div className={`text-input-container ${className ? className : ""}`} style={style}>
			{
                prefix ?
                <div className="text-input-prefix">
                    {prefix}
                </div> : undefined
            }
			<input
				type={type}
				className={`text-input`}
                value={value}
                onChange={(e) => {setValue(e.target.value)}}
                placeholder={placeholder}
				onClick={onClick}
                {...rest}
			/>
            {
                suffix ?
                <div className="text-input-suffix">
                    {suffix}
                </div> : undefined
            }
		</div>
	);
}
