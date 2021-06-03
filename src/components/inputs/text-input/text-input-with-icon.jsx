import TextInput from ".";

export default function TextInputWithIcon({icon, value, setValue, ...rest}) {
    return <TextInput prefix={<img src={icon} alt=""/>} value={value} setValue={setValue} {...rest}/>
}