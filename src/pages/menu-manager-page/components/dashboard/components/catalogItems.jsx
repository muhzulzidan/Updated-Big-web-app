import "./style.css";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { Link  } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";

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



export default function CatalogItems( {location, history, title, children, visible, setVisibility, props }) {
    const [show, setShow] = useState(visible?true:false);
    
    const { path } = useRouteMatch();

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

    // console.log(props.showing)

    // const location =  {
    //     pathname: types,
    //     state: { fromDashboard: true }
    //   }

    // const handleClick = (type) => {
    //     setActive(type)

    //     console.log(type);

    //     history.push(location);
    //     history.replace(location);

    //     console.log(location);
    //   }
    
        // console.log(visible);

    return (
        <div 
        style={visible?{display:"flex"}:{display:"none"}}
        className={`catalog-container`} 
        // className={`catalog-container${visible?"":" hidden"}`} 
        >
            <div className="catalog-items">
                <ButtonGroup>
                    {types.map(type => (
                        <Link to={`/store-manager-page/${type.slug}`} >
                            {/* {console.log(`/dashboard/${type.slug}`)} */}

                            <ButtonToggle
                            key={type}
                            active={active === type}
                            // onClick={handleClick} 
                            onClick={() =>  {
                                setActive(type)
                            } } 
                            > 
                            
                                {type.name}
                                <p>
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