import React from "react";
import Button from "./button";
import { useHistory } from "react-router";
import arrow from "../../assets/svgs/arrow.svg";

export default function NextButton({url}) {
	const history = useHistory();

    return (
        <Button onClick={() => {
            history.push(url);
        }}>
            Next
            <img className="ml-4" src={arrow} alt="arrow" />
        </Button>
    );
}