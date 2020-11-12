import clsx from 'clsx';
import Dashboard from 'components/Dashboard/Dashboard';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useStateAndLocalStorage } from 'persistence-hooks';
import React, { FC, useCallback, useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { RouteComponentProps, useHistory } from 'react-router';
import {
  useQueryParam,
  NumberParam,
  StringParam,
  withDefault,
  ArrayParam,
  BooleanParam,
} from 'use-query-params';

import { Button, Fab, Grow, Slide } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import CustomChip from '../components/CustomChip';
import { Row } from '../components/Dashboard/Chart';
import { CustomAutocomplete } from '../components/Dashboard/Select';
import MultiChart from '../components/MultiChart';
import { showInfoSnackBar } from '../components/Snackbar';
import useDataStore from '../data/dataStore';
import { animationTime, GLOBAL_PAPER_OPACITY } from '../utils/consts';
import countryToCode from '../utils/countryToCode';
import generateNewColors from '../utils/generateNewColors';
import last from '../utils/last';
import createPersistedState from '../utils/memoryState';
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
const useMemoryStateA = createPersistedState();

const ComparisonPage: FC<RouteComponentProps<{ country: string }>> = observer((props) => {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useState<string>(null);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const dataStore = useDataStore();
  const [colors, setColors] = useMemoryStateA<{ [country: string]: string }>({});
  const [countries, setCountries] = useQueryParam<string[]>('c', withDefault(ArrayParam, []));
  const history = useHistory();
  const [shownSnackbar, setShownSnackbar] = useStateAndLocalStorage(false, 'shownLogLinSnackbar');
  const [logScale, setLogScale] = useQueryParam<boolean>('log_scale', withDefault(BooleanParam, 0));

  useEffect(() => {
    if (!shownSnackbar && dataStore.ready) {
      showInfoSnackBar(
        'Use the button on the top bar to switch between logarithmic and linear scales 🤓'
      );
      setShownSnackbar(true);
    }
  }, [shownSnackbar, dataStore.ready, setShownSnackbar]);

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

  const resetGraph = () => {
    setTimeout(() => {
      setLogScale((prev) => !prev);
      setTimeout(() => {
        setLogScale((prev) => !prev);
      }, 10);
    }, 1);
  };

  const addCountries = useCallback(
    (newCountries: string[]) => {
      resetGraph();
      setCountries((prevCountries: string[]) => [...new Set([...newCountries, ...prevCountries])]);
    },
    [setCountries]
  );

  const addMostCasesCountries = useCallback(() => {
    const newCountries = dataStore.possibleCountriesSortedByCases.slice(0, 8);
    if (
      newCountries.length !== countries.length ||
      newCountries.some((value, index) => value !== countries[index])
    ) {
      resetGraph();
      setCountries(newCountries);
      setSelectedCountry(null);
    }
  }, [countries, setCountries, dataStore.possibleCountriesSortedByCases]);

  const addMostDeathsCountries = useCallback(() => {
    const newCountries = dataStore.possibleCountriesSortedByDeaths.slice(0, 8);
    if (
      newCountries.length !== countries.length ||
      newCountries.some((value, index) => value !== countries[index])
    ) {
      resetGraph();
      setCountries(newCountries);
      setSelectedCountry(null);
    }
  }, [countries, setCountries, dataStore.possibleCountriesSortedByDeaths]);

  useEffect(() => {
    const r = reaction(
      () => dataStore.ready,
      () => {
        if (!countries || countries.length === 0) {
          addMostCasesCountries();
        }
      }
    );

    return r;
  }, [countries]);

  const routeChange = (country: string) => {
    history.push(`/dashboard/${country}`);
  };

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
        {logScale ? <>Scale: LOG.</> : <>Scale: LIN.</>}
      </Fab>
    );
  };

  return (
    <Dashboard title={`Infection trajectories`} Icon={LogScaleSwitch}>
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
              color='default'
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
                countries.map((country: string, i: number) => {
                  const cc = countryToCode(country);
                  return (
                    <CustomChip
                      avatar={
                        cc ? (
                          <ReactCountryFlag
                            countryCode={cc}
                            svg
                            style={{ marginTop: 1, borderRadius: '50%' }}
                          />
                        ) : null
                      }
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        routeChange(country);
                      }}
                      key={i}
                      handleDelete={() => {
                        setCountries(countries.filter((c) => c !== country));
                        resetGraph();
                      }}
                      label={country}
                      backgroundColor={colors[country]}
                    />
                  );
                })}
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
