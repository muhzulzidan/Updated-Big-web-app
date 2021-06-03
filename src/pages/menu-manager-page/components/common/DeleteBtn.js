import React from "react";
import { useDrop } from "react-dnd";
import bin from "../../assets/red_bin.svg";

function DeleteBtn() {
  const [, drop] = useDrop({
    accept: ["CHILD", "item", "group", "ingredient", "category"]
  });

  return (
    <div className="delete" ref={drop}>
      <img src={bin} alt="" />
    </div>
  );
}

export default DeleteBtn;
