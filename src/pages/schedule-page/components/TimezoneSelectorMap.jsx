
/* global process */
import React from "react";
import PropTypes from "prop-types";
import { Paper, Box, Typography, Fade } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { SizeMe } from "react-sizeme";
import TextField from "@material-ui/core/TextField";
import { Skeleton } from "@material-ui/lab";
import TimezoneMapGL, { Provider } from "./ReactTimezoneMapGL";
import timezoneTopo from "./ReactTimezoneMapGL/data/timezoneTopo.json";
import "mapbox-gl/dist/mapbox-gl.css";

const styles = (theme) => ({
  root: {
    // width: "80%",
    padding:"0px",
    paddingTop:" 3em",
  },
  heading: {
    color: "#2d2d61",
    fontSize: 22,
  },
  paper: {
    margin: "auto",
    marginTop: theme.spacing(1),
    width: "100%",
    borderRadius: 4,
  },
  name: {
    marginBottom: "10px",
    fontSize: 100,
  },
});

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

class TimezoneSelectorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTimezone: {
        label:
          this.props.scheduleTimezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        value:
          this.props.scheduleTimezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      loading: true,
      name: this.props.scheduleName,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.scheduleTimezone !== state.selectTimezone.value) {
      return {
        selectTimezone: {
          label:
            props.scheduleTimezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          value:
            props.scheduleTimezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };
    }
    return state;
  }

  componentDidMount() {
    if (this.state.selectTimezone.value) {
      this.props.setTimezone(this.state.selectTimezone.value);
    }
  }

  componentWillUnmount() {
    if (this.state.name) {
      this.props.setScheduleName(this.state.name);
    }
    if (this.props.scheduleTimezone) {
      this.setState(
        {
          selectTimezone: {
            label:
              this.props.scheduleTimezone ||
              Intl.DateTimeFormat().resolvedOptions().timeZone,
            value:
              this.props.scheduleTimezone ||
              Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
        () => {
          this.props.setTimezone(this.state.selectTimezone.value);
        }
      );
    } else {
      this.props.setTimezone(this.state.selectTimezone.value);
    }
  }

  handleChange = (value) => this.setState({ selectTimezone: value });

  handleTimezoneClick = (event, timezoneName) => {
    this.setState({
      selectTimezone: {
        label: timezoneName,
        value: timezoneName,
      },
    });
    this.props.setTimezone(timezoneName);
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    }); //not necessary

    this.props.changedName(e, e.target.value);
  };

  render() {
    const { classes } = this.props;
    const { selectTimezone } = this.state;

    return (
      <SizeMe>
        {({ size }) => {
          return (
            <Box className={classes.root}>
              <Box>
                <TextField
                  id="schedule-name"
                  label="Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={this.state.name}
                  className={classes.name}
                  onChange={this.handleNameChange}
                />
                {/* <TimezoneSelect value={selectTimezone} onChange={this.handleChange} /> */}
                <Box mt={2}>
                  <Typography className={classes.heading}>
                    Select Timezone
                  </Typography>
                </Box>
                <Paper className={classes.paper}>
                  <Provider value={timezoneTopo}>
                    <Fade in={this.state.loading}>
                      <Box
                        position="absolute"
                        bgcolor="#fafafa"
                        width={1}
                        height={700}
                      >
                        <Skeleton
                          animation="wave"
                          variant="rect"
                          height={700}
                        />
                      </Box>
                    </Fade>

                    <Fade in={!this.state.loading}>
                      <Box>
                        <TimezoneMapGL
                          onLoad={() =>
                            this.setState({
                              loading: false,
                            })
                          }
                          timezone={selectTimezone.value}
                          mapboxApiAccessToken={MAPBOX_TOKEN}
                          onTimezoneClick={this.handleTimezoneClick}
                          className={` arber`}
                          defaultViewport={{
                            width: size.width,
                            height:
                              size.width * 0.45 < 500 ? 500 : size.width * 0.45,
                            zoom: 1.8,
                          }}
                        ></TimezoneMapGL>
                      </Box>
                    </Fade>
                  </Provider>
                </Paper>
              </Box>
            </Box>
          );
        }}
      </SizeMe>
    );
  }
}

TimezoneSelectorMap.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimezoneSelectorMap);
