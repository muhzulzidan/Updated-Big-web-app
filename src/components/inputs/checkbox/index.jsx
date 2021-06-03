import './style.css';

export default function Checkbox({text, value, setValue}) {
    return (
        <label className="custom-checkbox-label">
            {text}
            <input type="checkbox" checked={value} onChange={(e) => setValue(e.target.checked)} />
            <span className="custom-checkbox-checkmark"></span>
        </label>
    )
}