import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useDrag } from "react-dnd";
import Select from "react-select";
import burger from "../../assets/burger.png";
import { MainMenuContext } from "./MainMenu";
import { getToken } from "../utils/helpers";
import { getCompanyId } from "../utils/helpers";

const options = [
  { value: "category", label: "Category" },
  { value: "item", label: "Item" },
  { value: "group", label: "Group" },
  { value: "ingredient", label: "Ingredient" }
];

function MenuElements() {
  const { data, value, setValue } = useContext(MainMenuContext);
  const [width, setWidth] = useState();

  useEffect(() => {
    setWidth(window.innerWidth);
    function resize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  //console.log(width);
  const styles = {
    control: provided => ({
      ...provided,
      width: width < 1025 ? 140 : 193,
      height: 45,
      border: "#021a53 solid 1px",
      borderRadius: 45,
      paddingLeft: width < 1025 ? 10 : 45,
      paddingRight: 13,
      fontSize: 14
    }),
    indicatorSeparator: () => ({ display: "none" })
  };

  function renderElements() {
    return data[value.value].map(elem => {
      return <Element key={elem.id} elem={elem} />;
    });
  }

  return (
    <div className="menu-elements">
      <div className="menu-elems-head">
        <Select
          styles={styles}
          options={options}
          value={value}
          onChange={value => setValue(value)}
        />
      </div>

      <div className="menu-elems">{renderElements()}</div>
    </div>
  );
}

function Element({ elem }) {
  const { data, setData, toUpdated, setToUpdated, setIsDragging } = useContext(
    MainMenuContext
  );
  const { id, name, type, image_url } = elem;

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

  return (
    <div className="menu-elem" ref={drag}>
      <img className="menu-elem-img" src={image_url || burger} alt="" />
      <p className="menu-elem-name">{name}</p>
    </div>
  );
}

export default MenuElements;
