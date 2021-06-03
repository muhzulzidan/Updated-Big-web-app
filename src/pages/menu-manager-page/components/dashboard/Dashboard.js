import React, { useState } from "react";
import Switch from '@material-ui/core/Switch';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { BrowserRouter, Switch as Sw, Route, Link, useRouteMatch } from "react-router-dom";

import Catalog from "./components/catalog";
import Product from "./components/Product"
// import types from "./array/catalogItems"


import CreateItemButton from "./components/Button";
import SidePanel from "../../../../components/side-panel";
import TextInput from "../../../../components/inputs/text-input";
// import Checkbox from "../../../../components/inputs/checkbox";
// import Button from "../../../../components/buttons/button";

import SaveBranch from "./components/saveBranch"
import CatalogItems from "./components/catalogItems"
import InventoryItems from "./components/inventoryItems"

import MenuIcon from '@material-ui/icons/Menu';

import { ReactComponent as Inventory } from "../../../../assets/svgs/inventory.svg";
import { ReactComponent as Plus } from "../../../../assets/svgs/plus.svg";
import { ReactComponent as CataIcon } from "../../assets/catalog.svg";


// import { ReactComponent as Plus } from "../../../../assets/svgs/plus2.svg";
// import { ReactComponent as Save } from "../../../../assets/svgs/save-menu.svg";
// import save from "../../../../assets/svgs/save.svg";

import { ReactComponent as Arrow } from "../../../../assets/svgs/arrow2.svg";

import "./style.css"

import Select from "../../../../components/inputs/select";
import ImageUpload from "../../../../components/inputs/image-upload";

import AddProduct from "./components/addProduct"

const Dashboard = () => {
  const [menu, setMenu] = useState({});
  const [panelTitle, setPanelTitle] = useState("Create Role");
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  
  const [showText, setShowText] = useState(false);
  
  const [save, setSave] = useState(false);
  
  const [showInventory, setShowInventory] = useState(false)
  
  const [showDetail, setShowDetail] = useState(false);
  
  const [addCatagory, setAddCatagory] = useState(false);

  const [product, setproduct] = useState({});
  const [tempProduct, setTempProduct] = useState({});

  const [shrink, setShrink] = useState(false);

  const saveMenu = () => {
    //TODO: upload employee to the server, then update employee list from server

    //get a new Employee to be ready
    setMenu({});
    //hide panel
    setShowProduct(false)
    setShowSidePanel(false);
    setSave(false);
  };
  
  const addCategory = () => {
    //TODO: upload employee to the server, then update employee list from server

    //get a new Employee to be ready
    setMenu({});
    //hide panel
    setShowCategory(false);
    setAddCatagory(false);
  };



  const showSave = () => {

    if (save) {
      setSave(false);
      console.log("a");
    } else {
      setSave(true);
      console.log("a");
    }

  };

  const handleDetail = () => {
      if (!showDetail){
      setShowDetail(true)
      }else {
          setShowDetail(false) 
      }
  }


  const showInventoryItems = () => {
    if (showInventory) {
      setShowInventory(false);
    } else {
      setShowInventory(true);
    }
  }

  const showCatalogText = () => {
    if (showText) {
      setShowText(false);
    } else {
      setShowText(true);
    }
  };


  const useStyles = makeStyles({
    root: {

    },
    label: {
      fontSize: "calc(15px + 1vw)",
      paddingRight: "1em"
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
          backgroundColor: '#001d53',
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
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { path } = useRouteMatch();

  let listofitems
  
  if(showInventory && !showText ){
    listofitems = <InventoryItems className="content-span"
    title={panelTitle}
    visible={showInventory}
    setVisibility={setShowInventory}/>
  }else {
    listofitems = <CatalogItems className="content-span"
      title={panelTitle}
      visible={showText}
      setVisibility={setShowText}
    />   
  }

  const categoryName = [
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
    "Category Name",
  ]

  return (
    <BrowserRouter>
      <div id="l-dashboard">
        <Route path={`${path}/`}>
        <div className={`menumanager-dashboard ${shrink?"menumanager-dashboard-collapse":""}`}>
        <MenuIcon style={{
                    width:"calc(1.3em + 1vw)",
                    height:"calc(1.3em + 1vw)",
                    margin: "48px 28px",
                }}  className="clickable side-nav-collapse-button"  alt="menu" onClick={() => {
                    setShrink(!shrink);
                }}/>
          <aside className="dash-siba">
            <span className="dash-siba-head">
              <span className="siba-header-user-title">MENUMANAGER</span>
              <div className="dash-siba-menu">
                <h3>
                  <button className="content-span" onClick={showInventoryItems}>
                    <Inventory alt="" className="inventory-icon" />
                    <p>Inventory</p>
                  </button>
                  <span
                    style={{
                      display: "flex"
                    }}>
                    <CreateItemButton
                      text="Add Inventory"
                      onClick={() => {
                        setPanelTitle("Add Inventory");
                        setShowSidePanel(true);
                      }}
                      className="plus-icon"
                    />
                  </span>
                </h3>
                <h3>
                  <button className="content-span" onClick={showCatalogText}>
                      <CataIcon alt="" className="inventory-icon cata-icon" />
                      <p>Catalog</p>
                  </button>
                  <span
                    style={{
                      display: "flex"
                    }}>
                    <CreateItemButton
                      text="Add Menu"
                      onClick={() => {
                        setPanelTitle("Add Menu");
                        setShowSidePanel(true);
                      }}
                      className="plus-icon"
                    />
                  </span>
                </h3>
                <hr className="hr" />

              </div>
              {listofitems}
            </span>
          </aside>
        </div>
        <div className="menumanager-sidepanel" style={{
          zIndex: 1,
          }}>
            <div className="list-category">
              <SidePanel
                title="Add Category"
                visible={showCategory}
                setVisibility={setShowCategory}
              >
                <div className="categories-name-container">
                  {categoryName.map(i => (
                    <button className="categories-name" key={i} >
                      {i}
                    </button>
                  ))}
                  <button aria-label="add more" className="categories-name" onClick={
                    () => {
                      setPanelTitle("Add Category");
                      setAddCatagory(true);
                    }
                  }>
                    <Plus />
                  </button>
                </div>
              </SidePanel>
            </div>
            <div className="add-category">
              <SidePanel
                title={panelTitle}
                visible={addCatagory}
                setVisibility={setAddCatagory}
              >
                <TextInput
                  className="mx-5 my-1"
                  value={menu.name ? menu.name : ""}
                  setValue={(val) => {
                    setMenu({ ...menu, name: val });
                  }}
                  placeholder="Name"
                />

                <div className="mt-auto mx-5 mb-5">
                  <button className="save-button"
                    onClick={addCategory}
                  >
                    <p>Save</p>

                  </button>
                </div>
              </SidePanel>
            </div>
            <div className="add-product">
            <AddProduct
                    title={`Add Product`}
                    visible={showProduct}
                    setVisibility={setShowProduct}
                >
                    <div className="product-container">
                        <div className="product-left">
                            <Select
                                // icon={industryIcon}
                                value={product.productType}
                                setValue={(val) => {
                                    setproduct({
                                        ...product,
                                        productType: val,
                                    });
                                }}
                                placeholder="Select Product Type"

                                style={{
                                    width: "91%",
                                    display: "flex",
                                    alignSelf: "center",
                                    padding: "25px",
                                    marginBottom: "1em",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <option value="item">Item</option>
                                <option value="group">Group</option>
                            </Select>
                            <TextInput
                                style={{
                                    width: "91%",
                                    "margin-left": "auto",
                                    "marginRight": "auto",
                                }}
                                value={product.name ? product.name : ""}
                                setValue={(val) => {
                                    setproduct({
                                        ...product,
                                        name: val,
                                    });
                                }}
                                placeholder="Name"

                            />
                            <div className="catalog-details">
                                <p>Add Description</p>
                                <p>Add Allergens</p>
                                <p>Add Calories</p>
                                <p>Add SKU</p>
                                <p>Add Min/Max</p>
                                <p>Add Items</p>
                            </div>
                        </div>
                        <div className="product-right">
                            <div className="image-upload .mx-auto">
                                <ImageUpload className="h-100"
                                    // text="Upload Image" 
                                    handleUpload={(url) => {
                                        setTempProduct({ ...tempProduct, image: url });
                                    }} />
                            </div>
                            <FormControlLabel
                                control={
                                    <IOSSwitch size="large" checked={state.Active} onChange={handleChange} name="Active" />
                                }
                                label="Active"
                                labelPlacement="start"
                                classes={{
                                    label: classes.label,
                                }}
                            />
                            <div className="catalog-details">
                                <p>Add Minimum Quantity</p>
                                <p>Add Maximum Quantity</p>
                                <p>Add Measurement Unit</p>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-container">
                        <button onClick={saveMenu}>
                            Save
                        </button>
                        <div className="price">
                            <p>Add Base Price</p>
                            <TextInput
                                style={{
                                    width: "45%",
                                    "margin-left": "auto",
                                    "marginRight": "auto",
                                }}
                                value={product.price ? product.price : ""}
                                setValue={(val) => {
                                    setproduct({
                                        ...product,
                                        price: val,
                                    });
                                }}
                                placeholder="Listing Price"

                            />
                        </div>
                    </div>
                </AddProduct>
            </div>

          <SidePanel
            title={panelTitle}
            visible={showSidePanel}
            setVisibility={setShowSidePanel}
          >
            <TextInput
              className="mx-5 my-1"
              value={menu.name ? menu.name : ""}
              setValue={(val) => {
                setMenu({ ...menu, name: val });
              }}
              placeholder="Name"
            />
            <h4 className="mt-5 mx-5 mb-5">
              <FormControlLabel
                control={
                  <IOSSwitch size="large" checked={state.checkedB} onChange={handleChange} name="checkedB" />
                }
                label="Default"
                labelPlacement="start"
                classes={{
                  label: classes.label,
                }}
              />
            </h4>
            <div className="mt-auto mx-5 mb-5">
              {/* <Button onClick={saveMenu}>
                      <img className="mr-3" src={save} alt="save" /> Save
                  </Button>				 */}
              {/* <Save className="save-button"/> */}
              <SaveBranch
                visible={save}
                setVisibility={setSave}
                onClick={saveMenu}
              />

              <button className="save-button"
                onClick={showSave}
              >
                <p>Save</p>

                <div className={`arrow-div `}>
                  <Arrow alt="" className={`arrow-icon ${save ? "up" : ""}`} />
                </div>

              </button>
            </div>
          </SidePanel>
        
        </div>
        <div className="menumanager-content" style={{ flex: 8, backgroundColor: "white",display:"flex", overflow:"hidden", color: "var(--blue-1)", fill:" var(--blue-1)" }}>
          <Sw>
            <Route path={`/store-manager-page/catalog-a`}>
              <div style={{ flex: 8,  }}>
                <Catalog title="Category A" detail={showDetail} />
              </div>
            </Route>
            <Route path="/store-manager-page/catalog-b">
              <div style={{ flex: 8,  }}>
                <Catalog title="Category B" detail={showDetail} />
              </div>
            </Route>
            <Route path="/store-manager-page/catalog-c">
              <div style={{ flex: 8,  }}>
                <Catalog title="Category C" detail={showDetail} />
              </div>
            </Route>
            <Route path="/store-manager-page/catalog-d">
              <div style={{ flex: 8,  }}>
                <Catalog title="Category D" detail={showDetail} />
              </div>
            </Route>
            <Route path="/store-manager-page/create-mode">
                <div className="create-mode">
                  <div>
                    <h2>MENUMANAGER <span>/ Catalog A</span></h2>
                  </div>
                  <div>
                    <button onClick={() => setShowCategory(true)}>
                      <Plus/>
                      Category
                      </button>
                    <button onClick={() => setShowProduct(true)}>
                      <Plus/>
                      Product
                      </button>
                  </div>
                </div>
            </Route>
          </Sw>
        </div>
        </Route>
        
      </div>
    </BrowserRouter>
  )
}
function Items(showText, panelTitle, setShowText, showInventory, setShowInventory) {
  if (showText && !showInventory) {
    console.log(showText)

    return (
      <CatalogItems className="content-span"
        title={panelTitle}
        visible={showText}
        setVisibility={setShowText}
      />
    )
  } else if (showInventory && !showText) {
    console.log(showInventory)
    return (
      <InventoryItems className="content-span"
        title={panelTitle}
        visible={showInventory}
        setVisibility={setShowInventory}
      />
    )
  } else {
    return <h1>apa</h1>
  }
}


export default Dashboard;
