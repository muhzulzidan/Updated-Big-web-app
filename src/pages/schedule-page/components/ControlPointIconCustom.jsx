import React from "react";
import PropTypes from "prop-types";
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import { withStyles } from "@material-ui/core/styles";


const styles = {
    root: {
        // borderColor: "#2d2d61",
        // textTransform: "none",
        // borderRadius: 30,
        color: "#2d2d61",
        fontSize: "calc(1.8em + 1vw)",
        // padding: "0px 20px",
        "&:hover": {
            cursor: "pointer",
            // backgroundColor: "#2d2d61",
            // color: "white",
            // boxShadow: "none",
            borderRadius: 30,
        },
        // "&:active": {
        //     backgroundColor: "#2d2d61",
        //     border: "1px solid #2d2d61",
        // },
    },
};

const CustomControlPointIcon = (props) => {
    const { classes, children, onClick, style } = props;
    return (
        <ControlPointIcon variant="outlined" className={classes.root} onClick={onClick} style={style}>
            {children}
        </ControlPointIcon>
    );
};

CustomControlPointIcon.propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    children: PropTypes.string.isRequired,
};

export default withStyles(styles)(CustomControlPointIcon);
