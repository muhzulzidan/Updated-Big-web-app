import React, { useState, useContext } from "react";
import Modal from "../modal/Modal";
import ItemForm from "./models/ItemForm";
import IngredientForm from "./models/IngredientForm";
import CategoryForm from "./models/CategoryForm";
import GroupForm from "./models/GroupForm";
import DroppableArea from "./DroppableArea";

import { MainMenuContext } from "./MainMenu";

function MenuDetails() {
  const { data } = useContext(MainMenuContext);
  const [showModel, setShowModel] = useState(null);

  function close() {
    setShowModel(null);
  }

  function renderCategory() {
    return data.category.map(category => {
      return (
        <DroppableArea key={category.id} elem={category} accept={["item"]} />
      );
    });
  }

  function renderItems() {
    return data.item.map(item => {
      return (
        <DroppableArea
          key={item.id}
          elem={item}
          accept={["group", "ingredient"]}
        />
      );
    });
  }

  function renderGroups() {
    return data.group.map(group => {
      return (
        <DroppableArea
          key={group.id}
          elem={group}
          accept={["item", "group", "ingredient"]}
        />
      );
    });
  }

  function renderIngredients() {
    return data.ingredient.map(ingred => {
      return <DroppableArea key={ingred.id} elem={ingred} accept={[]} />;
    });
  }

  return (
    <div className="menu-details">
      <div>
        <div className="md-sect">
          <p className="md-sect-name">Category</p>
          <p className="md-sect-plus" onClick={() => setShowModel("category")}>
            +
          </p>
        </div>

        <div>{renderCategory()}</div>
      </div>

      <div>
        <div className="md-sect">
          <p className="md-sect-name">Item</p>
          <p className="md-sect-plus" onClick={() => setShowModel("item")}>
            +
          </p>
        </div>

        <div>{renderItems()}</div>
      </div>

      <div>
        <div className="md-sect">
          <p className="md-sect-name">Group</p>
          <p className="md-sect-plus" onClick={() => setShowModel("group")}>
            +
          </p>
        </div>

        <div>{renderGroups()}</div>
      </div>

      <div>
        <div className="md-sect">
          <p className="md-sect-name">Ingredient</p>
          <p
            className="md-sect-plus"
            onClick={() => setShowModel("ingredient")}
          >
            +
          </p>
        </div>

        <div>{renderIngredients()}</div>
      </div>

      {showModel === "item" && (
        <Modal>
          <ItemForm close={close} />
        </Modal>
      )}

      {showModel === "ingredient" && (
        <Modal>
          <IngredientForm close={close} />
        </Modal>
      )}

      {showModel === "category" && (
        <Modal>
          <CategoryForm close={close} />
        </Modal>
      )}

      {showModel === "group" && (
        <Modal>
          <GroupForm close={close} />
        </Modal>
      )}
    </div>
  );
}

export default MenuDetails;
