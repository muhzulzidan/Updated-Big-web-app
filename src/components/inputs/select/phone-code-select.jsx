import Select from ".";
import codes from "./CountryCodes.json";
import flags from "../../../assets/flags";

export default function PhoneCodeSelect({value, setValue, ...rest}) {
    return (
        <Select value={value} setValue={setValue} placeholder="+#" {...rest}>
            {codes.map(code => {
                return (
                    <option key={code.dial_code} value={code.dial_code}>
                        <img className="mr-3" src={flags[code.code]} alt="code.code" />
                        {code.dial_code}
                    </option>
                )
            })}
        </Select>
    );
}