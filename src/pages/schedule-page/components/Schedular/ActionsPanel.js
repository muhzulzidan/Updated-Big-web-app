import React from "react";
import { IconButton } from "../IconButton";
import CheckmarkIcon from "./icons/checkmark.svg";
import CopyIcon from "./icons/copy.svg";
import InfoIcon from "./icons/info.svg";
import MergeIcon from "./icons/merge.svg";
import MoveIcon from "./icons/move.svg";
import RemoveIcon from "./icons/remove.svg";
import SettingsIcon from "./icons/settings.svg";
import UnmergeIcon from "./icons/unmerge.svg";
import DeleteIcon from "./icons/delete.svg";
import CutIcon from "./icons/scissors.svg";

const ActionsPanel = ({
  selectedItemsLength,
  activeButton,
  setActiveButton,
  handleSelectAll,
  handleUnselectAll,
  handleDelete,
  setJoinAdjacent,
  joinAdjacent,
  additionalControls = [],
}) => {
  return (
    <div
      className="d-flex user-select-none align-items-center"
      style={{ height: 59 }}
    >
      <div
        className="d-flex align-items-center"
        style={{ opacity: selectedItemsLength ? 1 : 0 }}
      >
             <div className="mr-1">
          {selectedItemsLength && (
            <IconButton
              icon={RemoveIcon}
              onClick={() => {
                handleUnselectAll();
                setActiveButton("unselect");
              }}
              title="Deselect"
              alt="deselect"
            />
          )}
        </div>
        <div className="mr-1">
          {selectedItemsLength && (
            <IconButton
              icon={DeleteIcon}
              onClick={() => {
                handleDelete();
                setActiveButton("remove");
              }}
              title="Delete"
              alt="delete"
            />
          )}
        </div>
 
        <div className="mr-1">
          {selectedItemsLength && (
            <IconButton
              icon={CopyIcon}
              onClick={() =>
                setActiveButton(activeButton === "copy" ? "" : "copy")
              }
              title="Copy"
              alt="copy"
              isActive={activeButton === "copy"}
            />
          )}
        </div>
        <div className="pr-3 mr-1" style={{ borderRight: "2px solid #021A53" }}>
          {selectedItemsLength && (
            <IconButton
              icon={MoveIcon}
              onClick={() =>
                setActiveButton(activeButton === "move" ? "" : "move")
              }
              title="Move"
              alt="move"
              isActive={activeButton === "move"}
            />
          )}
        </div>
      </div>
      {!joinAdjacent ? (
        <div className="mr-1">
          <IconButton
            icon={MergeIcon}
            onClick={() => {
              setJoinAdjacent(true);
              handleUnselectAll();
            }}
            title="Merge"
            alt="merge"
          />
        </div>
      ) : (
        <div className="mr-1">
          <IconButton
            icon={UnmergeIcon}
            onClick={() => {
              setJoinAdjacent(false);
              handleUnselectAll();
            }}
            title="Unmerge"
            alt="unmerge"
          />
        </div>
      )}
      <div className="mr-1">
        <IconButton
          icon={CutIcon}
          onClick={() => {
            setActiveButton((prev) => (prev === "cut" ? "" : "cut"));
          }}
          title="Cut"
          alt="cut"
        />
      </div>

      <div className="mr-1">
        <IconButton
          icon={CheckmarkIcon}
          onClick={() => {
            handleSelectAll();
            setActiveButton("checkmark");
          }}
          title="Select All"
          alt="select all"
        />
      </div>
      {activeButton !== "info" && (
        <div className="mr-1">
          <IconButton
            icon={InfoIcon}
            onClick={() => setActiveButton("info")}
            title="Info"
            alt="info"
          />
        </div>
      )}
      {activeButton !== "settings" && (
        <div className="mr-1">
          <IconButton
            icon={SettingsIcon}
            onClick={() => setActiveButton("settings")}
            title="Settings"
            alt="settings"
          />
        </div>
      )}
      {additionalControls.map((control, index) => (
        <div className="mr-1">
          <IconButton
            icon={control.icon}
            onClick={control.onClick}
            title={control.title}
            alt={control.alt}
            isActive={control.isActive}
            isDisabled={control.isDisabled}
            isLoading={control.isLoading}
            type={control.type}
            showTooltip={control.showTooltip}
          />
        </div>
      ))}
    </div>
  );
};

export default ActionsPanel;
