import React, { useState, useRef, useEffect } from "react";
import { Tooltip as MaterialTooltip, withStyles } from "@material-ui/core";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/style.css";
import {
  isBetween,
  convertMinsToHrsMins,
  insertIntoArrayWithSplicingOverlappingItems,
} from "./scripts/helpers";
import styled, { withTheme } from "styled-components";
import { transparentize } from "polished";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const RangeLabel = styled.div`
  color: #021a53;
  font-weight: 700;
  font-size: 12px;
  height: ${(props) => props.rangeLabelHeight}px;
  width: 146px;
  border-radius: 36px;
  transition: transform 0.2s;
  position: absolute;
  top: 0;
  left: 15px;
`;

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    marginLeft: "-50%",
    marginTop: "-24px",
    backgroundColor: "transparent",
    maxWidth: 220,
  },
}))(MaterialTooltip);

const Tooltip = ({
  newRange,
  maxValue,
  totalMinutes,
  hourFormat,
  dayName,
  theme,
  tooltipWidth,
}) => {
  const fonts = { small: 12, big: 22 };
  return (
    <div
      style={{
        height: "100%",
        padding: "4px 20px",
        width: tooltipWidth,
        borderRadius: "29px",
        background: theme.primary,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: 700,
      }}
    >
      <div style={{ color: "white" }}>
        <div style={{ fontSize: fonts.small, lineHeight: `${fonts.small}px` }}>
          {dayName}
        </div>
        <div style={{ fontSize: fonts.big, lineHeight: `${fonts.big}px` }}>
          {convertMinsToHrsMins(
            (newRange[0] / maxValue) * totalMinutes,
            hourFormat === 12
          )}
        </div>
      </div>
      <div style={{ color: theme.secondary }}>
        <div style={{ fontSize: fonts.small, lineHeight: `${fonts.small}px` }}>
          {dayName}
        </div>
        <div style={{ fontSize: fonts.big, lineHeight: `${fonts.big}px` }}>
          {convertMinsToHrsMins(
            (newRange[1] / maxValue) * totalMinutes,
            hourFormat === 12
          )}
        </div>
      </div>
    </div>
  );
};

const Timeslot = styled.div`
  position: absolute;
  top: 0;
  pointer-events: none;
  height: ${(props) => props.cellHeight}px;
  background: ${(props) => props.theme.primary};
  border: ${(props) =>
    props.withBorder
      ? `3px solid ${props.theme.secondary}`
      : `3px solid ${props.theme.primary}`};
`;

const DayTimelineMerged = ({
  timeslots,
  activeRangeIndex,
  rangeStepWidth,
  maxValue,
  theme,
  day,
  selectedItems,
  movingRange,
  cellHeight,
  totalMinutes,
  dayName,
  rangeLabelHeight,
}) => {
  let mergedTimeslots = [];
  let tcopy = JSON.parse(JSON.stringify(timeslots));
  tcopy.forEach((x, i) => {
    const length = mergedTimeslots.length;
    if (!length) {
      mergedTimeslots.push(Object.assign({}, x, { contains: [i] }));
    } else if (mergedTimeslots[length - 1].range[1] === x.range[0]) {
      mergedTimeslots[length - 1].range[1] = x.range[1];
      mergedTimeslots[length - 1].contains.push(i);
    } else {
      mergedTimeslots.push(Object.assign({}, x, { contains: [i] }));
    }
  });

  return mergedTimeslots.map((x, i) => {
    const isSelected = x.contains.filter((y) =>
      selectedItems.includes(day + "-" + y)
    ).length;
    const timeSlotText =
      dayName.substring(0, 3) +
      " " +
      convertMinsToHrsMins((x.range[0] / maxValue) * totalMinutes) +
      "-" +
      convertMinsToHrsMins((x.range[1] / maxValue) * totalMinutes);
    const timeSlotWidth =
      ((rangeStepWidth * (x.range[1] - x.range[0])) / x.from) * maxValue;

    return (
      <Timeslot
        key={`merged-timeslot-${day}-${i}`}
        isTransparent={
          !(
            movingRange.originDay === day &&
            x.contains.includes(movingRange.rangeIndex) &&
            movingRange.day !== day
          )
        }
        withBorder={isSelected || x.contains.includes(activeRangeIndex)}
        cellHeight={cellHeight}
        theme={theme}
        style={{
          zIndex: isSelected ? 47 : 26, // little higher than unmerged timeslot
          left: rangeStepWidth * (x.range[0] / x.from) * maxValue,
          width: timeSlotWidth,
        }}
      >
        {timeSlotWidth >= 150 ? (
          <div className="position-relative h-100">
            <RangeLabel
              rangeLabelHeight={rangeLabelHeight}
              style={{
                transition: "transform 0.2s",
                transform: isSelected
                  ? `translateY(-${rangeLabelHeight / 2 + 2}px)`
                  : `translateY(${(cellHeight - rangeLabelHeight - 6) / 2}px)`,
                background: isSelected ? theme.secondary : theme.tertiary,
              }}
              className="d-flex align-items-center justify-content-center"
            >
              {timeSlotText}
            </RangeLabel>
          </div>
        ) : (
          <div className="position-relative h-100">
            <HtmlTooltip
              open={isSelected || x.contains.includes(activeRangeIndex)}
              placement="bottom-start"
              title={
                <RangeLabel
                  rangeLabelHeight={rangeLabelHeight}
                  style={{
                    transition: "transform 0.2s",
                    transform: isSelected
                      ? `translateY(-${rangeLabelHeight / 2 + 2}px)`
                      : `translateY(${
                          (cellHeight - rangeLabelHeight - 6) / 2
                        }px)`,
                    background: isSelected ? theme.secondary : theme.tertiary,
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  {timeSlotText}
                </RangeLabel>
              }
              interactive
            >
              <FontAwesomeIcon
                color={isSelected ? theme.secondary : theme.tertiary}
                size="sm"
                icon={faCircle}
                cursor="pointer"
              />
            </HtmlTooltip>
          </div>
        )}
      </Timeslot>
    );
  });
};

const DayTimeline = ({
  size,
  day,
  dayName,
  totalMinutes,
  step,
  dragging,
  setDragging,
  interval,
  selectedItems,
  setSelectedItems,
  cellHeight,
  cellWidth,
  ranges,
  handelOutClick,
  setRanges,
  showLines,
  pageRef,
  hourFormat,
  activeButton,
  setActiveButton,
  theme,
  spaceBetweenTimelines,
  setMovingRange,
  movingRange,
  rangeLabelHeight,
  joinAdjacent,
  setJoinAdjacent,
}) => {
  const [active, setActive] = useState(-2); // which range of the day mouse is currently over.
  const [newRange, setNewRange] = useState([]);
  const maxValue = totalMinutes / step; // max range input value
  const rangeStepWidth = cellWidth / (interval / step); // how much pixels is equal to 1 unit of range input
  const [innerTooltipPosition, setInnerTooltipPosition] = useState("end"); // there are two types of tooltip: inner and outer.
  const handlePushConstant = 10; // this constant helps to position range input handle to follow the mouse tighter
  const initialNewRangeValue = useRef({ captured: false, value: [], tried: 0 }); // Helps to correctly increment right side of range, when user draw timeslot from right to left
  const tooltipWidth = hourFormat === 24 ? 220 : 260; // static tooltip width, can not be changed. Helps to position tooltip correctly
  const newRangeWidth = rangeStepWidth * (newRange[1] - newRange[0]);
  const [copiedRange, setCopiedRange] = useState({ range: [], from: 0 });
  //setting tooltip position left based on new range width and protecting it not to go behind container
  let tooltipPositionLeft =
    rangeStepWidth * newRange[0] + newRangeWidth / 2 - tooltipWidth / 2;

  tooltipPositionLeft =
    tooltipPositionLeft < size.width - tooltipWidth
      ? tooltipPositionLeft >= 0
        ? tooltipPositionLeft
        : 0
      : size.width - tooltipWidth;

  // const [width, setWidth] = useState(0);
  // const elementRef = useRef(null);

  useEffect(() => {
    if (movingRange.released) {
      if (movingRange.originDay === day) {
        let rangesCopy = [...ranges];
        rangesCopy.splice(movingRange.rangeIndex, 1);
        if (movingRange.day === day) {
          insertIntoArrayWithSplicingOverlappingItems(
            rangesCopy,
            movingRange.range,
            maxValue
          );
        }

        if (copiedRange.range.length) {
          insertIntoArrayWithSplicingOverlappingItems(
            rangesCopy,
            copiedRange.range,
            maxValue
          );
        }
        setRanges(() => rangesCopy);

        setMovingRange((prev) =>
          Object.assign({}, prev, {
            range: [],
            from: 0,
            rangeIndex: -1,
            day: -1,
            originDay: -1,
          })
        );
      } else if (movingRange.day === day) {
        addNewRange(movingRange.range);
      }
      if (copiedRange.range.length) {
        setCopiedRange((prev) =>
          Object.assign({}, prev, { range: [], from: 0 })
        );
      }
    }

    // setWidth(elementRef.current.getBoundingClientRect().width);
  }, [movingRange.released]); // eslint-disable-line react-hooks/exhaustive-deps

  const baseTrackStyle = {
    borderRadius: 0,
    height: cellHeight,
    cursor: "grab",
    top: 0,
  };

  const outerTooltipContainerStyle = {
    position: "absolute",
    top: `-${cellHeight + 3}px`,
    width: tooltipWidth + 100,
    left: tooltipPositionLeft,
    height: cellHeight,
    zIndex: 24,
  };

  //new range input handler style
  const newRangeHandleStyle = (activeState, value) => {
    return {
      height: cellHeight,
      borderRadius: 0,
      width: rangeStepWidth,
      backgroundPosition: "center",
      left: "1px",
      zIndex: 2,
      backgroundColor: transparentize(0.8, theme.secondary),
      opacity: !dragging
        ? showLines
          ? activeState === -2
            ? 0
            : 1
          : activeState === -2 || (value.toFixed(0) * step) % interval !== 0
          ? 0
          : 1
        : 0,
      outline: 0,
      border: "none",
      boxShadow: "none",
    };
  };

  const resizeHandleStyle = {
    opacity: 0,
    outline: 0,
    width: "30px",
    height: cellHeight,
    cursor: "col-resize",
  };

  const newRangeContainerStyle = {
    position: "absolute",
    top: 0,
    padding: "6px",
    left: rangeStepWidth * newRange[0],
    height: cellHeight,
    background: theme.secondary,
    width: newRangeWidth,
    pointerEvents: "none",
  };

  const [w, setW] = useState(1);

  const movingRangeContainerStyle = (element, index, isSelected) => {
    return {
      position: "absolute",
      opacity: activeButton === "copy" ? 0.5 : 1,
      top: 0,
      height: cellHeight,
      zIndex: isSelected ? 45 : index > -1 ? 24 : 20,
      left: rangeStepWidth * (element.range[0] / element.from) * maxValue,
      width:
        ((rangeStepWidth * (element.range[1] - element.range[0])) /
          element.from) *
        maxValue,
      background: theme.primary,
      border: `3px solid ${theme.primary}`,
    };
  };

  const mainRangeContainerStyle = (element, index, isSelected) => {
    return {
      position: "absolute",
      opacity:
        movingRange.originDay === day &&
        movingRange.rangeIndex === index &&
        movingRange.day !== day
          ? 0
          : 1,
      top: 0,
      height: cellHeight,
      zIndex: isSelected ? 45 : index > -1 ? 24 : 20,
      left: rangeStepWidth * (element.range[0] / element.from) * maxValue,
      width:
        ((rangeStepWidth * (element.range[1] - element.range[0])) /
          element.from) *
        maxValue,
      background: theme.primary,
      border:
        isSelected || active === index
          ? `3px solid ${theme.secondary}`
          : `3px solid ${theme.primary}`,
    };
  };

  const cutLayerStyle = {
    position: "absolute",
    top: 0,
    height: cellHeight,
    zIndex: activeButton === "cut" ? 52 : -2,
    left: 0,
    width: "100%",
  };

  const parseMouseEvent = (e) => {
    var bounds = e.currentTarget.getBoundingClientRect();
    var x = Math.round(
      +(
        ((e.clientX - bounds.left - rangeStepWidth / 2) / size.width) *
        maxValue
      )
    );
    var mouseY = e.clientY - bounds.top;
    let rangeIndex = -1;
    let it = 0;
    while (rangeIndex === -1 && it < ranges.length) {
      if (isBetween(x, ranges[it].range[0], ranges[it].range[1] - 1)) {
        rangeIndex = it;
      }
      it = it + 1;
    }
    return { rangeIndex, x, mouseY };
  };

  const cutAtPoint = (x, rangeIndex) => {
    const bounds = ranges[rangeIndex].range;
    const newRange1 = [bounds[0], x];
    const newRange2 = [x, bounds[1]];

    setRanges((prev) => {
      let arr = [...prev];
      arr.splice(rangeIndex, 1);
      insertIntoArrayWithSplicingOverlappingItems(arr, newRange1, maxValue);
      insertIntoArrayWithSplicingOverlappingItems(arr, newRange2, maxValue);
      return arr;
    });
    setSelectedItems([]);
    setActiveButton("");
  };

  const addNewRange = (val) => {
    if (val[0] !== val[1]) {
      setRanges((prev) => {
        let arr = [...prev];
        insertIntoArrayWithSplicingOverlappingItems(arr, val, maxValue);
        return arr;
      });
      setSelectedItems([]);
    }
  };

  const removeRange = (index) => {
    setRanges((prev) => {
      let arr = [...prev];
      arr.splice(index, 1);
      return arr;
    });
  };

  const addNewRangeToSelectedItems = (e, day, rangeIndex) => {
    let newSelected = day + "-" + rangeIndex;
    let index = -1;
    let whereToInsert = -1;
    for (let it = 0; it < selectedItems.length; it++) {
      if (selectedItems[it] === newSelected) {
        index = it;
      }
      let parts = selectedItems[it].split("-").map((x) => parseInt(x));
      if (whereToInsert === -1) {
        if (parts[0] > day) {
          whereToInsert = it;
        } else if (parts[0] === day) {
          if (parts[1] > rangeIndex) {
            whereToInsert = it;
          }
        }
      }
    }

    setSelectedItems((prev) => {
      let arr = [...prev];
      if (index !== -1) {
        if (e.shiftKey) {
          arr.splice(index, 1);
        } else {
          arr = [newSelected];
        }
      } else {
        if (e.shiftKey) {
          if (whereToInsert !== -1) {
            arr.splice(whereToInsert, 0, newSelected);
          } else {
            arr = arr.concat([newSelected]);
          }
        } else {
          arr = [newSelected];
        }
      }

      return arr;
    });
  };

  const inputhandlers = {
    mainOnChange: (val, x, i, day) => {
      setRanges((prev) => {
        let arr = [...prev];
        setInnerTooltipPosition(prev[i].range[0] !== val[0] ? "start" : "end");
        arr[i].range = val;
        arr[i].from = maxValue;

        return arr;
      });

      if (["move", "copy"].includes(activeButton)) {
        setMovingRange((prev) =>
          Object.assign({}, prev, { range: val, from: maxValue })
        );
      }
    },
    mainOnAfterChange: (val, x, i, day) => {
      pageRef.current.focus({ preventScroll: true }); // this is necesary for zooming funcionality, page ref has keydown listener.
      if (!["move", "copy"].includes(activeButton)) {
        if (val[0] === val[1]) {
          removeRange(i);
        } else {
          setRanges((prev) => {
            let arr = [...prev];
            arr.splice(i, 1);
            insertIntoArrayWithSplicingOverlappingItems(arr, val, maxValue);
            return arr;
          });
        }
      }
    },
    newRangeOnChange: (val) => {
      let finalValue = val;
      let { captured, tried } = initialNewRangeValue.current;
      if (!captured && tried < 4) {
        if (initialNewRangeValue.current.value[0] > finalValue[0]) {
          finalValue[1]++;
          initialNewRangeValue.current.captured = true;
        }
        initialNewRangeValue.current.tried++;
      }

      setInnerTooltipPosition(finalValue[0] !== newRange[0] ? "start" : "end");

      if (val[1] !== undefined) {
        setNewRange(newRange.length ? finalValue : [val[1], val[1]]);
      }
    },
    newRangeOnAfterChange: () => {
      pageRef.current.focus({ preventScroll: true }); // this is necesary for zooming funcionality, page ref has keydown listener.
      addNewRange(newRange);
      setNewRange([]);
    },

    newRangeOnBeforeChange: (val) => {
      initialNewRangeValue.current = { captured: false, value: val, tried: 0 };
    },
  };

  const decideWhichRangeInputShoudBeActive = (e) => {
    let { rangeIndex, x } = parseMouseEvent(e);
    setActive(rangeIndex);
    if (!dragging) {
      rangeIndex === -1 ? setNewRange([x, x]) : setNewRange([]);
    }
  };

  const tooltipProps = {
    newRange,
    maxValue,
    totalMinutes,
    hourFormat,
    dayName,
    theme,
    tooltipWidth,
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ height: cellHeight, marginBottom: spaceBetweenTimelines }}
      className={`w-100 position-relative`}
      onMouseMove={(e) => {
        decideWhichRangeInputShoudBeActive(e);
      }}
      onMouseEnter={() => {
        setMovingRange((prev) => {
          return Object.assign({}, prev, { day });
        });
      }}
      onMouseLeave={() => {
        setActive(-2);
        if (activeButton === "move" && dragging && active > -1) {
          setMovingRange((prev) =>
            Object.assign({}, prev, {
              day: -1,
            })
          );
        }
      }}
    >
      {movingRange.day === day && movingRange.range.length ? (
        <div
          style={movingRangeContainerStyle(movingRange, -1, false)}
          id="moving-range"
        >
          <div className="position-relative h-100">
            <RangeLabel
              rangeLabelHeight={rangeLabelHeight}
              className="d-flex align-items-center justify-content-center"
              style={{
                transform: `translateY(${
                  (cellHeight - rangeLabelHeight - 6) / 2
                }px)`,
                background: theme.tertiary,
              }}
            >
              {dayName.substring(0, 3) +
                " " +
                convertMinsToHrsMins(
                  (movingRange.range[0] / maxValue) * totalMinutes
                ) +
                "-" +
                convertMinsToHrsMins(
                  (movingRange.range[1] / maxValue) * totalMinutes
                )}
            </RangeLabel>
          </div>
        </div>
      ) : (
        ""
      )}
      {copiedRange.range.length ? (
        <div
          style={mainRangeContainerStyle(copiedRange, -1, false)}
          id="copied-range"
        >
          <div className="position-relative h-100">
            <RangeLabel
              rangeLabelHeight={rangeLabelHeight}
              style={{
                transform: `translateY(${
                  (cellHeight - rangeLabelHeight - 6) / 2
                }px)`,
                background: theme.tertiary,
              }}
              className="d-flex align-items-center justify-content-center"
            >
              {dayName.substring(0, 3) +
                " " +
                convertMinsToHrsMins(
                  (copiedRange.range[0] / maxValue) * totalMinutes
                ) +
                "-" +
                convertMinsToHrsMins(
                  (copiedRange.range[1] / maxValue) * totalMinutes
                )}
            </RangeLabel>
          </div>
        </div>
      ) : (
        ""
      )}

      {joinAdjacent && !dragging ? (
        <DayTimelineMerged
          totalMinutes={totalMinutes}
          dayName={dayName}
          rangeLabelHeight={rangeLabelHeight}
          timeslots={ranges}
          theme={theme}
          activeRangeIndex={active}
          selectedItems={selectedItems}
          movingRange={movingRange}
          maxValue={maxValue}
          rangeStepWidth={rangeStepWidth}
          day={day}
          cellHeight={cellHeight}
        ></DayTimelineMerged>
      ) : (
        ""
      )}
      {ranges.map((x, i) => {
        const isSelected = selectedItems.includes(day + "-" + i);
        const timeSlotWidth =
          ((rangeStepWidth * (x.range[1] - x.range[0])) / x.from) * maxValue;
        const resizeRangeWidth = rangeStepWidth * (x.range[1] - x.range[0]);
        let resizeTooltipPositionLeft =
          rangeStepWidth * x.range[0] + resizeRangeWidth / 2 - tooltipWidth / 2;
        resizeTooltipPositionLeft =
          resizeTooltipPositionLeft < size.width - tooltipWidth
            ? resizeTooltipPositionLeft >= 0
              ? resizeTooltipPositionLeft
              : 0
            : size.width - tooltipWidth;

        const resizeRangeContainerStyle = {
          position: "absolute",
          top: 0,
          padding: "6px",
          left: rangeStepWidth * ((x.range[0] / x.from) * maxValue),
          height: cellHeight,
          background: theme.secondary,
          width: resizeRangeWidth,
          pointerEvents: "none",
          zIndex: 90,
        };

        const resizeTooltipProps = {
          newRange: x.range,
          maxValue,
          totalMinutes,
          hourFormat,
          dayName,
          theme,
          tooltipWidth,
        };

        const resizeOuterTooltipContainerStyle = {
          position: "absolute",
          top: `-${cellHeight + 3}px`,
          width: tooltipWidth + 100,
          left: resizeTooltipPositionLeft,
          height: cellHeight,
          zIndex: 24,
        };

        return (
          <React.Fragment key={`day-${day}-range-${i}`}>
            <div
              onMouseDown={(e) => {
                e.persist();
                e.stopPropagation();
                setDragging(true);
                addNewRangeToSelectedItems(e, day, i);
                if (["move", "copy"].includes(activeButton)) {
                  setMovingRange((prev) =>
                    Object.assign({}, prev, {
                      range: x.range,
                      from: x.from,
                      day: day,
                      originDay: day,
                      rangeIndex: i,
                      released: false,
                    })
                  );
                }
                if (activeButton === "copy") {
                  setCopiedRange((prev) =>
                    Object.assign({}, prev, { range: x.range, from: x.from })
                  );
                }
              }}
              className="position-absolute w-100"
              style={{
                top: 0,
                left: -handlePushConstant / 1.5,
                zIndex: isSelected ? 50 : active === i ? 25 : 0,
              }}
            >
              <Range
                value={x.range.map((b) => (b / x.from) * maxValue)}
                onChange={(val) => inputhandlers.mainOnChange(val, x, i, day)}
                onAfterChange={(val) =>
                  inputhandlers.mainOnAfterChange(val, x, i, day)
                }
                step={1}
                max={maxValue}
                min={0}
                draggableTrack
                allowCross
                handleStyle={[resizeHandleStyle, resizeHandleStyle]}
                trackStyle={[Object.assign({}, baseTrackStyle, { opacity: 0 })]}
                railStyle={{ backgroundColor: "rgba(233,233,233, 0)" }}
              />
            </div>
            {dragging && isSelected ? (
              <React.Fragment>
                {resizeRangeWidth < tooltipWidth + 10 && (
                  <div style={resizeOuterTooltipContainerStyle}>
                    <div style={{ height: cellHeight - 12 }}>
                      <Tooltip {...resizeTooltipProps}></Tooltip>
                    </div>
                    <div className="triangle-down mx-auto"></div>
                  </div>
                )}
                <div
                  className="position-absolute"
                  style={{
                    top: 0,
                    zIndex: 24,
                  }}
                >
                  <div className="position-relative">
                    <div style={resizeRangeContainerStyle}>
                      <div
                        className={`w-100 d-flex justify-content-${innerTooltipPosition} h-100`}
                      >
                        {resizeRangeWidth >= tooltipWidth + 10 && (
                          <Tooltip {...resizeTooltipProps}></Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div style={mainRangeContainerStyle(x, i, isSelected)}>
                <div className="position-relative h-100 d-flex align-items-center align-items-center justify-content-center">
                  {timeSlotWidth >= 146 ? (
                    <RangeLabel
                      rangeLabelHeight={rangeLabelHeight}
                      style={{
                        opacity: !joinAdjacent || dragging ? 1 : 0,
                        minWidth: "146px",
                        width: "146px",
                        alignSelf: "center",
                        position: "relative !important",
                        left: "0px",
                        overflow: "hidden",
                        transition: "all 0.4s ease-in-out",
                        transform: isSelected
                          ? `translateY(-${rangeLabelHeight / 2 + 15}px)`
                          : `translateY(${0}px)`,
                        background: isSelected
                          ? theme.secondary
                          : theme.tertiary,
                      }}
                      className="d-flex align-items-center justify-content-center static"
                    >
                      {dayName.substring(0, 3) +
                        ` ` +
                        convertMinsToHrsMins(
                          (x.range[0] / maxValue) * totalMinutes
                        ) +
                        `-` +
                        convertMinsToHrsMins(
                          (x.range[1] / maxValue) * totalMinutes
                        )}
                    </RangeLabel>
                  ) : (
                    <HtmlTooltip
                      open={isSelected || active === i}
                      style={{ zIndex: 999, position: "relative" }}
                      interactive
                      placement="bottom-start"
                      title={
                        <RangeLabel
                          rangeLabelHeight={rangeLabelHeight}
                          style={{
                            opacity: !joinAdjacent || dragging ? 1 : 0,
                            minWidth: "146px",
                            width: "146px",
                            alignSelf: "center",
                            position: "relative !important",
                            left: "0px",
                            overflow: "hidden",
                            transition: "all 0.4s ease-in-out",
                            background: isSelected
                              ? theme.secondary
                              : theme.tertiary,
                          }}
                          className="d-flex align-items-center justify-content-center static"
                        >
                          {dayName.substring(0, 3) +
                            ` ` +
                            convertMinsToHrsMins(
                              (x.range[0] / maxValue) * totalMinutes
                            ) +
                            `-` +
                            convertMinsToHrsMins(
                              (x.range[1] / maxValue) * totalMinutes
                            )}
                        </RangeLabel>
                      }
                    >
                      <div
                        style={{
                          zIndex: 999,
                          opacity: !joinAdjacent || dragging ? 1 : 0,
                          alignSelf: "center",
                          position: "relative !important",
                          left: "0px",
                          overflow: "hidden",
                          transition: "all 0.4s ease-in-out",
                          cursor: "pointer",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          transform: isSelected
                            ? `translateY(-${rangeLabelHeight / 2 + 15}px)`
                            : `translateY(${0}px)`,
                          background: isSelected
                            ? theme.secondary
                            : theme.tertiary,
                        }}
                      />
                    </HtmlTooltip>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}

      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          if (activeButton === "cut") {
            const { x, rangeIndex } = parseMouseEvent(e);
            if (rangeIndex >= 0) {
              cutAtPoint(x, rangeIndex);
            }
          }
        }}
        style={cutLayerStyle}
      ></div>

      <div
        onMouseDown={(e) => {
          if (!e.shiftKey) {
            setSelectedItems([]);
          }
        }}
        className="position-absolute"
        style={{
          top: 0,
          width: size.width,
          left: rangeStepWidth / 2,
          zIndex: active === -1 ? 15 : 0,
        }}
      >
        <div>
          <Range
            onBeforeChange={inputhandlers.newRangeOnBeforeChange}
            value={newRange}
            onChange={inputhandlers.newRangeOnChange}
            onAfterChange={inputhandlers.newRangeOnAfterChange}
            step={1}
            max={maxValue}
            draggableTrack
            allowCross
            handleStyle={newRange.map((x) => newRangeHandleStyle(active, x))} //arber
            trackStyle={[{ opacity: 0 }]}
            railStyle={{ backgroundColor: "rgba(233,233,233 ,0)" }}
          />
        </div>
      </div>
      {newRange.length === 2 && newRange[0] !== newRange[1] && (
        <React.Fragment>
          {newRangeWidth < tooltipWidth + 10 && (
            <div style={outerTooltipContainerStyle}>
              <div style={{ height: cellHeight - 12 }}>
                <Tooltip {...tooltipProps}></Tooltip>
              </div>
              <div className="triangle-down mx-auto"></div>
            </div>
          )}
          <div
            className="position-absolute"
            style={{
              top: 0,
              zIndex: 24,
            }}
          >
            <div className="position-relative">
              <div style={newRangeContainerStyle}>
                <div
                  className={`w-100 d-flex justify-content-${innerTooltipPosition} h-100`}
                >
                  {newRangeWidth >= tooltipWidth + 10 && (
                    <Tooltip {...tooltipProps}></Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

// const clickOutsideConfig = {
//   handleClickOutside: () => DayTimeline.handleClickOutside
// };

// export default withTheme(onClickOutside(DayTimeline, clickOutsideConfig));
export default withTheme(DayTimeline);
