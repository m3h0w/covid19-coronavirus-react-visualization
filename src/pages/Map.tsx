import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MapChart from 'components/MapChart';
import Dashboard from 'components/Dashboard/Dashboard';
import useDataStore from '../data/dataStore';
import { observer } from 'mobx-react-lite';
import IOSSlider from '../components/IOSSlider';
import ReactTooltip from 'react-tooltip';
import createPersistedState from '../utils/memoryState';
import { showInfoSnackBar } from '../components/Snackbar';
import { useStateAndLocalStorage } from 'persistence-hooks';
import Typography from '@material-ui/core/Typography';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/Stop';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import AirlineSeatFlatIcon from '@material-ui/icons/AirlineSeatFlat';
import { Fab, Card, Grow, Slide, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import last from '../utils/last';
import Title from 'components/Dashboard/Title';
import NumberWithTitle from '../components/NumberWithTitle';
import { animationTime, GLOBAL_PAPER_OPACITY } from '../utils/consts';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import useWhoDataStore from '../data/whoDataStore';
import { mdUp } from '../utils/breakpoints';
import Colors from '../utils/colors';
import getYAxis from '../components/Dashboard/YAxis';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  sliderWrapper: {
    position: 'absolute',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      bottom: '10vh',
    },
    [theme.breakpoints.down('xs')]: {
      bottom: '1vh',
    },
  },
  slider: {
    width: '70%',
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
}));

const NumberGrid = observer(({ setDataType, sliderValue }) => {
  const classes = useStyles();
  const dataStore = useDataStore();
  if (!dataStore.ready) {
    return null;
  }
  const totalCases = dataStore.totalConfirmedCasesArray[sliderValue]?.totalCases || '';
  const totalDeaths = dataStore.totalDeathsArray[sliderValue]?.totalDeaths || '';
  let mortalityRate: number | string = '';
  if (totalCases && totalDeaths) {
    mortalityRate = totalDeaths / totalCases;
  }
  return (
    <>
      <Grid
        item
        lg={4}
        xs={12}
        onClick={() => {
          setDataType('confirmed');
        }}
        style={{ cursor: 'pointer' }}
      >
        <Grow in={dataStore.ready}>
          <Paper className={classes.paper}>
            <NumberWithTitle
              version='large'
              centered={true}
              color={'primary'}
              title={'Confirmed cases (world)'}
              number={totalCases || ''}
            />
          </Paper>
        </Grow>
      </Grid>
      <Grid
        item
        lg={4}
        xs={12}
        onClick={() => {
          setDataType('dead');
        }}
        style={{ cursor: 'pointer' }}
      >
        <Grow in={dataStore.ready}>
          <Paper className={classes.paper}>
            <NumberWithTitle
              version='large'
              centered={true}
              color={'initial'}
              title={'Deaths (world)'}
              number={totalDeaths || ''}
            />
          </Paper>
        </Grow>
      </Grid>
      <Grid item lg={4} xs={12}>
        <Grow in={dataStore.ready}>
          <Paper className={classes.paper}>
            <NumberWithTitle
              version='large'
              centered={true}
              color={'secondary'}
              title={'Motality rate (world)'}
              number={`${(mortalityRate * 100).toFixed(2)}%` || ''}
            />
          </Paper>
        </Grow>
      </Grid>
      {/* <Grid item lg={3} sm={6} xs={12}>
  <Paper className={classes.paper}>100</Paper>
</Grid>
<Grid item lg={3} sm={6} xs={12}>
  <Paper className={classes.paper}>100</Paper>
</Grid> */}
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
  const [dataType, setDataType] = useState<'dead' | 'confirmed'>('confirmed');
  const [colors, setColors] = useState();
  const whoDataStore = useWhoDataStore();
  const generateNewColors = () => {
    const colorHelper = new Colors();
    setColors(whoDataStore.possibleRegions?.map(() => colorHelper.getRandomColor()));
  };

  useEffect(() => {
    generateNewColors();
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
    if (playing) {
      if (sliderValue === maxSliderValue) {
        setPlaying(false);
      } else {
        setTimeout(() => {
          setSliderValue((prev) => Math.min(prev + 1, maxSliderValue));
        }, 350);
      }
    }
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
    <Dashboard title='Map' Icon={DashboardSwitch}>
      <Grid
        item
        xs={12}
        style={{
          position: 'relative',
          maxWidth: '100%',
          height: '100%',
          maxHeight: '100vh',
          // paddingTop: 0,
        }}
      >
        {/* <Grow in={dataStore.ready} timeout={animationTime}> */}
        <Card className={classes.mapCard}>
          {dataStore.ready && (
            <div className={classes.bigNumberContainer}>
              <Typography className={classes.bigNumber} component='span' variant='body1'>
                {dataType === 'confirmed'
                  ? dataStore.totalConfirmedCasesArray[sliderValue]?.totalCases
                  : dataStore.totalDeathsArray[sliderValue]?.totalDeaths}
              </Typography>
            </div>
          )}
          <div
            style={{
              maxWidth: '1000px',
              // height: '500px',
              position: 'relative',
              margin: '0 auto',
              zIndex: 1,
              // height: '80%',
              // maxHeight: '105vh',
              // overflow: 'auto',
              // padding: '30px',
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
          <div className={classes.sliderWrapper}>
            {sliderValue !== undefined && dataStore?.datesConverted?.length && date ? (
              <div className={classes.slider}>
                <Typography style={{ marginTop: '-1px' }}>Play</Typography>
                <IconButton
                  onClick={() => {
                    if (playing) {
                      setSliderValue(maxSliderValue);
                    } else {
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
            ) : null}
          </div>
        </Card>
        {/* </Grow> */}
      </Grid>
      {dataStore.ready && <NumberGrid setDataType={setDataType} sliderValue={sliderValue} />}
      <Grid item xs={12}>
        <Paper className={classes.paper} style={{ height: '500px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title>Cases by continent</Title>
            <Button
              style={{ maxWidth: 300, marginBottom: 10 }}
              variant='outlined'
              color='secondary'
              size={'small'}
              onClick={() => {
                generateNewColors();
              }}
            >
              New colors
            </Button>
          </div>
          <WhoBarChart colors={colors} />
        </Paper>
      </Grid>
    </Dashboard>
  );
});

const WhoBarChart = observer(({ colors }: { colors: string[] }) => {
  const whoDataStore = useWhoDataStore();
  return (
    <ResponsiveContainer>
      <BarChart
        data={whoDataStore?.getDataArrayWithTime}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='1 6' />
        <XAxis dataKey='time' tickFormatter={formatXAxis} />
        {getYAxis('Cases')}
        <Tooltip />
        <Legend />
        {whoDataStore?.possibleRegions?.map((region, i) => {
          return <Bar dataKey={region} stackId={'a'} fill={colors[i]} key={i} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
});

const TIME_FORMAT = 'MMM Do';
const formatXAxis: TickFormatterFunction = (tickItem: number) =>
  moment(tickItem * 1000).format(TIME_FORMAT);

export default MapPage;
