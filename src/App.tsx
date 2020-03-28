import React, { useEffect, createRef, useState } from 'react';
import { Switch, useHistory } from 'react-router';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import ComparisonPage from './pages/Comparison';
import Todo from './pages/Todo';
import MapPage from './pages/Map';
import googleAnalyticsInstance from './utils/googleAnalytics';
import { SnackbarProvider } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CustomizedSnackbar from './components/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import StopIcon from '@material-ui/icons/Stop';
import IOSSlider from './components/IOSSlider';
import Typography from '@material-ui/core/Typography';
import useDataStore from './data/dataStore';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  sliderWrapper: {
    position: 'fixed',
    width: 'calc(100vw - 56px)',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    bottom: 0,
    background: '#fff',
    marginLeft: 56,
    // [theme.breakpoints.up('sm')]: {
    //   bottom: '10vh',
    // },
    // [theme.breakpoints.down('xs')]: {
    //   bottom: '1vh',
    // },
  },
  slider: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Routes = ({ sliderValue, setSliderValue, playing }) => {
  const history = useHistory();

  useEffect(() => {
    let prevLocation: Location;
    const unlisten = history.listen((location, action) => {
      if (!prevLocation || prevLocation.pathname !== location.pathname) {
        googleAnalyticsInstance.pageView();
      }
      prevLocation = location;
    });
    return () => unlisten();
  }, [history]);

  const R = (Component) => {
    return (props) => (
      <Component
        {...props}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        playing={playing}
      />
    );
  };

  return (
    <Switch>
      <Route path='/dashboard/:country' render={R(DashboardPage)} />
      <Route exact path='/dashboard' render={R(DashboardPage)} />
      <Route exact path='/map' render={R(MapPage)} />
      <Route path='/infection-trajectories/:country' render={R(ComparisonPage)} />
      <Route exact path='/infection-trajectories' render={R(ComparisonPage)} />
      <Route exact path='/todo' component={Todo} />
      <Redirect from='/' to='/map' />
      {/* <Route exact path='/login' component={Login} />
  <Route exact path='/signup' component={SignUp} /> */}
    </Switch>
  );
};

const App: FC = observer(() => {
  const notistackRef = createRef();
  const onClickDismiss = (key: string | number | undefined) => () => {
    if (notistackRef && notistackRef.current) {
      notistackRef.current.closeSnackbar(key);
    }
  };
  const classes = useStyles();
  const dataStore = useDataStore();
  const [sliderValue, setSliderValue] = useState<number>();
  const [playing, setPlaying] = useState(false);
  const [maxSliderValue, setMaxSliderValue] = useState();

  useEffect(() => {
    dataStore.sliderValue = sliderValue;
  }, [sliderValue]);

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
    if (dataStore && dataStore.datesConverted && !maxSliderValue) {
      setMaxSliderValue(dataStore.datesConverted.length - 1);
      setSliderValue(dataStore.datesConverted.length - 1);
    }
  }, [dataStore, dataStore.datesConverted]);

  const Slider = () => {
    const getSliderValueTextFunc = (dates: string[]) => (value: number) => dates[value];

    return (
      <div className={classes.sliderWrapper}>
        {sliderValue !== undefined && dataStore?.datesConverted?.length ? (
          <Paper style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className={classes.slider}>
              <Typography style={{ marginTop: '-1px' }}>Play</Typography>
              <IconButton
                onClick={() => {
                  if (playing) {
                    setSliderValue(sliderValue);
                  } else {
                    if (sliderValue === maxSliderValue) {
                      setSliderValue(0);
                    } else {
                      setSliderValue(sliderValue);
                    }
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
                onChangeCommitted={(event: any, newValue: number | number[]) => {
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
    );
  };
  return (
    // <AuthProvider>
    <SnackbarProvider
      ref={notistackRef}
      action={(key) => (
        <IconButton
          color='inherit'
          aria-label='dismiss pop up'
          onClick={onClickDismiss(key)}
          edge='start'
        >
          <CloseIcon />
        </IconButton>
      )}
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      dense={false}
    >
      <CustomizedSnackbar />
      <Slider />
      <BrowserRouter>
        <Routes sliderValue={sliderValue} setSliderValue={setSliderValue} playing={playing} />
      </BrowserRouter>
    </SnackbarProvider>

    // </AuthProvider>
  );
});

export default App;
