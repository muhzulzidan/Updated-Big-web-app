import "./style.css";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { Link  } from "react-router-dom";

import types from "../array/catalogItems"

const Button = styled.button`
    display: flex;
    flex-direction: column;

    background: #FFFFFF;

    font-weight: 700;

    padding: 1em;
    margin-bottom: 1em;

    width: 100%;
`;

const ButtonToggle = styled(Button)`
    border-radius: 5%;
    border: 1px solid lightgray;
  ${({ active }) =>
    active &&
    `
    border: 1px solid #00CF7B;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

// console.log("inventory")

export default function InventoryItems( {location, history, title, children, visible, setVisibility, props }) {
    const [show, setShow] = useState(visible?true:false);
    
    useEffect(() => {
        if(visible) {
            setShow(true);
        } else {
            const timeout = setTimeout(() => {
                setShow(false);
            }, 500)
            return () => {clearTimeout(timeout)};
        }
    }, [visible])

    const [active, setActive] = useState(types[0]);


    return (
        <div 
        style={visible?{display:"flex"}:{display:"none"}}
        className={`catalog-container${visible?"":" hidden"}`
        } 
        >
            <div className="catalog-items">
                <ButtonGroup>
                    {types.map(type => (
                        <Link to={`/store-manager-page/${type.slug}`} >
                            <ButtonToggle
                            key={type}
                            active={active === type}
                            // onClick={handleClick} 
                            onClick={() =>  {
                                setActive(type)
                            }} 
                            >                           
                                {type.name}
                                <p>
                                    {/* {active === type?<p>Published</p>:<p>Unpublished</p>} */}
                                    Unpublished                                    
                                </p>

                            </ButtonToggle>
                        </Link>
                    ))}
                </ButtonGroup>            
            </div>
        </div>
    );
}