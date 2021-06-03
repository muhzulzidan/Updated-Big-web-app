// import React, { useEffect, useState } from "react";

// import { BrowserRouter, Switch as Sw, Route, Link } from "react-router-dom";


// // import arrow from "../../../../../assets/svgs/arrow.svg";
// import Burger from '../../../assets/burger2.png';

// import { ReactComponent as Clip } from "../../../assets/clip.svg"
// import { ReactComponent as ClipG } from "../../../assets/clip-green.svg"

// import products from "../array/products"
// import "./product-details.css"

// import styled from 'styled-components';

// const Button = styled.button`
//     display: flex;
//     flex-direction: column;
//     position: relative;
//     align-items: center;

//     background: #FFFFFF;

//     font-weight: 700;

//     padding: 1em;
//     margin-bottom: 1em;

//     border-radius: 20px;
// `;

// const ButtonToggle = styled(Button)`
//     border: 1px solid lightgray;
//   ${({ active }) =>
//         active &&
//         `
//     border: 1px solid #00CF7B;
//   `}
// `;


// const Product = (showDetail) => {
//     const [selected, setSelected] = useState(false);
//     const [active, setActive] = useState(products[null]);

//     const [shrink, setShrink] = useState(false);
    
//     console.log(showDetail)

//     // const ConditionalLink = ({ children, to, condition }) => (!!condition && to)
//     //     ? <Link style={{
//     //         color: "var(--blue-1)",
//     //     }} to={to}>{children}</Link>
//     //     : <Link style={{
//     //         color: "var(--blue-1)",
//     //     }} to={to}>{children}</Link>;

//     // console.log(shrink)

    
//     return (

//         <ul className="product">
//             {products.map(product => (
//                 // <ConditionalLink to={`${selected ? "/product-detail" : "catalog-a"}`} condition={selected}>
//                     <li key={product.id} className={`startupcard ${product.green ? "" : "startupcard-green"} ${selected ? "selected" : " "} `}>
//                         <ButtonToggle
//                             active={active === product}
//                             onClick={() => {
//                                 setActive(product);
//                                 !selected ? setSelected(true) : setSelected(false);
//                                 setShrink(!shrink);
//                             }}

//                             // {...console.log(selected)}

//                             className="product-button">
//                             <img src={Burger} alt="" className="startupcard-image " />
//                             <div className="details">
//                                 <h3>{product.name}</h3>
//                                 <p>{product.detail}</p>
//                             </div>
//                             {product.green ? <ClipG className="clip-svg" /> : <Clip className="clip-svg" />}

//                         </ButtonToggle>
//                     </li>
//                 // </ConditionalLink>
//             ))}
//         </ul>
//     )
// }

// export default Product