import React, { useRef } from "react";
import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// import ButtonBase from "@material-ui/core/ButtonBase";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHandleOnClickOutside } from "./utils";
import SettingsIcon from "./icons/settings.svg";
import { IconButton } from "./IconButton";

const styles = {
  root: {
    height: 38,
    fontWeight: 800,
  },

  selected: {
    background: "#001D53",
    color: "white",
  },
  outlined: {
    color: "#001D53",
    border: "1px solid #001D53",
  },

  title: {
    color: "#021A53",
  },
};

const SettingsPanel = ({
  classes,
  onClose,
  isLoading,
}) => {
  // const VariantButton = ({ selected, children, position, ...rest }) => {
  //   return (
  //     <ButtonBase
  //       {...rest}
  //       style={{
  //         borderRadius:
  //           position === "left"
  //             ? "50px 0 0 50px"
  //             : position === "right"
  //             ? "0 50px 50px 0"
  //             : 0,
  //       }}
  //       className={`${classes.root} ${
  //         selected ? classes.selected : classes.outlined
  //       } col text-uppercase`}
  //     >
  //       {children}
  //     </ButtonBase>
  //   );
  // };
  const pageRef = useRef(null);
  const controlsRef = useRef(null);

  useHandleOnClickOutside({
    ref: pageRef,
    onClick: () => onClose(),
    disabledRefs: [controlsRef],
  });

  return (
    <div ref={pageRef} style={{ fontWeight: 700 }}>
      <div className="py-4 mb-4">
        <div className="d-flex align-items-center" style={{ height: 59 }}>
          <IconButton
            icon={SettingsIcon}
            spin={isLoading}
            onClick={onClose}
            size="2x"
            title="Settings"
            alt="settings"
          />
          <Box width={8} />
          <div
            style={{ fontSize: 30, fontWeight: 500 }}
            className={classes.title}
          >
            Settings
          </div>
        </div>
      </div>
      <div ref={controlsRef}>
        <div>TIME FORMAT</div>
        <div className="d-flex mb-4">
          sss
        </div>

        <div>WEEK START</div>
        <div className="d-flex mb-4">
          ddd
        </div>

        <div>TIME INTERVAL</div>
        <div className="d-flex">
          fff
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(SettingsPanel);
