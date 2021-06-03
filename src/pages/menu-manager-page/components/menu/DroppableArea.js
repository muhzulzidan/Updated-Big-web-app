import React, { useState, useContext } from "react";
import { useDrop, useDrag } from "react-dnd";
import axios from "axios";
import { getCompanyId } from "../utils/helpers";
import { getToken } from "../utils/helpers";
import { MainMenuContext } from "./MainMenu";
import Modal from "../modal/Modal";
import CategoryForm from "./models/CategoryForm";
import ItemForm from "./models/ItemForm";
import GroupForm from "./models/GroupForm";
import IngredientForm from "./models/IngredientForm";

import upload from "../../assets/icons/upload.svg";
import upload_green from "../../assets/icons/upload_green.svg";
import burger from "../../assets/burger.png";

function DroppableArea({ elem, accept }) {
  const [updateMsg, setUpdateMsg] = useState(false);
  const [modal, setModal] = useState(false);
  const { data, setData, toUpdated, setToUpdated, setIsDragging } = useContext(
    MainMenuContext
  );
  const { id, name, type, image_url, children } = elem;
  const isMoreFour = children?.length > 4;

  const [, drop] = useDrop({
    accept: [...accept, "CHILD"],
    canDrop: item => {
      if (item.type === "CHILD") {
        if (type === "category") {
          if (item.typeChild === "item") return true;
        } else if (type === "item") {
          if (["group", "ingredient"].includes(item.typeChild)) return true;
        } else if (type === "group") {
          if (["group", "ingredient", "item"].includes(item.typeChild))
            return true;
        }
      } else {
        return true;
      }
    },
    drop: () => {
      return { dropId: id, type };
    }
  });

  const [, drag] = useDrag({
    item: { id, name, type },
    begin: () => {
      setIsDragging(true);
    },
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        const dropRes = monitor.getDropResult();

        if (id === dropRes.dropId) {
          setIsDragging(false);
          return;
        }

        if (type === "group" || type === "item") {
          if (elem.children?.map(({ id }) => id).includes(dropRes.dropId)) {
            setIsDragging(false);
            return;
          }
        }

        if (dropRes.dropId) {
          const isDup = data[dropRes.type]
            .find(({ id }) => id === dropRes.dropId)
            .children?.find(({ id }) => id === elem.id);

          if (isDup) {
            setIsDragging(false);
            return;
          }

          const newItems = data[dropRes.type].map(item => {
            if (item.id === dropRes.dropId) {
              const children = item.children
                ? [...item.children, elem]
                : [elem];

              return { ...item, children };
            } else {
              return item;
            }
          });

          setToUpdated([...toUpdated, dropRes.dropId]);

          setData({
            ...data,
            [dropRes.type]: newItems
          });
        } else {
          const newItems = data[elem.type].filter(({ id }) => {
            return id !== elem.id;
          });

          axios
            .delete(
              `http://www.mocky.io/v2/5e47f570300000e539294a2a/delete/menu/${
                getCompanyId().company_id
              }/${elem.id}`,
              {
                headers: {
                  Authorization: getToken()
                }
              }
            )
            .then(() => {
              setData({
                ...data,
                [elem.type]: newItems
              });
            });
        }
      }

      setIsDragging(false);
    }
  });

  function update() {
    const newElem = { ...elem };

    if (newElem.children) {
      const child_id = newElem.children.map(({ id }) => id);
      child_id.length && (newElem.child_id = child_id);
    }
    delete newElem.children;

    axios
      .post("http://www.mocky.io/v2/5e41ea762f00005200583793/save", newElem, {
        headers: {
          Authorization: getToken()
        }
      })
      .then(() => {
        const newToUpdated = toUpdated.filter(i => i !== id);

        setToUpdated(newToUpdated);
        setUpdateMsg(`“your ${type} has been updated!”`);
        setTimeout(() => setUpdateMsg(false), 3000);
      })
      .catch(error => {
        setUpdateMsg(error.response.status);
        setTimeout(() => setUpdateMsg(false), 3000);
      });
  }

  function renderChildren() {
    return children?.map(child => {
      return (
        <Child
          key={child.id}
          elem={child}
          isMoreFour={isMoreFour}
          data={data}
          setData={setData}
          parent={elem}
          toUpdated={toUpdated}
          setToUpdated={setToUpdated}
          setIsDragging={setIsDragging}
        />
      );
    });
  }

  function getPlaceholder() {
    switch (type) {
      case "category":
        return "Item";
      case "group":
        return "Item/Group/Ingredient";

      case "item":
        return "Group/Ingredient";

      default:
        break;
    }
  }

  return (
    <div>
      {type === "ingredient" ? (
        <div
          className="drop-source drop-source-ingred"
          ref={drag}
          onClick={() => setModal("ingredient")}
        >
          <div
            data-tooltip={elem.name}
            className={`drop-area-elem`}
            key={elem.id}
          >
            <img className="drop-image" src={elem.image_url ?? burger} alt="" />
            <p>{elem.name}</p>
          </div>
        </div>
      ) : (
        <div className="drop-source">
          <div className="drop-title" ref={drag} onClick={() => setModal(type)}>
            <p>{name}</p>
            <img className="drop-title-img" src={image_url ?? burger} alt="" />
          </div>
          <div className={`${isMoreFour && "drop-area-grid"}`}>
            {renderChildren()}
          </div>
          <div className="drop-area" ref={drop}>
            <p>Drag & Drop</p>
            <p>{getPlaceholder()}</p>
          </div>
          <p className="drop-upload" onClick={update}>
            <img src={toUpdated.includes(id) ? upload_green : upload} alt="" />
          </p>

          <p
            className={`drop-update-msg ${!updateMsg &&
              "drop-update-msg-hide"}`}
          >
            {updateMsg}
          </p>
        </div>
      )}

      {modal === "category" && (
        <Modal>
          <CategoryForm editElem={elem} close={() => setModal(false)} />
        </Modal>
      )}

      {modal === "item" && (
        <Modal>
          <ItemForm editElem={elem} close={() => setModal(false)} />
        </Modal>
      )}

      {modal === "group" && (
        <Modal>
          <GroupForm editElem={elem} close={() => setModal(false)} />
        </Modal>
      )}

      {modal === "ingredient" && (
        <Modal>
          <IngredientForm editElem={elem} close={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}

function Child({
  elem,
  isMoreFour,
  data,
  setData,
  parent,
  toUpdated,
  setToUpdated,
  setIsDragging
}) {
  const { id, name, type, image_url } = elem;

  const [, drag, preview] = useDrag({
    item: { id, name, type: "CHILD", typeChild: type },
    begin: () => {
      setIsDragging(true);
    },
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        const dropRes = monitor.getDropResult();

        if (id === dropRes.dropId) {
          setIsDragging(false);
          return;
        }

        if (type === "group" || type === "item") {
          if (elem.children?.map(({ id }) => id).includes(dropRes.dropId)) {
            setIsDragging(false);
            return;
          }
        }

        if (dropRes.dropId) {
          const isDup = data[dropRes.type]
            .find(({ id }) => id === dropRes.dropId)
            .children?.find(({ id }) => id === elem.id);

          if (isDup) {
            setIsDragging(false);
            return;
          }

          const newItems = data[dropRes.type].map(item => {
            if (item.id === dropRes.dropId) {
              const children = item.children
                ? [...item.children, elem]
                : [elem];

              return { ...item, children };
            } else {
              return item;
            }
          });

          setToUpdated([...toUpdated, dropRes.dropId]);

          setData({
            ...data,
            [dropRes.type]: newItems
          });
        } else {
          const newItems = data[parent.type].map(item => {
            if (item.id === parent.id) {
              const children = item.children.filter(({ id }) => id !== elem.id);

              return { ...item, children };
            } else {
              return item;
            }
          });

          // console.log(toUpdated);
          setToUpdated([...toUpdated, parent.id]);
          setData({ ...data, [parent.type]: newItems });
        }
      }

      setIsDragging(false);
    }
  });

  return (
    <div>
      <div
        ref={drag}
        data-tooltip={name}
        className={`${!isMoreFour ? "drop-area-elem" : "drop-area-tooltip"}`}
      >
        <img
          ref={preview}
          className="drop-image"
          src={image_url ?? burger}
          alt=""
        />
        {!isMoreFour && <p>{name}</p>}
      </div>
    </div>
  );
}
export default DroppableArea;
