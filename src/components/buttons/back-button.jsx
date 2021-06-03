import React from "react";
import Button from "./button";
import { useHistory } from "react-router";
import arrow from "../../assets/svgs/back-arrow.svg";

export default function BackButton({url}) {
	const history = useHistory();

    return (
        <Button outline={true} onClick={() => {
            history.push(url);
        }}>
            <img className="mr-4" src={arrow} alt="arrow" />
            Back
        </Button>
    );
}