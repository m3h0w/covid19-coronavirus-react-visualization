import React, { useState, useEffect, useCallback, FC } from 'react';
import Dashboard from 'components/Dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CustomAutocomplete } from '../components/Dashboard/Select';
import { makeStyles } from '@material-ui/core/styles';
import Chart from '../components/Dashboard/Chart';
import CurrentCount from '../components/Dashboard/CurrentCount';
import clsx from 'clsx';
import { csv } from 'd3-request';
import confirmedCsvUrl from '../data/confirmed.csv';
import deathsCsvUrl from '../data/deaths.csv';
import { Row } from '../components/Dashboard/Chart';
import MultiChart from '../components/Dashboard/MultiChart';
import { Chip, Button, createStyles, Grow, Slide, Fab } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import Colors from '../utils/colors';
import createPersistedState from '../utils/memoryState';
import { useHistory, RouteComponentProps } from 'react-router';
import extractKeyFromNestedObj from '../utils/extractKeyFromNestedObj';
import { getContrastYIQ } from '../utils/colors';
import CustomChip from '../components/CustomChip';
import { animationTime, GLOBAL_PAPER_OPACITY } from '../utils/consts';
import sort from '../utils/sort';
import last from '../utils/last';
import ReactCountryFlag from 'react-country-flag';
import countryToCode from '../utils/countryToCode';
import generateNewColors from '../utils/generateNewColors';

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
    height: '60vh',
  },
  clipWrapper: {
    display: 'flex',
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
  logScaleSwitch: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 8,
    },
  },
}));

interface IRowData {
  confirmed: Row | undefined;
  dead: Row | undefined;
}

let colorsHelper = new Colors();
const useMemoryStateA = createPersistedState();
const useMemoryStateB = createPersistedState();

const ComparisonPage: FC<RouteComponentProps<{ country: string }>> = observer((props) => {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const dataStore = useDataStore();
  const [colors, setColors] = useMemoryStateA<{ [country: string]: string }>({});
  const [countries, setCountries] = useMemoryStateB<string[]>([]);
  const history = useHistory();

  // console.log({ colors });

  const getNewColors = useCallback(() => {
    const newColors = generateNewColors(countries.length);
    setColors(
      newColors.reduce((colorsObj, color, index) => {
        colorsObj[countries[index]] = color;
        return colorsObj;
      }, {})
    );
  }, [setColors, countries]);

  useEffect(() => {
    getNewColors();
  }, [getNewColors, countries]);

  const addCountries = (newCountries: string[]) => {
    setTimeout(() => {
      setLogScale(false);
      setTimeout(() => {
        setLogScale(true);
      }, 10);
    }, 1);
    setCountries([...new Set([...newCountries, ...countries])]);
  };

  useEffect(() => {
    if (props.match.params.country) {
      let countryFromUrl = props.match.params.country;
      if (countryFromUrl) {
        countryFromUrl = countryFromUrl.replace(/^\w/, (c) => c.toUpperCase());
        history.push(`/infection-trajectories`);
        addCountries(['Italy', countryFromUrl]);
      }
    } else {
      addCountries(['Italy', 'Germany']);
    }
  }, []);

  const routeChange = (country: string) => {
    history.push(`/dashboard/${country}`);
  };

  const [logScale, setLogScale] = useState(true);
  const LogScaleSwitch = () => {
    return (
      <Fab
        onClick={() => {
          setLogScale(!logScale);
        }}
        variant='extended'
        size='small'
        color='primary'
        aria-label='add'
        className={classes.logScaleSwitch}
      >
        {logScale ? (
          <>
            {/* <LocalHospitalIcon /> */}
            Scale: LOG.
          </>
        ) : (
          <>
            {/* <AirlineSeatFlatIcon /> */}
            Scale: LIN.
          </>
        )}
      </Fab>
    );
  };

  const addMostCasesCountries = () => {
    setTimeout(() => {
      setLogScale(false);
      setTimeout(() => {
        setLogScale(true);
      }, 10);
    }, 1);
    setCountries(dataStore.possibleCountriesSortedByCases.slice(0, 8));
  };

  const addMostDeathsCountries = () => {
    setTimeout(() => {
      setLogScale(false);
      setTimeout(() => {
        setLogScale(true);
      }, 10);
    }, 1);
    setCountries(dataStore.possibleCountriesSortedByDeaths.slice(0, 8));
  };

  return (
    <Dashboard title='Infection trajectories' Icon={LogScaleSwitch}>
      <Grid item xs={12} sm={5} md={3}>
        <Slide
          direction='down'
          in={dataStore.ready}
          mountOnEnter
          unmountOnExit
          timeout={animationTime}
        >
          <Paper className={classes.paper}>
            <CustomAutocomplete
              label={'Add country'}
              handleChange={(country) => {
                if (country) {
                  addCountries([country]);
                }
                setSelectedCountry(null);
              }}
              selectedValue={selectedCountry}
              possibleValues={sort(
                dataStore.countriesWithOver100Cases,
                (a, b) =>
                  dataStore.getCountryData(b)?.confirmed[last(dataStore.datesConverted)] -
                  dataStore.getCountryData(a)?.confirmed[last(dataStore.datesConverted)]
              ).filter((country) => !countries.includes(country))}
              id={'select-country'}
              width={'auto'}
            />
            <Button
              style={{ maxWidth: 300, marginBottom: 10 }}
              variant='outlined'
              color='secondary'
              size={'small'}
              onClick={() => {
                getNewColors();
              }}
            >
              New colors
            </Button>
            <Button
              style={{ maxWidth: 300, marginBottom: 10 }}
              variant='outlined'
              color='primary'
              size={'small'}
              onClick={() => {
                addMostCasesCountries();
              }}
            >
              Most cases
            </Button>
            <Button
              style={{ maxWidth: 300, marginBottom: 10 }}
              variant='outlined'
              color='initial'
              size={'small'}
              onClick={() => {
                addMostDeathsCountries();
              }}
            >
              Most deaths
            </Button>
          </Paper>
        </Slide>
      </Grid>
      <Grid item xs={12} sm={7} md={9}>
        <Grow in={dataStore.ready} timeout={animationTime}>
          <Paper className={classes.paper}>
            <div className={classes.clipWrapper}>
              {dataStore.ready &&
                countries.map((country: string, i: number) => (
                  <CustomChip
                    avatar={
                      <ReactCountryFlag
                        countryCode={countryToCode(country)}
                        svg
                        style={{ marginTop: 1, borderRadius: '50%' }}
                      />
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      routeChange(country);
                    }}
                    key={i}
                    handleDelete={() => {
                      setCountries(countries.filter((c) => c !== country));
                    }}
                    label={country}
                    backgroundColor={colors[country]}
                  />
                ))}
              {Boolean(countries.length) && (
                <CustomChip
                  backgroundColor={'#000'}
                  label={'Remove all'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setCountries([]);
                  }}
                  handleDelete={() => {
                    setCountries([]);
                  }}
                />
              )}
            </div>
          </Paper>
        </Grow>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grow in={dataStore.ready} timeout={animationTime}>
          <Paper className={fixedHeightPaper}>
            <MultiChart
              title={'Cases trajectory'}
              yLabel={'No. cases'}
              countries={countries}
              dataType={'confirmed'}
              colors={colors}
              syncId={'compariso1n'}
              logScale={logScale}
            />
          </Paper>
        </Grow>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grow in={dataStore.ready} timeout={animationTime}>
          <Paper className={fixedHeightPaper}>
            <MultiChart
              title={'Deaths trajectory'}
              yLabel={'No. deaths'}
              countries={countries}
              dataType={'dead'}
              colors={colors}
              syncId={'comparison'}
              logScale={logScale}
            />
          </Paper>
        </Grow>
      </Grid>
    </Dashboard>
  );
});

export default ComparisonPage;
