import "./style.css";

export default function Button({
	children,
    onClick=undefined,
	className = "",
	outline = false,
	color = "white",
	background = "var(--blue-1)",
	style=undefined,
	...rest
}) {
	return (
		<button
			className={`button ${outline ? "outline" : ""} ${className}`}
            onClick={onClick}
			style={{
				color: outline ? background : color,
				background: background,
				borderColor: background,
				...style
			}}
		>
			{children}
		</button>
	);
}
