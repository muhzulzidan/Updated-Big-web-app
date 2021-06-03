import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, IconButton, Box } from "@material-ui/core";
import React from "react";

function IconButtonBase({
  icon,
  onClick,
  title,
  alt,
  isActive = false,
  isDisabled = false,
  isLoading = false,
  type = "img",
  showTooltip,
}) {
  const iconColor = isDisabled ? "#cacaca" : isActive ? "#f65e02" : "#2d2d61";

  function handleImage() {
    switch (type) {
      case "fontAwesome": {
        return (
          <FontAwesomeIcon
            color={iconColor}
            size="sm"
            spin={isLoading}
            icon={isLoading ? faCircleNotch : icon}
            cursor={isDisabled ? "not-allowed" : "pointer"}
            alt={alt}
          />
        );
      }
      default:
      case "img": {
        return (
          <img
            alt={alt}
            src={icon}
            style={{
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              if (!isDisabled && !isLoading) onClick();
            }}
          />
        );
      }
      case "materialSVG": {
        const MaterialIcon = icon;

        return (
          <MaterialIcon
            style={{
              cursor: isDisabled ? "not-allowed" : "pointer",
              color: iconColor,
            }}
            fontSize="large"
          />
        );
      }
    }
  }

  return (
    <Tooltip title={title} open={showTooltip ? true : undefined}>
      <IconButton
        size="medium"
        isActive={isActive}
        isDisabled={isDisabled || isLoading}
        onClick={() => {
          if (!isDisabled && !isLoading) onClick();
        }}
        className={`icon-btn ${isActive && "icon-btn-active"}`}
      >
        <Box
          display="flex"
          width={24}
          height={24}
          alignItems="center"
          justifyContent="center"
        >
          {handleImage()}
        </Box>
      </IconButton>
    </Tooltip>
  );
}

export { IconButtonBase as IconButton };
