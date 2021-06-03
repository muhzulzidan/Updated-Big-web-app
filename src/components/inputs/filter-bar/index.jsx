import "./style.css";
import search from "../../../assets/svgs/search.svg";
import Select from "../select";
import TextInput from "../text-input";

export default function FilterBar({children, filter, setFilter, className=undefined}) {
    return (
        <div className={`filter-bar-container ${className?className:""}`}>
            <Select value={filter.type} setValue={(val) => setFilter({...filter, type: val})} placeholder="All">
                {children}
            </Select>
            <TextInput value={filter.value} setValue={(val) => setFilter({...filter, value: val})} placeholder="Search"/>
            <img src={search} alt="search" />
        </div>
    )
}