import Dashboard from 'components/Dashboard/Dashboard';
import Title from 'components/Dashboard/Title';
import MapChart from 'components/MapChart';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useStateAndLocalStorage } from 'persistence-hooks';
import React, { useEffect, useMemo, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useHistory } from 'react-router';
import ReactTooltip from 'react-tooltip';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import {
  Button,
  Card,
  Fab,
  Grow,
  Hidden,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AirlineSeatFlatIcon from '@material-ui/icons/AirlineSeatFlat';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import StopIcon from '@material-ui/icons/Stop';

import Collapsable from '../components/Collapsable';
import getYAxis from '../components/Dashboard/YAxis';
import IOSSlider from '../components/IOSSlider';
import NumberWithTitle from '../components/NumberWithTitle';
import { showInfoSnackBar } from '../components/Snackbar';
import useDataStore from '../data/dataStore';
import useWhoDataStore from '../data/whoDataStore';
import { mdUp, xsDown } from '../utils/breakpoints';
import { GLOBAL_PAPER_OPACITY } from '../utils/consts';
import countryToCode from '../utils/countryToCode';
import generateNewColors from '../utils/generateNewColors';
import last from '../utils/last';
import sort from '../utils/sort';
import numberWithCommas from '../utils/numberWithCommas';
import { StringParam, withDefault, useQueryParam } from 'use-query-params';
const useStyles = makeStyles((theme) => ({
  sliderWrapper: {
    position: 'fixed',
    width: `100vw`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    bottom: 0,
    left: 0,
  },
  sliderPaper: {
    borderRadius: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  slider: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    opacity: `${GLOBAL_PAPER_OPACITY} !important`,
    padding: theme.spacing(2),
    // margin: theme.spacing(2),
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 350,
    maxHeight: '80vh',
  },
  mapCard: { opacity: GLOBAL_PAPER_OPACITY, maxHeight: '90vh' },
  bigNumberContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 10,
    zIndex: 0,
  },
  bigNumber: {
    color: '#DCDFE4' || theme.palette.grey[100],
    fontWeight: 900,
    fontSize: '12vw',
    lineHeight: 0.56,
    marginLeft: -5,
    [theme.breakpoints.up('md')]: {
      marginLeft: -13,
    },
  },
  countryTableCell: {
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.secondary.main,
    },
  },
  numberTableCell: {
    minWidth: '65px',
    padding: '6px 6px',

    [theme.breakpoints.down('xs')]: {},
  },
}));

export type DataType = 'dead' | 'confirmed';

const NumberGrid = observer(({ dataType, setDataType, sliderValue }: { dataType: DataType }) => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const dataStore = useDataStore();
  if (!dataStore.ready) {
    return null;
  }

  const confirmedCases = sliderValue
    ? dataStore.confirmedCasesArray[sliderValue]
    : last(dataStore.confirmedCasesArray);
  const confirmedCasesYesterday = sliderValue
    ? dataStore.confirmedCasesArray[sliderValue - 1]
    : dataStore.confirmedCasesArray[dataStore.confirmedCasesArray.length - 2];
  const deaths = sliderValue ? dataStore.deathsArray[sliderValue] : last(dataStore.deathsArray);
  const deathsYesterday = sliderValue
    ? dataStore.deathsArray[sliderValue - 1]
    : dataStore.deathsArray[dataStore.deathsArray.length - 2];

  const possibleCountries = dataStore.possibleCountries;
  const possibleCountriesByConfirmed = dataStore.possibleCountriesSortedByCases;
  const possibleCountriesByDeaths = dataStore.possibleCountriesSortedByDeaths;
  const possibleCountriesByMortality = useMemo(
    () =>
      sort(possibleCountries, (countryA, countryB) => {
        if (confirmedCases[countryB] < 100) {
          return -1;
        }
        if (confirmedCases[countryA] < 100) {
          return 1;
        }
        if (!confirmedCases[countryB] || !confirmedCases[countryA]) {
          return deaths[countryB] - deaths[countryA];
        } else {
          return (
            deaths[countryB] / confirmedCases[countryB] -
            deaths[countryA] / confirmedCases[countryA]
          );
        }
      }),
    [possibleCountries, confirmedCases, deaths]
  );

  const totalCases = dataStore.totalConfirmedCasesArray[sliderValue]?.totalCases || '';
  const totalCasesYesterday = dataStore.totalConfirmedCasesArray[sliderValue - 1]?.totalCases || '';
  const totalDeaths = dataStore.totalDeathsArray[sliderValue]?.totalDeaths || '';
  const totalDeathsYesterday = dataStore.totalDeathsArray[sliderValue - 1]?.totalDeaths || '';
  const totalCasesChange = totalCasesYesterday
    ? ((totalCases - totalCasesYesterday) / totalCasesYesterday) * 100
    : '';
  const totalDeathsChange = totalDeathsYesterday
    ? ((totalDeaths - totalDeathsYesterday) / totalDeathsYesterday) * 100
    : '';

  let mortalityRate = '';
  if (totalCases) {
    mortalityRate = totalDeaths / totalCases;
  }
  let mortalityRateYesterday = '';
  if (totalCasesYesterday) {
    mortalityRateYesterday = totalDeathsYesterday / totalCasesYesterday;
  }
  let mortalityRateChange = '';
  if (mortalityRate && mortalityRateYesterday) {
    mortalityRateChange = mortalityRate - mortalityRateYesterday;
  }

  const routeChange = (country: string) => {
    history.push(`/dashboard/${country}`);
  };

  const CountryCell = ({ country }: { country: string }) => {
    const cc = countryToCode(country);
    return (
      <TableCell
        onClick={() => {
          routeChange(country);
        }}
        className={classes.countryTableCell}
        component='th'
        scope='row'
      >
        {cc && (
          <ReactCountryFlag style={{ marginTop: -4, marginRight: '3px' }} countryCode={cc} svg />
        )}
        {country}
      </TableCell>
    );
  };

  const ChangeCell = ({ yesterdayChange }: { yesterdayChange: number }) => {
    if (!yesterdayChange) {
      return (
        <TableCell className={classes.numberTableCell} align='right'>
          —
        </TableCell>
      );
    }
    return (
      <TableCell
        className={classes.numberTableCell}
        align='right'
        style={{
          color: yesterdayChange > 1 ? theme.palette.primary.main : theme.palette.secondary.main,
        }}
      >
        {yesterdayChange > 1 && <ArrowUpwardIcon style={{ fontSize: '0.7rem' }} />}
        {yesterdayChange < -1 && <ArrowDownwardIcon style={{ fontSize: '0.7rem' }} />}
        {`${yesterdayChange.toFixed(1)}%`}
      </TableCell>
    );
  };

  const NumberCell = ({ number }: { number: number }) => {
    return (
      <TableCell className={classes.numberTableCell} align='right'>
        {number ? numberWithCommas(number) : '-'}
      </TableCell>
    );
  };

  return (
    <>
      <Grid item lg={4} xs={12}>
        {/* <Grow in={dataStore.ready}> */}
        <Paper className={classes.paper} style={{ padding: 0 }}>
          {totalCasesChange && (
            <Typography
              style={{
                marginTop: '15px',
                marginBottom: '-15px',
                textAlign: 'center',
                color:
                  totalDeathsChange > 1 ? theme.palette.primary.main : theme.palette.secondary.main,
              }}
            >
              {totalCasesChange > 1 && <ArrowUpwardIcon style={{ fontSize: '0.7rem' }} />}
              {totalCasesChange < -1 && <ArrowDownwardIcon style={{ fontSize: '0.7rem' }} />}
              {`${totalCasesChange.toFixed(1)}%`}
            </Typography>
          )}
          <NumberWithTitle
            version='large'
            centered={true}
            color={'primary'}
            title={'Confirmed cases'}
            number={totalCases || ''}
            onClick={() => {
              setDataType('confirmed');
            }}
            style={{ padding: 16 }}
          />
          <Collapsable startingOpen={true}>
            <Table size='small' aria-label='a dense table'>
              <TableBody>
                {possibleCountriesByConfirmed.map((country: string) => {
                  const yesterdayChange = confirmedCasesYesterday[country]
                    ? ((confirmedCases[country] - confirmedCasesYesterday[country]) /
                        confirmedCasesYesterday[country]) *
                      100
                    : undefined;
                  return (
                    <TableRow key={country}>
                      <CountryCell country={country} />
                      <ChangeCell yesterdayChange={yesterdayChange} />
                      <NumberCell number={confirmedCases[country]} />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Collapsable>
        </Paper>
        {/* </Grow> */}
      </Grid>
      <Grid item lg={4} xs={12}>
        {/* <Grow in={dataStore.ready}> */}
        <Paper className={classes.paper} style={{ padding: 0 }}>
          {totalDeathsChange && (
            <Typography
              style={{
                marginTop: '15px',
                marginBottom: '-15px',
                textAlign: 'center',
                color:
                  totalDeathsChange > 1 ? theme.palette.primary.main : theme.palette.secondary.main,
              }}
            >
              {totalDeathsChange > 1 && <ArrowUpwardIcon style={{ fontSize: '0.7rem' }} />}
              {totalDeathsChange < -1 && <ArrowDownwardIcon style={{ fontSize: '0.7rem' }} />}
              {`${totalDeathsChange.toFixed(1)}%`}
            </Typography>
          )}
          <NumberWithTitle
            version='large'
            centered={true}
            color={'initial'}
            title={'Deaths'}
            number={totalDeaths || ''}
            onClick={() => {
              setDataType('dead');
            }}
            style={{ padding: 16 }}
          />
          <Collapsable startingOpen={true}>
            <Table size='small' aria-label='a dense table'>
              <TableBody>
                {possibleCountriesByDeaths.map((country: string) => {
                  const yesterdayChange = deathsYesterday[country]
                    ? ((deaths[country] - deathsYesterday[country]) / deathsYesterday[country]) *
                      100
                    : undefined;
                  return (
                    <TableRow key={country}>
                      <CountryCell country={country} />
                      <ChangeCell yesterdayChange={yesterdayChange} />
                      <NumberCell number={deaths[country]} />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Collapsable>
        </Paper>
        {/* </Grow> */}
      </Grid>
      <Grid item lg={4} xs={12}>
        <Grow in={dataStore.ready}>
          <Paper className={classes.paper} style={{ padding: 0 }}>
            {mortalityRateChange && (
              <Typography
                style={{
                  marginTop: '15px',
                  marginBottom: '-15px',
                  textAlign: 'center',
                  color:
                    mortalityRateChange > 0.0001
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                }}
              >
                {mortalityRateChange > 0.0001 && <ArrowUpwardIcon style={{ fontSize: '0.7rem' }} />}
                {mortalityRateChange < -0.0001 && (
                  <ArrowDownwardIcon style={{ fontSize: '0.7rem' }} />
                )}
                {`${(mortalityRateChange * 100).toFixed(2)}%`}
              </Typography>
            )}
            <NumberWithTitle
              version='large'
              centered={true}
              color={'secondary'}
              title={'Case fatality rate'}
              number={`${(mortalityRate * 100).toFixed(2)}%` || ''}
              style={{ padding: 16 }}
            />
            <Collapsable startingOpen={true}>
              <Table size='small' aria-label='a dense table'>
                <TableBody>
                  {possibleCountriesByMortality.map((country: string) => {
                    return (
                      <TableRow key={country}>
                        <CountryCell country={country} />
                        <NumberCell
                          number={
                            confirmedCases[country]
                              ? `${((deaths[country] / confirmedCases[country]) * 100).toFixed(2)}%`
                              : undefined
                          }
                        />
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Collapsable>
          </Paper>
        </Grow>
      </Grid>
    </>
  );
});

const getSliderValueTextFunc = (dates: string[]) => (value: number) => dates[value];

const MapPage = observer(() => {
  const classes = useStyles();
  const dataStore = useDataStore();
  const [sliderValue, setSliderValue] = useState<number>();
  const [date, setDate] = useState<string>();
  const [tooltipContent, setTooltipContent] = useState();
  const [maxSliderValue, setMaxSliderValue] = useState();
  const [shownSnackbar, setShownSnackbar] = useStateAndLocalStorage(
    false,
    'shownMapSliderSnackbar'
  );
  const [playing, setPlaying] = useState(false);
  const [dataType, setDataType] = useQueryParam<string>(
    'dataType',
    withDefault(StringParam, 'confirmed')
  );

  const [colors, setColors] = useState();
  const whoDataStore = useWhoDataStore();

  useEffect(() => {
    if (whoDataStore.possibleRegions) {
      setColors(generateNewColors(whoDataStore.possibleRegions.length));
    }
  }, [whoDataStore.possibleRegions]);

  useEffect(() => {
    const checkKey = (e) => {
      e = e || window.event;
      if (e.keyCode === '37') {
        setSliderValue((prev) => Math.max(prev - 1, 0));
      } else if (e.keyCode === '39') {
        setSliderValue((prev) => Math.min(prev + 1, maxSliderValue));
      }
    };
    document.addEventListener('onkeydown', checkKey);

    return () => document.removeEventListener('onkeydown', checkKey);
  }, [maxSliderValue]);

  useEffect(() => {
    if (dataStore && dataStore.datesConverted) {
      setMaxSliderValue(dataStore.datesConverted.length - 1);
      setSliderValue(dataStore.datesConverted.length - 1);
    }
  }, [dataStore, dataStore.datesConverted]);

  useEffect(() => {
    if (sliderValue && dataStore && dataStore.datesConverted) {
      setDate(dataStore.datesConverted[sliderValue]);
    }
  }, [sliderValue, dataStore, dataStore.datesConverted]);

  useEffect(() => {
    let s;
    if (playing) {
      if (sliderValue === maxSliderValue) {
        setPlaying(false);
      } else {
        s = setTimeout(() => {
          setSliderValue((prev) => Math.min(prev + 1, maxSliderValue));
        }, 150);
      }
    }
    return () => clearTimeout(s);
  }, [playing, sliderValue, maxSliderValue]);

  useEffect(() => {
    if (!shownSnackbar && dataStore.ready) {
      showInfoSnackBar('Use the slider on the bottom to travel in time 🦋', 5000);
      if (mdUp()) {
        setTimeout(() => {
          showInfoSnackBar('Hold ctrl and scroll to zoom in 🔎', 5000);
        }, 2000);
      }
      setShownSnackbar(true);
    }
  }, [shownSnackbar, setShownSnackbar, dataStore.ready]);

  useEffect(() => {
    if (xsDown()) {
      if (whoDataStore.ready) {
        setTimeout(() => {
          setColors(generateNewColors(whoDataStore.possibleRegions.length));
        }, 2000);
      }
    }
  }, [whoDataStore.ready, whoDataStore.possibleRegions]);

  const DashboardSwitch = () => {
    return (
      <Fab
        onClick={() => {
          if (dataType === 'dead') {
            setDataType('confirmed');
          } else {
            setDataType('dead');
          }
        }}
        variant='extended'
        size='small'
        color='primary'
        aria-label='add'
        style={{ padding: '0 12px' }}
      >
        {dataType === 'confirmed' ? (
          <>
            <LocalHospitalIcon />
            confirmed cases
          </>
        ) : (
          <>
            <AirlineSeatFlatIcon />
            deaths
          </>
        )}
      </Fab>
    );
  };

  return (
    <Dashboard title='World' Icon={DashboardSwitch} showPerCapitaSwitch={false}>
      <Grid
        item
        xs={12}
        style={{
          position: 'relative',
          maxWidth: '100%',
          height: '100%',
          maxHeight: '100vh',
        }}
      >
        <Card className={classes.mapCard}>
          {dataStore.ready && (
            <div className={classes.bigNumberContainer}>
              <Typography className={classes.bigNumber} component='span' variant='body1'>
                {dataType === 'confirmed'
                  ? numberWithCommas(dataStore.totalConfirmedCasesArray[sliderValue]?.totalCases)
                  : numberWithCommas(dataStore.totalDeathsArray[sliderValue]?.totalDeaths)}
              </Typography>
            </div>
          )}
          <div
            style={{
              maxWidth: '1000px',
              position: 'relative',
              margin: '0 auto',
              zIndex: 1,
              marginTop: '-2%',
            }}
          >
            {dataStore.datesConverted?.length ? (
              <>
                <MapChart date={date} setTooltipContent={setTooltipContent} dataType={dataType} />
                <ReactTooltip>{tooltipContent}</ReactTooltip>
              </>
            ) : null}
          </div>
        </Card>
        {/* </Grow> */}
      </Grid>
      {dataStore.ready && (
        <NumberGrid dataType={dataType} setDataType={setDataType} sliderValue={sliderValue} />
      )}
      <Grid item xs={12}>
        <Grow in={whoDataStore.ready}>
          <Paper
            className={classes.paper}
            style={{ height: '550px', maxHeight: '90vh', width: '100%' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                height: '27px',
              }}
            >
              <Title>{dataType === 'confirmed' ? 'Cases' : 'Deaths'} by continent</Title>
              <Hidden xsDown>
                <Button
                  style={{
                    maxWidth: 300,
                    marginBottom: 10,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                  variant='outlined'
                  color='secondary'
                  size={'small'}
                  onClick={() => {
                    setColors(generateNewColors(whoDataStore.possibleRegions?.length));
                  }}
                >
                  <ColorLensIcon />
                  New colors
                </Button>
              </Hidden>

              <Hidden smUp>
                <IconButton
                  style={{
                    maxWidth: 300,
                    // marginTop: -10,
                    marginBottom: 10,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                  variant='outlined'
                  color='secondary'
                  size={'small'}
                  onClick={() => {
                    setColors(generateNewColors(whoDataStore.possibleRegions?.length));
                  }}
                >
                  <ColorLensIcon />
                </IconButton>
              </Hidden>
            </div>
            <WhoBarChart colors={colors} dataType={dataType} sliderValue={sliderValue} />
          </Paper>
        </Grow>
      </Grid>
      {/* <Hidden xsDown>
        <div className={classes.sliderWrapper}>
          {sliderValue !== undefined && dataStore?.datesConverted?.length && date ? (
            <Paper className={classes.sliderPaper}>
              <div className={classes.slider}>
                <IconButton
                  onClick={() => {
                    if (sliderValue === maxSliderValue) {
                      setSliderValue(0);
                    }
                    setPlaying(!playing);
                  }}
                >
                  {!playing ? <PlayCircleFilledIcon /> : <StopIcon />}
                </IconButton>
                <IOSSlider
                  valueLabelFormat={getSliderValueTextFunc(dataStore.datesConverted)}
                  getAriaValueText={getSliderValueTextFunc(dataStore.datesConverted)}
                  aria-labelledby='dates-map-slider'
                  valueLabelDisplay='auto'
                  onChange={(event: any, newValue: number | number[]) => {
                    setSliderValue(newValue as number);
                  }}
                  value={sliderValue}
                  step={1}
                  marks
                  min={0}
                  max={maxSliderValue}
                />
              </div>
            </Paper>
          ) : null}
        </div>
      </Hidden> */}
    </Dashboard>
  );
});

const WhoBarChart = observer(
  ({
    colors,
    dataType,
    sliderValue,
  }: {
    colors: string[];
    dataType: DataType;
    sliderValue: number;
  }) => {
    const whoDataStore = useWhoDataStore();
    return (
      <ResponsiveContainer height={'100%'} maxHeight={'80vh'}>
        <BarChart
          data={whoDataStore?.getDataArrayWithTime(dataType, sliderValue ? sliderValue : undefined)}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid strokeDasharray='1 6' />
          <XAxis dataKey='time' tickFormatter={formatXAxis} height={50} />
          {getYAxis('Cases')}
          <Tooltip
            labelFormatter={(tickItem: number) => moment(tickItem * 1000).format('MMMM Do')}
            formatter={numberWithCommas}
          />
          <Legend />
          {colors &&
            whoDataStore?.possibleRegions?.map((region, i) => {
              return <Bar dataKey={region} stackId={'a'} fill={colors[i]} key={i} />;
            })}
        </BarChart>
      </ResponsiveContainer>
    );
  }
);

const TIME_FORMAT = 'MMM Do';
const formatXAxis: TickFormatterFunction = (tickItem: number) =>
  moment(tickItem * 1000).format(TIME_FORMAT);

export default MapPage;
