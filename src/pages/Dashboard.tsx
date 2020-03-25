import React, { useState, useEffect, FC } from 'react';
import Dashboard from 'components/Dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CustomAutocomplete } from '../components/Dashboard/Select';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chart from '../components/Dashboard/Chart';
import CurrentCount from '../components/Dashboard/CurrentCount';
import clsx from 'clsx';
import createPersistedState from '../utils/memoryState';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import { useHistory, RouteComponentProps } from 'react-router';
import {
  Typography,
  Card,
  ButtonBase,
  Slide,
  Grow,
  Fade,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@material-ui/core';
import { animationTime, US_NAME, GLOBAL_PAPER_OPACITY } from '../utils/consts';
import UsaMapChart from '../components/UsaMapChart';
import last from '../utils/last';
import ReactTooltip from 'react-tooltip';
import { showInfoSnackBar } from '../components/Snackbar';
import Collapsable from '../components/Collapsable';
import sort from '../utils/sort';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    color: 'white',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 15,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
    maxHeight: '80vh',
  },
}));

const useMemoryState = createPersistedState();
const useMemoryState2 = createPersistedState();
const useMemoryState3 = createPersistedState();

const DashboardPage: FC<RouteComponentProps> = observer((props) => {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useState(props.match.params.country || US_NAME);
  const [selectedRegion, setSelectedRegion] = useMemoryState2('');
  const dataStore = useDataStore();
  const possibleCountries = dataStore.possibleCountries;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const history = useHistory();
  const theme = useTheme();
  const [tooltipContent, setTooltipContent] = useState();
  const [shownUsInfoSnack, setShownUsInfoSnack] = useMemoryState3(false);
  // const [dataType, setDataType] = useState<'dead' | 'confirmed'>('confirmed');

  const selectCountry = (country: string) => {
    if (possibleCountries.includes(country)) {
      setSelectedCountry(country);
      setSelectedRegion(null);
    }
  };

  const selectRegion = (region: string) => {
    if (dataStore.possibleRegions.includes(region) || region === null) {
      setSelectedRegion(region);
    }
  };

  useEffect(() => {
    if (selectedCountry && !selectedRegion) {
      history.push(`/dashboard/${selectedCountry}`);
    }
    if (selectedCountry && selectedRegion) {
      history.push(`/dashboard/${selectedCountry}/${selectedRegion}`);
    }
  }, [selectedCountry, selectedRegion]);

  useEffect(() => {
    if (!shownUsInfoSnack && selectedCountry === US_NAME) {
      showInfoSnackBar(
        `The state-wise data for United States has been last updated on the 22nd of March. We're working on it 🙂`
      );
      setShownUsInfoSnack(true);
    }
  }, [shownUsInfoSnack, selectedCountry]);

  useEffect(() => {
    let countryFromUrl = props.match.params.country;
    if (countryFromUrl) {
      countryFromUrl = countryFromUrl.replace(/^\w/, (c) => c.toUpperCase());
      selectCountry(countryFromUrl);
    }
  }, [props.match.params.country, history, setSelectedCountry]);

  let rowData = dataStore.getCountryData(selectedCountry);
  if (selectedRegion) {
    rowData = dataStore.getRegionData(selectedRegion);
  }

  const cases =
    (rowData &&
      rowData.confirmed &&
      (Object.values(rowData.confirmed)[Object.values(rowData.confirmed).length - 1] as number)) ||
    0;
  const deaths =
    (rowData &&
      rowData.dead &&
      (Object.values(rowData.dead)[Object.values(rowData.dead).length - 1] as number)) ||
    0;
  const mortalityRate = cases ? deaths / cases : undefined;
  const isUs = selectedCountry === US_NAME;

  const getRegionCases = (region) =>
    dataStore.getRegionData(region)?.confirmed[last(dataStore.regionDatesConverted)];
  const getRegionDeaths = (region) =>
    dataStore.getRegionData(region)?.dead[last(dataStore.regionDatesConverted)];
  const hasRegions = Boolean(dataStore.getPossibleRegionsByCountry(selectedCountry).length);

  return (
    <Dashboard title='Country dashboard'>
      <Grid item xs={12} md={3}>
        <Slide
          direction='down'
          in={dataStore.ready}
          mountOnEnter
          unmountOnExit
          timeout={animationTime}
        >
          <Paper className={classes.paper} style={{ height: 155 }}>
            <CustomAutocomplete
              label={'Select country'}
              handleChange={(v) => {
                selectCountry(v);
              }}
              selectedValue={selectedCountry}
              possibleValues={sort(
                dataStore.possibleCountries,
                (a, b) =>
                  dataStore.getCountryData(b)?.confirmed[last(dataStore.datesConverted)] -
                  dataStore.getCountryData(a)?.confirmed[last(dataStore.datesConverted)]
              )}
              id={'select-country'}
              width={'auto'}
            />
            {hasRegions ? (
              <CustomAutocomplete
                label={'Select region'}
                handleChange={selectRegion}
                selectedValue={selectedRegion}
                possibleValues={dataStore.getPossibleRegionsByCountry(selectedCountry)}
                id={'select-region'}
                width={'auto'}
              />
            ) : null}
          </Paper>
        </Slide>
        <div style={{ height: 31 }} />
        <Grow in={dataStore.ready} timeout={animationTime}>
          <Paper className={classes.paper} style={{ padding: 0 }}>
            {rowData && rowData.confirmed && rowData.dead && (
              <CurrentCount
                style={{ padding: 15 }}
                confirmedCases={cases}
                deaths={deaths}
                mortalityRate={mortalityRate}
              />
            )}
            {hasRegions ? (
              <Collapsable>
                <Table size='small' aria-label='a dense table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Region / State</TableCell>
                      <TableCell align='right'>Cases</TableCell>
                      <TableCell align='right'>Deaths</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sort(
                      dataStore.getPossibleRegionsByCountry(selectedCountry),
                      (a, b) => getRegionCases(b) - getRegionCases(a)
                    ).map((region) => {
                      return (
                        <TableRow
                          key={region}
                          onClick={() => {
                            selectRegion(region);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell component='th' scope='row'>
                            {region}
                          </TableCell>
                          <TableCell align='right'>{getRegionCases(region)}</TableCell>
                          <TableCell align='right'>{getRegionDeaths(region)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Collapsable>
            ) : null}
          </Paper>
        </Grow>
      </Grid>
      <Grid item xs={12} md={9}>
        <Grow in={dataStore.ready} timeout={animationTime}>
          <Paper className={fixedHeightPaper}>
            <Chart
              showingDataFor={selectedRegion || selectedCountry}
              rowData={rowData}
              dates={dataStore.dates}
            />
          </Paper>
        </Grow>
        <div style={{ height: 15 }} />
        <Grow in={dataStore.ready} timeout={animationTime}>
          <Card style={{ width: '100%' }}>
            <ButtonBase
              className={classes.paper}
              style={{
                backgroundColor: theme.palette.secondary.main,
                cursor: 'pointer',
                width: '100%',
              }}
              onClick={() => {
                history.push(`/infection-trajectories/${selectedCountry}`);
              }}
            >
              <Typography variant='h5'>Compare infection trajectories</Typography>
            </ButtonBase>
          </Card>
        </Grow>
      </Grid>
      <Grid item xs={12}>
        {isUs && (
          <>
            <Card style={{ position: 'relative' }}>
              <UsaMapChart
                date={last(dataStore.regionDatesConverted)}
                setTooltipContent={setTooltipContent}
                dataType={'confirmed'}
                style={{ maxHeight: '80vh' }}
                onClick={(stateKey) => {
                  selectRegion(stateKey);
                }}
                selectedRegion={selectedRegion}
              />
              <Typography
                variant='h4'
                color={'primary'}
                style={{ position: 'absolute', bottom: 0, right: 5 }}
              >
                Confirmed cases
              </Typography>
            </Card>
            <ReactTooltip>{tooltipContent}</ReactTooltip>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        {isUs && (
          <>
            <Card style={{ position: 'relative' }}>
              <UsaMapChart
                date={last(dataStore.regionDatesConverted)}
                setTooltipContent={setTooltipContent}
                dataType={'dead'}
                style={{ maxHeight: '80vh' }}
                onClick={(stateKey) => {
                  selectRegion(stateKey);
                }}
                selectedRegion={selectedRegion}
              />
              <Typography
                variant='h4'
                color='inital'
                style={{ position: 'absolute', bottom: 0, right: 5 }}
              >
                Deaths
              </Typography>
            </Card>
            <ReactTooltip>{tooltipContent}</ReactTooltip>
          </>
        )}
      </Grid>
      {/* Recent Orders */}
      {/* <Grid item xs={12}>
    <Paper className={classes.paper}>
      <Orders />
    </Paper>
  </Grid> */}
    </Dashboard>
  );
});

export default DashboardPage;
