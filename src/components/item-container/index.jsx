import "./style.css";

export default function ItemContainer({layout, className="", children}) {
    return (
        <div className={`item-container shrink-on-mobile ${layout === "grid"?"item-container-grid":"item-container-list"} ${className}`}>
            <div className="item-container-wrapper">
                {children}
            </div>
        </div>
    )
}