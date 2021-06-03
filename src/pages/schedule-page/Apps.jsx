import React, { useEffect, useState, useRef,  } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  IconButton,
  Drawer,
} from "@material-ui/core";
import { BrowserRouter, Switch, Route, Link, useRouteMatch } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Schedular from "./components/Schedular";
import FormButton from "./components/FormButton";
import ScheduleThumbnail from "./components/ScheduleThumbnail";
import { v4 as uuidv4 } from "uuid";
import settings from "./components/Schedular/config";
import ConfirmDialog from "./components/ConfirmDialog";
import { createConfirmation } from "react-confirm";
import CustomDrawer from "./components/CustomDrawer";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
// import ScheduleService from "./services/scheduleService.js";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import RestoreOutlinedIcon from "@material-ui/icons/RestoreOutlined";
import CloseOutlined from "@material-ui/icons/CloseOutlined";
import {
  actionStatus,
  useCreateSchedule,
  useDeleteSchedule,
  useEditScheduleName,
  useEditScheduleTimezone,
  useGetSchedulesByOwner,
  useUpdateSchedule,
} from "./endpoints";

import styled from 'styled-components';

// import { ReactComponent as Arrow } from "../../../../assets/svgs/arrow2.svg";
import { ReactComponent as Arrow } from "../../assets/svgs/arrow2.svg"

import TimezoneSelectorMap from "./components/TimezoneSelectorMap"

// const TimezoneSelectorMap = React.lazy(() =>
//   import("./components/TimezoneSelectorMap")
// );

import "./App.css"

const confirm = createConfirmation(ConfirmDialog);

const { totalMinutes } = settings;

const styles = {
  titlePrimary: {
    fontStyle: "italic",
    fontWeight: 400,
    fontFamily: "Poppins",
    color: "#2d2d61",
  },
  titleSecondary: {
    fontFamily: "Poppins",
    fontWeight: 900,
    color: "#2d2d61",
  },
  drawerPaper: {
    width: "85%",
  },
};

const screens = [
  {
    buttonText: "Next",
    pageTitle: "Schedule A",
    screenName: "timezoneScreen",
  },
  {
    buttonText: "Save",
    pageTitle: "Schedule A",
    screenName: "scheduleScreen",
  },
];

function Apps(props) {
  const [state, setState] = useState({
    drawerOpen: false,
    drawerRemoveFinished: true,
  });
  const [screenValue, setScreenValue] = useState(0);
  const [pageTitle, setPageTitle] = useState(screens[0].pageTitle);
  const [buttonText, setButtonText] = useState(screens[0].buttonText);
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleTimezone, setTimezone] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(new Array(7).fill([]));
  const [lastSavedSchedule, setLastSavedSchedule] = useState(
    new Array(7).fill([])
  );
  const [apiSchedule, setApiSchedule] = useState();
  const [finalSchedule, setFinalSchedule] = useState();
  const [scheduleId, setScheduleId] = useState();
  const [deleteScheduleId, setDeleteScheduleId] = useState();
  const tableContainerRef = React.useRef(null)
  const [weekStart, setWeekStart] = useState(0); // 0 if sunday, 1 if monday
  const [viewName, setViewName] = useState("");
  const [isClosingSchedule, setIsClosingSchedule] = useState(false);
  const [isConfirmationModalOpened, setIsConfirmationModalOpened] = useState(
    false
  );
  const [active, setActive] = React.useState(schedules[0]);
  const [isEditedSnackBarShown, setEditIsSnackBarShown] = useState(false);
  const [isCreatedSnackBarShown, setCreateIsSnackBarShown] = useState(false);
  const [
    isUpdatedSettingsSnackBarShown,
    setUpdateSettingsIsSnackBarShown,
  ] = useState(false);

  const { path } = useRouteMatch();


  // FIXME: Integrate api response to be schedules
  const ownerID = "owner1";
  const { apiState, apiResponse, setApi, resetApi } = useGetSchedulesByOwner(
    ownerID
  );
  const {
    apiState: createScheduleState,
    apiResponse: createScheduleApiResponse,
    setApi: setCreateScheduleApi,
    resetApi: resetCreateScheduleApi,
  } = useCreateSchedule(apiSchedule);
  const {
    apiState: updateScheduleState,
    setApi: setUpdateScheduleApi,
    resetApi: resetUpdateScheduleApi,
  } = useUpdateSchedule({
    key: scheduleId,
    schedule: apiSchedule,
  });
  const {
    apiState: deleteScheduleState,
    setApi: setDeleteScheduleApi,
    resetApi: resetDeleteScheduleApi,
  } = useDeleteSchedule(deleteScheduleId);
  const {
    apiState: editScheduleNameState,
    setApi: setEditScheduleNameApi,
    resetApi: resetEditScheduleNameApi,
  } = useEditScheduleName({
    key: scheduleId,
    schedule: { name: viewName },
  });
  const {
    apiState: editScheduleTimezoneState,
    setApi: setEditScheduleTimezoneApi,
    resetApi: resetEditScheduleTimezoneApi,
  } = useEditScheduleTimezone({
    key: scheduleId,
    schedule: { zone: scheduleTimezone },
  });

  useEffect(() => {
    setApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (apiState === actionStatus.succeeded) {
      const convertedSchedules = apiResponse.map((apiSchedule) => {
        let json = { ...apiSchedule };
        json.timezone = json.zone;
        delete json["zone"];
        let timings = new Array(7).fill([]);
        json.timings &&
          json.timings.forEach((x) => {
            let day = Math.floor(x.start / totalMinutes);
            let start = (x.start / totalMinutes - day) * 96;
            let stop = (x.stop / totalMinutes - day) * 96;

            timings[day] = [
              ...timings[day],
              { id: x.id, range: [start, stop], from: 96 },
            ];
          });
        json.timings = timings;
        json.scheduleId = json.schedule_id;

        return json;
      });

      setSchedules(convertedSchedules);
      resetApi();
    }
  }, [apiResponse, apiState, resetApi]);

  useEffect(() => {
    if (isCreatedSnackBarShown) {
      setTimeout(() => setCreateIsSnackBarShown(false), 1000);
    }

    if (isEditedSnackBarShown) {
      setTimeout(() => setEditIsSnackBarShown(false), 1000);
    }

    if (isUpdatedSettingsSnackBarShown) {
      setTimeout(() => setUpdateSettingsIsSnackBarShown(false), 1000);
    }
  }, [
    isCreatedSnackBarShown,
    isEditedSnackBarShown,
    isUpdatedSettingsSnackBarShown,
  ]);

  const isFormUpdated = isEqual(currentSchedule, lastSavedSchedule);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setScreenValue(0);
    setState({ drawerOpen: open, drawerRemoveFinished: false });
  };

  const closeDrawer = async () => {
    setState((prev) => Object.assign({}, prev, { drawerOpen: false }));
    await delay(400);
    setState((prev) => Object.assign({}, prev, { drawerRemoveFinished: true }));
  };

  const changeName = (event, name) => {
    setViewName(name);
  };

  useEffect(() => {
    if (
      editScheduleNameState === actionStatus.succeeded &&
      editScheduleTimezoneState === actionStatus.succeeded
    ) {
      resetEditScheduleNameApi();
      resetEditScheduleTimezoneApi();
      setScheduleName(viewName);
      setPageTitle(viewName);
      setTimezone(scheduleTimezone);

      const existingScheduleIndex =
        finalSchedule &&
        schedules.findIndex((x) => x.schedule_id === finalSchedule.schedule_id);

      if (existingScheduleIndex > -1) {
        setSchedules((prev) => {
          let arr = [...prev];
          arr[existingScheduleIndex] = {
            ...finalSchedule,
            name: viewName,
            zone: scheduleTimezone,
          };
          return arr;
        });
      }

      setEditIsSnackBarShown(true);

      if (screenValue < screens.length - 1)
        setScreenValue((previousValue) => previousValue + 1);
    }
  }, [
    editScheduleNameState,
    editScheduleTimezoneState,
    finalSchedule,
    resetEditScheduleNameApi,
    resetEditScheduleTimezoneApi,
    scheduleTimezone,
    schedules,
    screenValue,
    viewName,
  ]);

  const handleNextButton = async () => {
    if (buttonText === "Next") {
      const existingScheduleIndex =
        finalSchedule &&
        schedules.findIndex((x) => x.schedule_id === finalSchedule.schedule_id);

      if (viewName !== "" && existingScheduleIndex > -1) {
        setScheduleName(viewName);
        setPageTitle(viewName);

        const finalSchedule = {
          name: viewName,
          schedule_id: scheduleId,
          timings: schedules[existingScheduleIndex].timings,
          owner_id: ownerID,
          timezone: scheduleTimezone,
        };
        setFinalSchedule(finalSchedule);
        const jsonSchedule = generateJSON(finalSchedule);
        setApiSchedule(jsonSchedule);
        setUpdateScheduleApi(() => {
          if (screenValue < screens.length - 1)
            setScreenValue((previousValue) => previousValue + 1);
        });

        setEditScheduleNameApi();
        setEditScheduleTimezoneApi();
      } else {
        setScheduleName(viewName);
        setPageTitle(viewName);

        const finalSchedule = {
          name: viewName || "Schedule " + (schedules.length + 1),
          schedule_id: "",
          timings: [],
          owner_id: ownerID,
          timezone: scheduleTimezone,
        };
        setFinalSchedule(finalSchedule);
        const jsonSchedule = generateJSON(finalSchedule);
        setApiSchedule(jsonSchedule);
        setCreateScheduleApi(() => {
          if (screenValue < screens.length - 1)
            setScreenValue((previousValue) => previousValue + 1);
        });
      }
    }
  };

  useEffect(() => {
    if (createScheduleState === actionStatus.succeeded) {
      resetCreateScheduleApi();
      setLastSavedSchedule(currentSchedule);

      let existingScheduleIndex = schedules.findIndex(
        (x) => x.schedule_id === finalSchedule.schedule_id
      );
      if (existingScheduleIndex > -1) {
        setSchedules((prev) => {
          let arr = [...prev];
          arr[existingScheduleIndex] = finalSchedule;
          return arr;
        });
      } else {
        setSchedules((prev) =>
          prev.concat([
            {
              ...finalSchedule,
              schedule_id:
                createScheduleApiResponse.schedule_id ||
                finalSchedule.schedule_id,
            },
          ])
        );
        setScheduleId(
          createScheduleApiResponse.schedule_id || finalSchedule.schedule_id
        );
      }

      setCreateIsSnackBarShown(true);
    }

    if (updateScheduleState === actionStatus.succeeded) {
      resetUpdateScheduleApi();
      setLastSavedSchedule(currentSchedule);

      let existingScheduleIndex = schedules.findIndex(
        (x) => x.schedule_id === finalSchedule.schedule_id
      );
      if (existingScheduleIndex > -1) {
        setSchedules((prev) => {
          let arr = [...prev];
          arr[existingScheduleIndex] = finalSchedule;
          return arr;
        });
      } else {
        setSchedules((prev) => prev.concat([finalSchedule]));
      }

      setEditIsSnackBarShown(true);
    }

    if (deleteScheduleState === actionStatus.succeeded) {
      resetDeleteScheduleApi();
    }
  }, [
    createScheduleApiResponse,
    createScheduleState,
    currentSchedule,
    deleteScheduleState,
    finalSchedule,
    resetCreateScheduleApi,
    resetDeleteScheduleApi,
    resetUpdateScheduleApi,
    schedules,
    updateScheduleState,
  ]);

  const handleSaveButton = async (callBack = () => {}) => {
    let finalSchedule = {
      name: scheduleName || "Schedule " + (schedules.length + 1),
      schedule_id: scheduleId || "",
      timings: currentSchedule,
      owner_id: "owner1",
      timezone: scheduleTimezone,
    };

    setScheduleName(finalSchedule.name);

    const existingScheduleIndex = schedules.findIndex(
      (x) => x.schedule_id === finalSchedule.schedule_id
    );

    setFinalSchedule(finalSchedule);
    const jsonSchedule = generateJSON(finalSchedule);
    setApiSchedule(jsonSchedule);
    console.log(finalSchedule);
    console.log("schedule JSON: ", jsonSchedule);

    if (existingScheduleIndex > -1) {
      setUpdateScheduleApi(callBack);
    } else {
      setCreateScheduleApi(callBack);
    }

    if (screenValue < screens.length - 1)
      setScreenValue((previousValue) => previousValue + 1);
  };

  const handlePreviousButton = async (callBack) => {
    if (screenValue > 0) {
      if (isFormUpdated) {
        if (callBack) {
          callBack();
        } else {
          setScreenValue((previousValue) => previousValue - 1);
        }
      } else {
        setIsConfirmationModalOpened(true);
      }
    }
    if (screenValue === 0) {
      resetState();
      closeDrawer();
      setPageTitle(screens[0].pageTitle);
      setScheduleName("");
    }
  };

  const screenHeader = (
    <Box display="flex" alignItems="start" flexDirection="column"  paddingTop="80px" fontSize="calc(14px + 1vw)" >
      {/* <IconButton aria-label="goback" onClick={() => handlePreviousButton()}>
        <ArrowBackIcon fontSize="large" />
      </IconButton> */}
      <Box
        component="span"
        className="schedule-title"
        style={{ fontSize: "inherit", fontWeight: 500, color: "#021a53", }}
      >
        {scheduleName}        
      </Box>
      <Box
      component="span"
      className="schedule-zone"
      >
        <div className="MuiTypography-root ScheduleThumbnail-timezone-65 MuiTypography-body1 MuiTypography-colorTextSecondary"
        style={{ fontSize: "large", fontWeight: 400, color: "#021a53", }}>
          {/* Asia/Riyadh */}
          {" "}
          {scheduleTimezone != null ? /*"Timezone: "+*/ scheduleTimezone : ""}
        </div>
      </Box>
    </Box>
  );

  const getCurrentScreen = () => {
    switch (screenValue) {
      default:
      case 0:
        return (
          <TimezoneSelectorMap
            changedName={changeName}
            scheduleName={scheduleName}
            setScheduleName={setScheduleName}
            setTimezone={setTimezone}
            scheduleTimezone={scheduleTimezone}
          />  
        );

      case 1:
        return (
          <Schedular
            ownerID={ownerID}
            schedules={schedules} 
            scheduleTimezone={scheduleTimezone} 
            scheduleId={scheduleId} 
            timezone={scheduleTimezone}
            scheduleName={pageTitle} 
            ref={tableContainerRef}
            setCurrentSchedule={setCurrentSchedule}
            currentSchedule={currentSchedule}
            handlePrevious={handlePreviousButton}
            weekStart={weekStart}
            setWeekStart={setWeekStart}
            generatedJson={json}
            schedulerHeader={screenHeader}
            setUpdateSettingsIsSnackBarShown={setUpdateSettingsIsSnackBarShown}
            additionalControls={[
              {
                icon: RestoreOutlinedIcon,
                type: "materialSVG",
                onClick: () => {
                  setCurrentSchedule(lastSavedSchedule);
                },
                title: "Reset",
                alt: "reset",
                isDisabled: isFormUpdated,
              },
              {
                icon: SaveOutlinedIcon,
                onClick: handleSaveButton,
                type: "materialSVG",
                title: isCreatedSnackBarShown
                  ? "Saved"
                  : isEditedSnackBarShown
                  ? "Updated"
                  : isUpdatedSettingsSnackBarShown
                  ? "Settings updated"
                  : "Save",
                alt: "save",
                isDisabled: isFormUpdated,
                isLoading:
                  createScheduleState === actionStatus.fetching ||
                  updateScheduleState === actionStatus.fetching,
                showTooltip:
                  isCreatedSnackBarShown ||
                  isEditedSnackBarShown ||
                  isUpdatedSettingsSnackBarShown,
              },
              {
                icon: CloseOutlined,
                onClick: () => {
                  setIsClosingSchedule(true);
                  handlePreviousButton(() => {
                    resetState();
                    closeDrawer();
                    setPageTitle(screens[0].pageTitle);
                    setScheduleName("");
                  });
                },
                type: "materialSVG",
                title: "Close",
                alt: "close",
              },
            ]}
          />
        );
    }
  };

  
  const [json, setJson] = useState({ schedule: "not set" });
  // const theSchedule = new ScheduleService(); 

  const generateJSON = (schedule) => {
    let json = { ...schedule };

    json.zone = json.timezone;
    delete json["timezone"];
    let timings = [];
    json.timings.forEach((x, i) => {
      x.forEach((y) => {
        let start = i * totalMinutes + (y.range[0] / y.from) * totalMinutes;
        let stop = i * totalMinutes + (y.range[1] / y.from) * totalMinutes;
        let id = y.id || uuidv4();

        timings.push({ start, stop, id });
      });
    });
    json.timings = timings;
    return json;
  };

  const resetState = () => {
    setCurrentSchedule(new Array(7).fill([]));
    setScheduleId(uuidv4());

    setScheduleName(null);
    setTimezone(null);
    setScreenValue(0);
    setViewName("");
  };

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    if (viewName !== "") {
      setPageTitle(viewName);
    } else {
      setPageTitle(screens[screenValue].pageTitle);
    }
    setButtonText(screens[screenValue].buttonText);
  }, [screenValue, viewName]);

  const handleScheduleThumbnailClick = (schedule_id) => {
    const theSchedule = schedules.filter(
      (schedule) => schedule.schedule_id === schedule_id
    )[0];

    setFinalSchedule(theSchedule);
    setCurrentSchedule(theSchedule.timings);
    setCurrentSchedule(theSchedule.timings);
    setLastSavedSchedule(theSchedule.timings);
    setScheduleId(theSchedule.schedule_id);
    setScheduleName(theSchedule.name);
    setTimezone(theSchedule.zone || theSchedule.timezone);
    setState((prev) =>
      Object.assign({}, prev, { drawerOpen: true, drawerRemoveFinished: false })
    );
  };

  const handleDeleteClick = (schedule_id) => {
    setDeleteScheduleId(schedule_id);
    setDeleteScheduleApi(() => {
      const theSchedule = schedules.filter(
        (schedule) => schedule.schedule_id !== schedule_id
      );
      setSchedules(theSchedule);
    });
  };


  const handleAddSchedule = () =>{
    toggleDrawer(true)
    setIsClosingSchedule(true);
      handlePreviousButton(() => {
        resetState();
        closeDrawer();
        setPageTitle(screens[0].pageTitle);
        setScheduleName("");
        })
  }

  const Button = styled.button`
      display: flex;
      flex-direction: row;
      position: relative;
      align-items: center;

      background: #FFFFFF;

      width: fit-content;

      border-radius: 10px;
      width:100%;

      margin-bottom: 1em;

      /* height: 5em; */
  `;

  const ButtonToggle = styled(Button)`
      border: 1px solid lightgray;
    ${({ active }) =>
      active &&
      `
      border: 1px solid #00CF7B;
    `}
  `;

  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
      <div style={{ flex: 3.5 }}>
      <Container
        style={{
          backgroundColor: "#efefef",
          // position: !state.drawerRemoveFinished ? "fixed" : "fixed",
          paddingLeft: "2em",
          paddingRight: "2em",
          height:"100%",
        }}
        maxWidth="xl"
        className="container"
      >
        <Box pt={3} pb={5} >
          <Box display="flex" justifyContent="space-between">
            <Box alignSelf="center">
              <Typography               
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                color: "#2d2d61",
                fontSize:"calc(.5em + 1vw)",
                fontStyle:"italic",
              }}
              align="left"
              >
                New
              </Typography>
              <Typography               
              style={{
                fontFamily: "Poppins",
                fontWeight: 900,
                color: "#2d2d61",
                fontSize:"calc(.5em + 1vw)"
              }}
              align="left"
              variant="h5"
              >
                SCHEDULE MANAGER
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center"  >
              <Link to={`${path}/schedule`} style={{color:"inherit"}}>
                <AddCircleOutlineIcon style={{ fontSize: "calc(30px + 1vw)",  }} className="add-schedule" onClick={handleAddSchedule}>
                  Add Schedule{" "}
                </AddCircleOutlineIcon>
              </Link>              
            </Box>
          </Box>
        </Box>
        <Box pt={5}
        style={{
          padding: ".3em",
          overflowY:"hidden"
        }}

        >
          <Grid container justify="flex-start" spacing={1}
          style={{
            flexDirection:"column",
            display: "flex",
            alignContent: "center",
            width: "100%",
            overflowY:"hidden"
          }}
          >
              
            {apiState === actionStatus.fetching ? (
              <Grid container justify="center">
                <Box mt={5}>
                  <FontAwesomeIcon icon={faCircleNotch} spin size="4x" />
                </Box>
              </Grid>
            ) : (
              schedules.map((schedule, index) => (
                <ButtonToggle
                  key={index}
                  active={active === schedule}
                  // onClick={handleClick} 
                  onClick={() => {
                    setActive(schedule)
                  }}
                  // className={classes.cardExpand}
                > 
                <Link to={`${path}/schedule`}
                style={{
                  width: "100%",
                  height:"inherit",
                }}
                className="link-schedule"
                >
                  {/* <Grid key={index} item> */}
                  <ScheduleThumbnail
                      // visible={visible}
                      schedule={schedule}
                      deleteScd={async () => {
                        if (
                          await confirm({
                            confirmation: "Do you want to delete the schedule?",
                          })
                        ) {
                          handleDeleteClick(schedule.schedule_id);
                        }
                      }}
                      onClick={() => {
                        setScreenValue(1);
                        handleScheduleThumbnailClick(schedule.schedule_id);
                      }}
                    />
                  {/* </Grid> */}
                </Link>
                
                </ButtonToggle>
              ))
            )}
          </Grid>
        </Box>        
      </Container>
        </div>
        <div style={{ flex: 8, backgroundColor: "white" }}>
          <Switch>
            <Route path={`${path}/schedule`}>
            {/* {drawerOpen?<div>a</div>:<div>b</div>} */}
            <Container
            
            style={{
              width: "100%",
              transition: "transform 0.3s",
              transform: `translateX(${state.drawerOpen ? "100" : "0%"})`,
              margin: "0 !important",
              padding: "0 !important",
            }}

            >
            {screenValue !== 1 && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  className="p-4 position-relative "
                >
                  {screenHeader}

                  <Box>
                    <Box ml={screenValue === 1 ? 3 : 0} pb={2} mt={3}>
                      <FormButton onClick={handleNextButton}>{buttonText}</FormButton>
                    </Box>
                  </Box>
                </Box>
              )}  
              <Container
              style={{
                width: "95%",
                // transition: "transform 0.3s",
                // transform: `translateX(${state.drawerOpen ? 0 : "100%"})`,
              }}
                // maxWidth={screenValue === 1 ? false : "xl"}
                disableGutters={screenValue === 1}
              >
                <Box mb={2}>{getCurrentScreen()}</Box>
              </Container>
            </Container>
            
            </Route>
            
            
            <Route path={`${path}/schedule-a`}>
            
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default withStyles(styles)(Apps);
