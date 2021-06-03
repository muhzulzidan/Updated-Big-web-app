import "./style.css";

import React, { useEffect, useState } from "react";

import { ReactComponent as Catalogcheck } from "../../../assets/catalogcheck.svg";
import { ReactComponent as Edit } from "../../../assets/edit2.svg";
import { ReactComponent as Folder } from "../../../assets/folder.svg";
import { ReactComponent as Check } from "../../../assets/check.svg";
import { ReactComponent as Fullscreen } from "../../../assets/fullscreen.svg";
// import industryIcon from "../../../../../assets/svgs/industry.svg";

import TextInput from "../../../../../components/inputs/text-input";
import Select from "../../../../../components/inputs/select";
import ImageUpload from "../../../../../components/inputs/image-upload";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

import AddProduct from "./addProduct"

import "./create-mode.css"


import { BrowserRouter, Switch as Sw, Route, Link } from "react-router-dom";


// import arrow from "../../../../../assets/svgs/arrow.svg";
import Burger from '../../../assets/burger2.png';

import { ReactComponent as Clip } from "../../../assets/clip.svg"
import { ReactComponent as ClipG } from "../../../assets/clip-green.svg"

import products from "../array/products"
import "./product-details.css"

import styled from 'styled-components';

const Button = styled.button`
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;

    background: #FFFFFF;

    font-weight: 700;

    padding: 1em;
    margin-bottom: 1em;

    border-radius: 20px;
`;

const ButtonToggle = styled(Button)`
    border: 1px solid lightgray;
  ${({ active }) =>
        active &&
        `
    border: 1px solid #00CF7B;
  `}
`;


export default function Catalog({ title, children, visible, setVisibility, props }) {

    const [showSidePanel, setShowSidePanel] = useState(false);
    // const [showDetail, setShowDetail] = useState(false);
    const [product, setproduct] = useState({});
    const [tempProduct, setTempProduct] = useState({});

    const [selected, setSelected] = useState(false);
    const [active, setActive] = useState(products[null]);
    const [shrink, setShrink] = useState(false);

    const useStyles = makeStyles({
        root: {

        },
        label: {
            fontSize: "calc(23px + 1vw)",
            paddingRight: "9em",
            color: "var(--blue-1)",
            fontWeight: "600",
        },
    });

    const classes = useStyles();
    const IOSSwitch = withStyles((theme) => ({
        root: {
            width: 65,
            height: 35,
            padding: 0,
            margin: theme.spacing(1),
            display: "flex",
            justifyContent: "space-between"
        },
        switchBase: {
            color: "#C4C4C4",
            padding: 1,
            '&$checked': {
                transform: 'translateX(32px)',
                color: "#C4C4C4",
                '& + $track': {
                    backgroundColor: '#959595',
                    opacity: 1,
                    border: 'none',
                },
            },
            '&$focusVisible $thumb': {
                color: '#001d53',
                border: '6px solid #C4C4C4',
            },
        },
        thumb: {
            width: 32,
            height: 32,
            color: "var(--blue-1)",
        },
        track: {
            borderRadius: 32 / 2,
            border: `1px solid ${theme.palette.grey[400]}`,
            backgroundColor: theme.palette.grey[50],
            opacity: 1,
            transition: theme.transitions.create(['background-color', 'border']),
        },
        checked: {},
        focusVisible: {},
    }))(({ classes, ...props }) => {
        return (
            <Switch
                focusVisibleClassName={classes.focusVisible}
                disableRipple
                classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                }}
                size="medium"
                {...props}
            />
        );
    });

    const [state, setState] = React.useState({
        Active: false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const saveMenu = () => {

        //hide panel
        setShowSidePanel(false);
    };

    //   const openDetail = () => {

    //     if (!showDetail){
    //         setShowDetail(true)
    //     }else {
    //         setShowDetail(false) 
    //     }
    //   }

    // console.log(props.detail)

    return (
        // <BrowserRouter>
        <div className={`catalog`}
            style={{
                display: "flex",
                overflow: "hidden"
            }}
        >
            <div className="side-panel" style={{
                position: "relative",
                // display: "flex",
            }}>
                <div className="side-panel-status-bar ">
                    <div className="create-catalog-container">
                        <Link to="/store-manager-page/create-mode"
                        style={{
                            color:"inherit"
                        }}
                        >
                            <div className="create-catalog">
                                <button onClick={() => setShowSidePanel(true)}>
                                    Create Mode
                                </button>
                            </div>
                        </Link>
                        <button>
                            <Catalogcheck className="catalog-check" />
                        </button>
                        <button>
                            <Folder className="folder" />
                        </button>
                        <button>
                            <Check className="check" />
                        </button>
                        <button

                        // onClick={openDetail}

                        >
                            <Fullscreen className="fullscreen" />
                        </button>
                    </div>
                    <div className="side-panel-title">
                        {title}
                    </div>
                </div>
                {/* {children} */}
                <div className="hr" />
                <div className=" flex-grow-1 d-flex flex-column pt-5">
                    <ul className="product">
                        {products.map(product => (
                            // <ConditionalLink to={`${selected ? "/product-detail" : "catalog-a"}`} condition={selected}>
                            <li key={product.id} className={`startupcard ${product.green ? "" : "startupcard-green"} ${selected ? "selected" : " "} `}>
                                <ButtonToggle
                                    active={active === product}
                                    onClick={() => {
                                        setActive(product);
                                        !selected ? setSelected(true) : setSelected(false);
                                        setShrink(!shrink);
                                    }}

                                    // {...console.log(product)}

                                    className="product-button">
                                    <img src={Burger} alt="" className="startupcard-image " />
                                    <div className="details">
                                        <h3>{product.name}</h3>
                                        <p>{product.detail}</p>
                                    </div>
                                    {product.green ? <ClipG className="clip-svg" /> : <Clip className="clip-svg" />}

                                </ButtonToggle>
                            </li>
                            // </ConditionalLink>
                        ))}
                    </ul>
                </div>
                <div className="side-panel-title"
                style={{
                    padding: "1em",
                    paddingBottom: ".2em",
                }}
                >
                        {title}
                </div>
                <div className="hr" />
                <div className=" flex-grow-1 d-flex flex-column pt-5">
                    <ul className="product">
                        {products.map(product => (
                            // <ConditionalLink to={`${selected ? "/product-detail" : "catalog-a"}`} condition={selected}>
                            <li key={product.id} className={`startupcard ${product.green ? "" : "startupcard-green"} ${selected ? "selected" : " "} `}>
                                <ButtonToggle
                                    active={active === product}
                                    onClick={() => {
                                        setActive(product);
                                        !selected ? setSelected(true) : setSelected(false);
                                        setShrink(!shrink);
                                    }}

                                    // {...console.log(product)}

                                    className="product-button">
                                    <img src={Burger} alt="" className="startupcard-image " />
                                    <div className="details">
                                        <h3>{product.name}</h3>
                                        <p>{product.detail}</p>
                                    </div>
                                    {product.green ? <ClipG className="clip-svg" /> : <Clip className="clip-svg" />}

                                </ButtonToggle>
                            </li>
                            // </ConditionalLink>
                        ))}
                    </ul>
                </div>


            </div>
            <div
                style={
                    selected ? { transform: "translateX(0%)", display: "flex", transition: "all 300ms",width: "fit-content" } : { transform: "translateX(100%)", transition: "all 300ms", display: "none",}
                }
            >
                <div className="product-details-container">
                    <div className="product-details-icon">
                        <button>
                            <Catalogcheck className="catalog-check" />
                        </button>
                        <button>
                            <Folder className="folder" />
                        </button>
                        <button>
                            <Edit className="edit" />
                        </button>
                    </div>
                    <div className="product-head">
                        <h3>
                            Product Name
                        </h3>
                        <h3>
                            SR 45.00
                        </h3>
                    </div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim quibusdam perspiciatis aut modi cumque quis ipsam quia ipsum magni itaque tempore vel adipisci nostrum, quod, dolores maxime. Pariatur, dolorem itaque.</p>
                        <br />
                            <p>Images</p>
                        <hr />
                            <img src={Burger} alt="" className="startupcard-image " />
                            <p>Items</p>
                        <hr />
                            <img src={Burger} alt="" className="startupcard-image " />
                </div>
            </div>

        </div>
        // </BrowserRouter> 
    );
}